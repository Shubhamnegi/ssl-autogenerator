import * as path from 'path'
import * as dotenv from 'dotenv'
if (process.env.NODE_ENV === "LOCAL") {
    // THIS IS LOCAL ENV LOAD .ENV  
    dotenv.config({
        path: path.join(__dirname, ".env")
    })
}

// Start other imports from here
