import { NextFunction, Request, Response } from "express";
import { GeneralException } from "../exceptions/GeneralException";
import httpStatus from "http-status";
import config from "../config/config";
import logger from "../config/logger";

const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;
  if (!(error instanceof GeneralException)) {
    const statusCode =
      error.statusCode || error.status || (err.code && err.code.startsWith("P"))
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new GeneralException(statusCode, message, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode, status, message } = err;
  if (config.env === "production") {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;
  const code = statusCode || status;

  const response = {
    success: false,
    status: code,
    message,
    ...(config.env === "development" && { error: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(code).send(response);
};

export { errorConverter, errorHandler };
