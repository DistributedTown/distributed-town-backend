import "reflect-metadata";
import * as dotenv from "dotenv";
import { container } from "./inversify.config";

import { App } from "./app";
import { LoggerService } from "./services/logger.service";
import * as mongoose from "mongoose";


// initialize configuration
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const application = container.get<App>(App);
const logger = container.get<LoggerService>(LoggerService);

application.app.listen(PORT, () => {
  (<any>mongoose).Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, (err: any) => {
    if (err) {
      throw err;
    } else {
      logger.info("Mongoose connection established!");
    }
  });
  logger.info("MongoDB service init");
  logger.info("Distributed town API is listening on port " + PORT);
});
