import "reflect-metadata";
import * as dotenv from "dotenv";
import { container } from "./inversify.config";

import { App } from "./app";
import { LoggerService } from "./services/logger.service";

// initialize configuration
dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const application = container.get<App>(App);
const logger = container.get<LoggerService>(LoggerService);

application.app.listen(PORT, async () => {
  logger.info("ThreadDB service init");
  logger.info("Distributed town API is listening on port " + PORT);
});
