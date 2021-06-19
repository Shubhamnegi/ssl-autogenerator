import { unlinkSync } from 'fs'
import { execSync } from 'child_process'
import { getLogger } from './logger'

const logger = getLogger('unzip')

export const unzipHelper = (zipPath: string, directory: string, removeZip = true) => {
    logger.info('unzip initieated for ' + zipPath);
    execSync(`unzip -o ${zipPath} -d ${directory}`);
    if (removeZip) {
        unlinkSync(zipPath);
    }
}