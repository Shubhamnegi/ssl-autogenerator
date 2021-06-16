import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { AWS_CONSTANTS } from '../Constants/AWS_CONSTANTS';
import { readFile } from 'fs'
import path from 'path';
import { getLogger } from '../Helpers/logger';

const client = new S3Client({
    region: AWS_CONSTANTS.region,
    credentials: {
        accessKeyId: AWS_CONSTANTS.accessKeyId,
        secretAccessKey: AWS_CONSTANTS.secretAccessKey
    }
});


export class AwsService {
    static logger = getLogger('AwsService');
    private static async uploadToS3(Bucket: string, Key: string, Body: string | Buffer) {
        const command = new PutObjectCommand({
            Bucket,
            Key,
            Body
        });

        this.logger.debug(`uploading file to ${Bucket} with key ${Key}`);
        const result = await client.send(command);
        return result;
    }

    public static async uploadFile(filePath: string, prefix: string) {
        const fileData = await this.readFilePromise(filePath);
        const fileName = path.parse(filePath).name + path.parse(filePath).ext;

        return this.uploadToS3(AWS_CONSTANTS.bucket, prefix + fileName, fileData)
    }

    private static readFilePromise(filepath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            readFile(filepath, (err, data) => {
                if (err)
                    return reject(err);
                return resolve(data);
            })
        })
    }
}


