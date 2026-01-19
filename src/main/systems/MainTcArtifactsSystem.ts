import { ListBucketsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getAppConfig } from "./MainConfigSystem.js";

let s3Client: S3Client | undefined = undefined;
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
        const client = new S3Client(config.teamCityArtifactCloud);

        try {
            const response = await client.send(new ListBucketsCommand());
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
            const response = await client.send(new ListObjectsV2Command({ Bucket: bucket }));
            return response?.Contents;
        });
    },
};

function _sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}

async function _useS3<T>(callback: (client: S3Client, bucket: string) => Promise<T>): Promise<T | undefined> {
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
