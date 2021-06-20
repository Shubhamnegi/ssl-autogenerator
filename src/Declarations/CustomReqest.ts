import Logger from "bunyan";
import { Request } from "express";

export interface CustomRequest extends Request {
    log: Logger
}