import * as path from 'path'
import * as dotenv from 'dotenv'
// if (process.env.NODE_ENV === "LOCAL") {
// THIS IS LOCAL ENV LOAD .ENV  
dotenv.config({
    path: path.join(__dirname, ".env")
})
// }

// Start other imports from here


import { AWS_CONSTANTS } from './Constants/AWS_CONSTANTS';
import { DelayedQueueConsumer } from './Consumers/DelayedQueueConsumer';

import express from "express";
import * as expressBunyan from 'express-bunyan-logger'
import Logger from "bunyan";
import { HttpError } from "./Errors/HttpError";
import { getLogger } from './Helpers/logger';
import { Mysql } from './Connections/mysql';


const applicationLogger = getLogger("application-logger")

const app = express();
const port = 8080; // default port to listen

app.get('/health', (req, res, next) => {
    return res.json({ status: "up" })
})

app.use(expressBunyan.default())

// Use next function for error handling
const errorHandler = (
    err: HttpError | Error,
    req: any,
    res: any,
    next: any
) => {
    const log: Logger = req.log ? req.log : applicationLogger;
    let status = 500;
    let message = "Internal server error";
    if (err instanceof HttpError) {
        status = err.status
        message = err.message
        log.error(err.error);
    } else {
        log.error(err)
    }

    return res.status(status).json({
        error: message,
        status
    })
}


// Register error handler
app.use(errorHandler);

// start the express server
app.listen(port, async () => {
    // tslint:disable-next-line:no-console
    // Inititate mysql connection
    Mysql.connect();
    await Mysql.healthCheck();

    // Initiate sqs
    const queue = new DelayedQueueConsumer();
    queue.setQueueName(AWS_CONSTANTS.delayedQueue);
    queue.startPoll();

    applicationLogger.info(`server started at http://localhost:${port}`);
});


