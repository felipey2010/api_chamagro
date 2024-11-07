import httpStatus from "http-status";
import moment from "moment";
import { TOKEN_TYPES } from "../config/tokens";
import { GeneralException } from "../exceptions/GeneralException";
import {
  deleteToken,
  findTokenByEmail,
  getTokenByEmail,
  saveToken,
  updateToken,
} from "../repositories/token.repository";
import { Token } from "../types";
import { generateRandomAlphaNumeric } from "../utils/randomGenerators";
import {
  sendPasswordResetRequestEmail,
  sendVerificationEmail,
} from "./email.service";

const TOKEN_EXPIRATION_HOURS = 24;

export async function saveTokenService(token: Token) {
  const tokenData = {
    ...token,
    expires_at: moment().add(TOKEN_EXPIRATION_HOURS, "hours").toDate(),
  };
  return saveToken(tokenData);
}

export async function findAndCheckTokenService(
  email: string,
  token: string,
  tokenType: string,
) {
  const tokenFound = await findTokenByEmail(email, tokenType);
  if (!tokenFound)
    throw new GeneralException(
      httpStatus.NOT_FOUND,
      "Nenhuma pendência de verificação encontrada",
    );

  if (tokenFound.code !== token) {
    const tokenToUpdate = {
      ...tokenFound,
      verification_tries: tokenFound.verification_tries! + 1,
    };
    await updateToken(email, tokenType, tokenToUpdate);
    throw new GeneralException(
      httpStatus.UNAUTHORIZED,
      "O código informado está incorreto",
    );
  }

  await deleteToken(email, tokenFound.type);
  return tokenFound;
}

export async function checkResetPasswordRequestCode(
  email: string,
  token: string,
  tokenType: string,
) {
  const tokenFound = await findTokenByEmail(email, tokenType);
  if (!tokenFound)
    throw new GeneralException(
      httpStatus.NOT_FOUND,
      "Nenhuma pendência de verificação encontrada",
    );

  if (tokenFound.code !== token) {
    const tokenToUpdate = {
      ...tokenFound,
      verification_tries: tokenFound.verification_tries! + 1,
    };
    await updateToken(email, tokenType, tokenToUpdate);
    throw new GeneralException(
      httpStatus.UNAUTHORIZED,
      "O código informado está incorreto",
    );
  }

  return tokenFound;
}

export async function findTokenByEmailService(
  email: string,
  tokenType: string,
) {
  return findTokenByEmail(email, tokenType);
}

export async function updateTokenService(email: string, updatedToken: Token) {
  return updateToken(email, updatedToken.type, updatedToken);
}

export async function generateAndSaveToken(email: string) {
  const existingToken = await getTokenByEmail(
    email,
    TOKEN_TYPES.EMAIL_VERIFICATION,
  );

  const verificationCode = generateRandomAlphaNumeric();
  const tokenToSave = {
    email,
    code: verificationCode,
    type: TOKEN_TYPES.EMAIL_VERIFICATION,
    updated_at: null,
    expires_at: moment().add(TOKEN_EXPIRATION_HOURS, "hours").toDate(),
  };

  if (existingToken) {
    const token = {
      ...tokenToSave,
      updated_at: new Date(),
    };
    await updateTokenService(email, token);
  } else {
    const token = {
      ...tokenToSave,
      created_at: new Date(),
    };
    await saveTokenService(token);
  }

  sendVerificationEmail(email, verificationCode);
}

export async function generatePasswordResetRequestToken(
  email: string,
  name: string,
) {
  const tokenType = TOKEN_TYPES.PASSWORD_RESET;
  const existingToken = await getTokenByEmail(email, tokenType);

  const verificationCode = generateRandomAlphaNumeric();
  const tokenToSave = {
    email,
    code: verificationCode,
    type: tokenType,
    updated_at: null,
    expires_at: moment().add(TOKEN_EXPIRATION_HOURS, "hours").toDate(),
  };

  if (existingToken) {
    const token = {
      ...tokenToSave,
      updated_at: new Date(),
    };
    await updateTokenService(email, token);
  } else {
    const token = {
      ...tokenToSave,
      created_at: new Date(),
    };
    await saveTokenService(token);
  }

  sendPasswordResetRequestEmail(email, name, verificationCode);
}

export async function deleteTokenService(email: string, tokenType: string) {
  return deleteToken(email, tokenType);
}
