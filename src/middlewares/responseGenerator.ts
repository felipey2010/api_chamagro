import { Response } from "express";

interface ResponseData {
  success: boolean;
  message: string;
  data: any;
}

function setResponseHeaders(res: Response): void {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data: T,
): void {
  setResponseHeaders(res);
  const response: ResponseData = {
    success,
    message,
    data,
  };

  res.status(statusCode).json(response);
}

function successResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): void {
  sendResponse(res, statusCode, message, true, data);
}

function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  error: any,
): void {
  sendResponse(res, statusCode, message, false, error);
}

export { successResponse, errorResponse };
