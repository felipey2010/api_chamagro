import httpStatus from "http-status";
import { GeneralException } from "../exceptions/GeneralException";
import { comparePasswords, createHash } from "../middlewares/password";
import {
  findByEmail,
  getCredentialsByEmail,
  saveUserCredentials,
  updateUserCredentials,
} from "../repositories/auth.repository";
import { UserCredentials } from "../types";
import { generateAndSaveToken } from "./token.service";
import { getUserByEmailService } from "./user.service";

export async function createCredentialService(credentials: UserCredentials) {
  const { email, password } = credentials;
  const hashedPassword = await createHash(password);
  const credentialsToSave = {
    email,
    password: hashedPassword,
    created_at: new Date(),
  };
  return saveUserCredentials(credentialsToSave);
}

export async function updatePasswordService(credentials: UserCredentials) {
  const hashedPassword = await createHash(credentials.password);
  const updatedData = {
    ...credentials,
    password: hashedPassword,
    updated_at: new Date(),
  };

  return updateUserCredentialsService(credentials.email, updatedData);
}

export async function getCredentialsByEmailService(email: string) {
  return getCredentialsByEmail(email);
}

/**
 * Find by email if user credentials exist
 * @param email
 * @returns {string | null} email
 */
export async function findUserCredentialByEmailService(email: string) {
  // if credentials exist, then return the email
  const existingCredential = await findByEmail(email);
  if (existingCredential) {
    return existingCredential.email;
  }

  // if credentials not found, then check if any user is registered with the email
  const existingUser = await getUserByEmailService(email);
  if (existingUser) {
    throw new GeneralException(
      httpStatus.BAD_REQUEST,
      "O usuário já existe. Por favor, faça login usando o mesmo método de autenticação.",
    );
  }

  // if there is no user registered, then create a token and send to the email and return null
  await generateAndSaveToken(email);
  return null;
}

/**
 * Login with email and password
 * @param {string} email
 * @param {string} userPassword
 * @returns {Promise<UserCredentials>}
 */
export async function loginWithEmailAndPassword(
  email: string,
  userPassword: string,
) {
  const user = await getCredentialsByEmail(email);
  if (!user || !(await comparePasswords(userPassword, user.password))) {
    throw new GeneralException(
      httpStatus.UNAUTHORIZED,
      "Credenciais incorretas",
    );
  }
  const updatedCredentials = {
    ...user,
    last_accessed: new Date(),
  };
  updateUserCredentialsService(email, updatedCredentials);

  const { password, ...rest } = user;
  return rest;
}

/**
 * Update user credentials
 * @param email email of the user
 * @param userCredentials the updated credentials
 * @returns {Promise<UserCredentials>}
 */
export async function updateUserCredentialsService(
  email: string,
  userCredentials: UserCredentials,
) {
  return updateUserCredentials(email, userCredentials);
}
