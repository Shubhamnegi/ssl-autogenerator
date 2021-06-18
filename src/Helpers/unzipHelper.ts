import { unlinkSync } from 'fs'
import { execSync } from 'child_process'

export const unzipHelper = (zipPath: string, directory: string, removeZip = true) => {
    execSync(`unzip ${zipPath} -d ${directory}`)
    if (removeZip) {
        unlinkSync(zipPath);
    }
}