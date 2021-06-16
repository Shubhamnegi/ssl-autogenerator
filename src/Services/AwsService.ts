import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { GetQueueAttributesCommand, GetQueueUrlCommand, SendMessageCommand, SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'
import { MessageAttributeValue, PublishCommand, SNSClient } from '@aws-sdk/client-sns'

import { AWS_CONSTANTS } from '../Constants/AWS_CONSTANTS';
import { readFile } from 'fs'
import path from 'path';
import { getLogger } from '../Helpers/logger';


const cred = {
    accessKeyId: AWS_CONSTANTS.accessKeyId,
    secretAccessKey: AWS_CONSTANTS.secretAccessKey
};
const s3client = new S3Client({
    region: AWS_CONSTANTS.region,
    credentials: cred
});

const sqsclient = new SQSClient({
    region: AWS_CONSTANTS.region,
    credentials: cred
});

const snsclient = new SNSClient({
    region: AWS_CONSTANTS.region,
    credentials: cred
});




export class AwsService {
    static logger = getLogger('AwsService');
    private static async uploadToS3(Bucket: string, Key: string, Body: string | Buffer) {
        const command = new PutObjectCommand({
            Bucket,
            Key,
            Body,
            ACL: 'public-read',
            ContentType: "text/plain"
        });

        this.logger.debug(`uploading file to ${Bucket} with key ${Key}`);
        const result = await s3client.send(command);
        return result;
    }

    public static async uploadFile(filePath: string, prefix: string) {
        const fileData = await this.readFilePromise(filePath);
        const fileName = path.parse(filePath).name + path.parse(filePath).ext;

        return this.uploadToS3(AWS_CONSTANTS.bucket, prefix + fileName, fileData)
    }

    public static async uploadFileBuffer(buffer: Buffer, fullPath: string) {
        return this.uploadToS3(AWS_CONSTANTS.bucket, fullPath, buffer)
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

    /**
     * To push new message to topic which can later be divided into multiple queue
     */
    public static async pushMessageToTopic(topicArn: string, message: string, attributes: { [key: string]: MessageAttributeValue }) {
        const command = new PublishCommand({
            Message: message,
            MessageAttributes: attributes,
            TopicArn: topicArn
        });

        this.logger.debug(`Pushing message to topic ${topicArn} with message ${JSON.stringify(message)}`)

        const result = await snsclient.send(command);
        return result;
    }

    /**
     * To push message to sqs direclty
     * Will be used to push message to a delayed queue which will be used for cert validation  
     */
    public static async pushMessageToQueue(message: string, queueUrl: string, delay = 60) {
        const command = new SendMessageCommand({
            MessageBody: message,
            QueueUrl: queueUrl,
            DelaySeconds: delay
        })
        this.logger.debug(`Pushing message to queue ${queueUrl} with message ${JSON.stringify(message)} Delay: ${delay}`)
        const result = await sqsclient.send(command);
        return result
    }

    /**
     * To get queue url by name
     * @param queueName 
     * @returns 
     */
    public static async getQueueUrlByName(queueName: string): Promise<string> {
        const command = new GetQueueUrlCommand({
            QueueName: queueName
        });
        const result = await sqsclient.send(command);
        if (!result.QueueUrl) {
            throw new Error("queue not found");
        }
        return result.QueueUrl;
    }

    public static async getQueueLength(QueueUrl: string) {
        const command = new GetQueueAttributesCommand({
            QueueUrl,
            AttributeNames: ['ApproximateNumberOfMessages']
        });

        const result = await sqsclient.send(command);
        if (!result || !result.Attributes || !result.Attributes.ApproximateNumberOfMessages) {
            return 0;
        }
        const len = result?.Attributes?.ApproximateNumberOfMessages as string;
        return Number.parseInt(len);
    }

    public static async getQueueMessage(
        QueueUrl: string,
        MaxNumberOfMessages = 10,
        VisibilityTimeout = 60,
        WaitTimeSeconds = 20
    ) {
        const command = new ReceiveMessageCommand({
            QueueUrl,
            MaxNumberOfMessages,
            VisibilityTimeout,
            WaitTimeSeconds
        });
        const result = await sqsclient.send(command);
        return result.Messages || [];
    }

    public static async deleteMessage(QueueUrl: string, ReceiptHandle: string) {
        const command = new DeleteMessageCommand({
            QueueUrl,
            ReceiptHandle
        });

        const result = await sqsclient.send(command);
        return result;
    }
}


