import { Token } from "../types";
import { handlePrismaError } from "../utils/handlePrismaError";
import prisma from "../utils/prisma";

export async function saveToken(token: Token) {
  try {
    return prisma.tokens.create({
      data: token,
    });
  } catch (error: any) {
    handlePrismaError(error, "salvando token");
  }
}

export async function getTokenByEmail(
  email: string,
  tokenType: string,
): Promise<Token | null | undefined> {
  try {
    return (await prisma.tokens.findFirst({
      where: {
        email,
        type: tokenType,
      },
    })) as Token;
  } catch (error: any) {
    handlePrismaError(error, "buscando token");
  }
}

export async function findToken(
  email: string,
  token: string,
  tokenType: string,
): Promise<Token | null | undefined> {
  return (await prisma.tokens.findFirst({
    where: {
      email,
      code: token,
      type: tokenType,
    },
  })) as Token;
}

export async function findTokenByEmail(
  email: string,
  tokenType: string,
): Promise<Token | null | undefined> {
  return (await prisma.tokens.findFirst({
    where: {
      email,
      type: tokenType,
    },
  })) as Token;
}

export async function updateToken(
  email: string,
  tokenType: string,
  updatedToken: Token,
): Promise<Token | null | undefined> {
  try {
    return (await prisma.tokens.update({
      where: {
        email,
        type: tokenType,
      },
      data: updatedToken,
    })) as Token;
  } catch (error: any) {
    handlePrismaError(error, "atualizando token");
  }
}

export async function deleteToken(
  email: string,
  tokenType: string,
): Promise<Token | null | undefined> {
  return (await prisma.tokens.delete({
    where: {
      email,
      type: tokenType,
    },
  })) as Token;
}
