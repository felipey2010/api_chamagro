import httpStatus from "http-status";
import { GeneralException } from "../exceptions/GeneralException";

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
} = require("@prisma/client/runtime/library");

export function handlePrismaError(error: Error, message: string) {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientValidationError ||
    error instanceof PrismaClientInitializationError
  ) {
    console.error("Prisma erro - ", error);
    throw new GeneralException(
      httpStatus.BAD_REQUEST,
      `Prisma erro - ${message}`,
      JSON.stringify(error),
    );
  } else {
    console.error(`Erro - ${message}:`, error);
    throw error;
  }
}
