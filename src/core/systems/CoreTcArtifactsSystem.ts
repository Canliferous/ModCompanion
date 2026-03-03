import * as AWS from "@aws-sdk/client-s3";
import { getAppConfig } from "./CoreConfigSystem.js";
import { SharedTcArtifactsListAllMapsReport, SharedTcArtifactsListAllMapsReportMap } from "Shared/SharedTcArtifacts.js";
import { filename } from "pathe/utils";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "path";
import { pipeline } from "node:stream/promises";
import { Logger } from "./CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import humanizePlus from "humanize-plus";

let s3Client: AWS.S3 | undefined = undefined;
let s3Bucket: string | undefined = undefined;
let unconfigured = false;

const RETRIES = 3;

export const TcArtifactsSystem = {
    async initSystem() {
        const config = getAppConfig();
        if (!config.teamCityArtifactCloud || !config.teamCityArtifactCloudBucket) {
            console.warn("TeamCity artifact cloud not configured. Disabling system");
            unconfigured = true;
            return true;
        }
        const client = new AWS.S3(config.teamCityArtifactCloud);

        try {
            const response = await client.listBuckets();
            const bucketFound = response.Buckets?.some((b) => b.Name === config.teamCityArtifactCloudBucket);
            if (!bucketFound) {
                console.warn(
                    `TeamCity artifact cloud system connected but couldn't find bucket ${config.teamCityArtifactCloudBucket}. Buckets are: ${response.Buckets?.map((b) => b.Name).join(", ") ?? "<none>"}`,
                );
            } else {
                s3Client = client;
                s3Bucket = config.teamCityArtifactCloudBucket;
            }
        } catch (e) {
            console.warn("Couldn't connect to TeamCity artifact cloud service", e);
        }

        return true;
    },
    async isCloudConnected(): Promise<boolean> {
        const connected = await _useS3(async () => true);
        return connected ?? false;
    },
    async listAllObjects() {
        return _useS3(async (client, bucket) => {
            const response = await client.listObjectsV2({ Bucket: bucket });
            return response?.Contents;
        });
    },
    async listMaps(): Promise<SharedTcArtifactsListAllMapsReport | undefined> {
        return _useS3(async (client, bucket): Promise<SharedTcArtifactsListAllMapsReport | undefined> => {
            const response = await client.listObjectsV2({
                Bucket: bucket,
                Prefix: "PortalRevolution2/PortalRevolution2_MapCompile/",
            });
            const contents = response?.Contents;
            if (contents === undefined || contents.length === 0) {
                return undefined;
            }

            const mapsMap = new Map<string, SharedTcArtifactsListAllMapsReportMap[]>();
            for (const content of contents) {
                if (content.Size === undefined || content.LastModified === undefined || content.Key === undefined)
                    continue;

                const mapName = filename(content.Key);
                if (mapName === undefined) continue;

                const entry: SharedTcArtifactsListAllMapsReportMap = {
                    size: content.Size,
                    dateModified: content.LastModified,
                    objectKey: content.Key,
                };

                if (!mapsMap.has(mapName)) {
                    mapsMap.set(mapName, [entry]);
                } else {
                    mapsMap.get(mapName)?.push(entry);
                }
            }

            for (const arr of mapsMap.values()) {
                arr.sort((a, b) => b.dateModified.getTime() - a.dateModified.getTime());
            }

            return { maps: mapsMap };
        });
    },
    async downloadMap(objectKey: string, mapName: string): Promise<boolean> {
        const result = await _useS3(async (client, bucket): Promise<boolean> => {
            Logger.info(SharedLogChannel.TcArtifacts, `Downloading map object ${objectKey} to ${mapName}`);
            const a = await client.getObject({ Bucket: bucket, Key: objectKey });
            const s3Stream = a.Body as NodeJS.ReadableStream;
            if (!s3Stream) {
                Logger.warning(SharedLogChannel.TcArtifacts, "Failed to establish S3 stream");
                return false;
            }

            if (a.ContentLength) {
                Logger.info(SharedLogChannel.TcArtifacts, `Map file is ${humanizePlus.fileSize(a.ContentLength)}`);
            }

            const fullPath = path.join(getAppConfig().mapOutputPath, path.basename(mapName).replace(".vmf", ".bsp"));
            try {
                await fs.rm(fullPath);
            } catch (e) {
                Logger.warning(SharedLogChannel.TcArtifacts, `Failed to delete`, fullPath, e);
                return false;
            }

            const writeStream = createWriteStream(fullPath);
            await pipeline(s3Stream, writeStream);
            Logger.info(SharedLogChannel.TcArtifacts, `Download complete`);
            return true;
        });
        return result ?? false;
    },
};

function _sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}

async function _useS3<T>(callback: (client: AWS.S3, bucket: string) => Promise<T>): Promise<T | undefined> {
    if (unconfigured) return undefined;

    for (let i = 0; i < RETRIES; i++) {
        if (s3Client && s3Bucket) {
            return callback(s3Client, s3Bucket);
        }

        await TcArtifactsSystem.initSystem();
        await _sleep(2000);
    }

    return undefined;
}
