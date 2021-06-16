import { init } from "./init";
init(); // To set all env
import { expect } from 'chai';
import { tempDir } from "../Constants/SSL_FOR_FREE";
import path from 'path';
import { AwsService } from "../Services/AwsService";

describe('To check aws s3 utility', () => {
    // it('Should be able to upload dummy file', async () => {
    //     const filepath = path.join(tempDir, "//1B27CB5D9CF48D16FEE215D036347936.txt");

    //     const result = await AwsService.uploadFile(
    //         filepath,
    //         'assets/ssl/cocojaunt.com/'
    //     )
    //     expect(result).to.be.not.null;
    //     expect(result.ETag).to.be.not.null;
    // });

    // it('should be able to get queueu url', async () => {
    //     const queueName = "test";
    //     const queueUrl = await AwsService.getQueueUrlByName(queueName);
    //     console.log(queueUrl);

    //     expect(queueUrl).to.be.not.null;
    // })

    it('should be able to get queue length', async () => {
        const queueUrl = await AwsService.getQueueUrlByName('test');
        const result = await AwsService.getQueueLength(queueUrl);
        
        expect(typeof result).to.be.eql('number');
    })
})