export const AWS_CONSTANTS = {
    region: process.env.AWS_REGION as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
    bucket: process.env.AWS_BUCKET as string,
    s3Domain: process.env.S3_DOMAIN as string,
    delayedQueue: process.env.DELAYED_QUEUE as string,
}