import * as dotenv from 'dotenv';
import * as path from 'path';

export const init = () => {
    dotenv.config({
        path: path.join(__dirname, "../.env")
    })    
}