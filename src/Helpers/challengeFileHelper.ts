import { createWriteStream, closeSync, openSync } from 'fs'
import { tempDir } from '../Constants/SSL_FOR_FREE';
import path from 'path';

/**
 * This will strip file name from link
 * Create a file with the name 
 * Append contents to the file from contents array
 * @param link {string} url of the validation file 
 * @param contents {Array<string>} 
 */
export const challengeFileHelper = (link: string, contents: string[]) => {
    const filename = link.substr(link.lastIndexOf("/") + 1);
    const fullpath = path.join(tempDir, "\\" + filename);

    closeSync(openSync(fullpath, 'w'))

    const stream = createWriteStream(fullpath);
    for (let i = 0; i < contents.length; i++) {
        const line = contents[i];
        stream.write((i !== 0 ? "\n" : "") + line);
    }
    return fullpath;
}

export const createBufferFromArray = (contents: string[]) => {
    const str = contents.join("\n");
    const buffer = Buffer.from(str, 'utf-8');
    return buffer;
}