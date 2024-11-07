import app from "./app";
import config from "./config/config";
import logger from "./config/logger";

let server = app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
