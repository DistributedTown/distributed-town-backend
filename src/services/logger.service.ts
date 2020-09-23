import * as dotenv from "dotenv";
import { injectable } from "inversify";

import { createLogger, transports, Logger, format } from "winston";

dotenv.config({ path: "../.env" });

@injectable()
export class LoggerService {
  private _logger: Logger;

  public constructor() {
    this._logger = this.createLoggerConfiguration();
  }

  public info(msg: string) {
    return this._logger.info(msg);
  }

  public debug(msg: string) {
    return this._logger.debug(msg);
  }

  public verbose(msg: string) {
    return this._logger.verbose(msg);
  }

  public warn(msg: string) {
    return this._logger.warn(msg);
  }

  public error(msg: any) {
    return this._logger.error(msg);
  }

  private createLoggerConfiguration(): Logger {
    const logger = createLogger({
      level: "verbose",
      format: format.json(),
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: "error.log" }),
        new transports.File({ filename: "combined.log" })
      ]
    });

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== "production") {
      const consoleLogger = logger.add(new transports.Console());
      consoleLogger.format = format.simple();

      return consoleLogger;
    }
    return logger;
  }
}

export function formatObject(obj: any): string {
  return JSON.stringify(obj, undefined, 2);
}
