import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req : Request, res: Response, next: NextFunction) => {
    console.log('Time - URL - Method', Date.now(), req.url, req.method);
    const log = `time: ${Date.now()}, url: ${req.url}, method: ${req.method}\n`;
    fs.appendFile('logger.txt', log, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
    next();
}


export default logger;