import { init } from "./init";
init(); // To set all env
import { expect } from 'chai';
import { tempDir } from "../Constants/SSL_FOR_FREE";
import path from 'path';
import { AwsService } from "../Services/AwsService";

describe('To check aws s3 utility', () => {
    it('Should be able to upload dummy file', async () => {
        const filepath = path.join(tempDir, "//1B0FFD0EBD303CD85643A543010F737D.txt");

        const result = await AwsService.uploadFile(
            filepath,
            'assets/ssl/0/'
        )
        expect(result).to.be.not.null;
        expect(result.ETag).to.be.not.null;
    })
})