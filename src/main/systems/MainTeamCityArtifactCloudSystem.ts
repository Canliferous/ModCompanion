import { ListBucketsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getAppConfig } from "./MainConfigSystem.js";

let s3Client: S3Client | undefined = undefined;
const bucket = "secondface-tc-revo2";
const RETRIES = 3;

export const TeamCityArtifactCloudSystem = {
    async initSystem() {
        const config = getAppConfig();
        if (!config.teamCityArtifactCloud) {
            console.warn("TeamCity artifact cloud not configured. Disabling system");
            return true;
        }
        const client = new S3Client(config.teamCityArtifactCloud);

        try {
            const response = await client.send(new ListBucketsCommand());
            const bucketFound = response.Buckets?.some((b) => b.Name === bucket);
            if (!bucketFound) {
                console.warn(
                    `TeamCity artifact cloud system connected but couldn't find bucket ${bucket}. Buckets are: ${response.Buckets?.map((b) => b.Name).join(", ") ?? "<none>"}`,
                );
            } else {
                s3Client = client;
            }
        } catch (e) {
            console.warn("Couldn't connect to TeamCity artifact cloud service", e);
        }

        return true;
    },
    isCloudConnected() {
        return s3Client !== undefined;
    },
    async listAllObjects() {
        return _useS3(async (client) => {
            const response = await s3Client?.send(new ListObjectsV2Command({ Bucket: bucket }));
            return response?.Contents;
        });
    },
};

function _sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeMs);
    });
}

async function _useS3<T>(callback: (client: S3Client) => Promise<T>): Promise<T | undefined> {
    for (let i = 0; i < RETRIES; i++) {
        if (s3Client) {
            return callback(s3Client);
        }

        await TeamCityArtifactCloudSystem.initSystem();
        await _sleep(2000);
    }

    return undefined;
}
