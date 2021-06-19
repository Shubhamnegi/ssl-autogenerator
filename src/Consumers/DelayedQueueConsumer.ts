import { Message } from "@aws-sdk/client-sqs";
import { NextActionEnum } from "../Constants/NextActionEnum";
import { getLogger } from "../Helpers/logger";
import { AwsService } from "../Services/AwsService";
import { CertificateService } from "../Services/CertificateService";

export class DelayedQueueConsumer {
    private stop = false;
    private queueUrl: string = "";
    private queueName: string = "";
    private logger = getLogger('DelayedQueueConsumer');

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
            if (this.stop) {
                this.logger.info('stoping poll for q: ' + this.queueUrl);
                break;
            }

            const queueLength = await AwsService.getQueueLength(this.queueUrl);
            if (queueLength === 0) {
                this.logger.debug("No message found, sleeping")
                DelayedQueueConsumer.sleep(10000) // sleep for 10 sec;
            }
            const messages = await AwsService.getQueueMessage(this.queueUrl);
            if (messages.length === 0) {
                // as the previos check gets only approximate value
                this.logger.debug("No message found, sleeping")
                DelayedQueueConsumer.sleep(10000) // sleep for 10 sec;
            }
            for (const message of messages) {
                await this.handle(message);
                this.deleteMessage(message.ReceiptHandle as string);
            }
        }
    }

    private async deleteMessage(receiptHandle: string) {
        this.logger.debug("deleting message");
        await AwsService.deleteMessage(this.queueUrl, receiptHandle);
    }

    async handle(message: Message) {
        const log = this.logger.child({ id: message.MessageId });
        log.debug(message.Body);
        const data = JSON.parse(message.Body as string);
        const action = data.payload.nextAction;
        const certificateHash = data.payload.certificateHash;
        switch (action) {
            case NextActionEnum.VALIDATE:
                CertificateService.triggerValidation(certificateHash);
                break;
            case NextActionEnum.VALIDATION_STATUS:
                CertificateService.getValidationStatus(certificateHash);
                break
            default:
                log.error("action " + action + " is not handled");
        }
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