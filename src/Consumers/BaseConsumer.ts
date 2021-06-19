import { Message } from "@aws-sdk/client-sqs";
import { getLogger } from "../Helpers/logger";
import { AwsService } from "../Services/AwsService";

export class BaseConsumer {
    protected stop = false;
    protected queueUrl: string = "";
    protected queueName: string = "";
    protected logger = getLogger('BaseConsumer');


    setQueueName(queueName: string) {
        this.queueName = queueName
    }

    setQueueUrl(queueUrl: string) {
        this.queueUrl = queueUrl
    }
    async startPoll() {
        if (!this.queueUrl) {
            if (!this.queueName) {
                throw Error('Queue name not set')
            };
            this.queueUrl = await AwsService.getQueueUrlByName(this.queueName);
        };
        this.logger.debug("starting poll for " + this.queueUrl);
        while (true) {
            try {
                if (this.stop) {
                    this.logger.info('stoping poll for q: ' + this.queueUrl);
                    break;
                }

                const queueLength = await AwsService.getQueueLength(this.queueUrl);
                if (queueLength === 0) {
                    this.logger.debug("No message found, sleeping")
                    BaseConsumer.sleep(10000) // sleep for 10 sec;
                }
                const messages = await AwsService.getQueueMessage(this.queueUrl);
                if (messages.length === 0) {
                    // as the previos check gets only approximate value
                    this.logger.debug("No message found, sleeping")
                    BaseConsumer.sleep(10000) // sleep for 10 sec;
                }
                for (const message of messages) {
                    await this.handle(message);
                    this.deleteMessage(message.ReceiptHandle as string);
                }
            } catch (error) {
                this.logger.error(error)
            }
        }
    }
    private async deleteMessage(receiptHandle: string) {
        this.logger.debug("deleting message");
        await AwsService.deleteMessage(this.queueUrl, receiptHandle);
    }

    async handle(message: Message) {
        throw new Error("Please override handle")
    }

    stopPoll() {
        this.stop = true;
    }

    public static sleep(timeout: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve(null);
            }, timeout);
        })
    }


}