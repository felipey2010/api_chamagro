import { Request, Response } from "express";
import logger from "./logger";
import config from "./config";
import morgan from "morgan";

morgan.token(
  "message",
  (req: Request, res: Response) => res.locals.errorMessage || "",
);

const getIpFormat = () =>
  config.env === "production" ? ":remote-addr - " : "";
const successResonseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResonseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const morganErrorHandler = morgan(errorResonseFormat, {
  skip: (req: Request, res: Response) => res.statusCode < 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

const morganSuccessHandler = morgan(successResonseFormat, {
  skip: (req: Request, res: Response) => res.statusCode >= 400,
  stream: { write: (message: string) => logger.info(message.trim()) },
});

export { morganSuccessHandler, morganErrorHandler };
