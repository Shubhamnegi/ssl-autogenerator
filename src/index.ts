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


const queue = new DelayedQueueConsumer();
queue.setQueueName(AWS_CONSTANTS.delayedQueue);
queue.startPoll();

