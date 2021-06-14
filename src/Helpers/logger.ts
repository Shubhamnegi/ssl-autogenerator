import Bunyan from 'bunyan';

/**
 * To create a new logger
 * @param name 
 */
export const getLogger = (name: string) => {
    const logger = Bunyan.createLogger({
        name,
        src: true,
        level: process.env.LOG_LEVEL as Bunyan.LogLevel || 'info'
    });
    return logger;
}