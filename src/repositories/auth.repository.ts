import { UserCredentials, UserEmail } from "../types";
import { handlePrismaError } from "../utils/handlePrismaError";
import prisma from "../utils/prisma";

export async function saveUserCredentials(
  data: UserCredentials,
): Promise<UserCredentials | undefined> {
  try {
    return (await prisma.users_credentials.create({
      data,
    })) as UserCredentials;
  } catch (error: any) {
    handlePrismaError(error, "salvando credenciais");
  }
}

export async function findByEmail(
  email: string,
): Promise<UserEmail | undefined> {
  try {
    return (await prisma.users_credentials.findFirst({
      where: {
        email,
      },
      select: {
        email: true,
      },
    })) as UserEmail;
  } catch (error: any) {
    handlePrismaError(error, "buscando email");
  }
}

export async function getCredentialsByEmail(
  email: string,
): Promise<UserCredentials | undefined> {
  try {
    return (await prisma.users_credentials.findFirst({
      where: {
        email,
      },
    })) as UserCredentials;
  } catch (error: any) {
    handlePrismaError(error, "buscando credencial");
  }
}

export async function updateUserCredentials(
  email: string,
  credentials: UserCredentials,
): Promise<UserCredentials | undefined> {
  return (await prisma.users_credentials.update({
    where: {
      id: credentials.id,
      email,
    },
    data: credentials,
  })) as UserCredentials;
}
