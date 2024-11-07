import config from "../config/config";
import bcrypt from "bcrypt";

export async function createHash(passwordToHash: string) {
  try {
    const salt = await bcrypt.genSalt(Number(config.jwt.saltround));
    const encryptedPassword = await bcrypt.hash(passwordToHash, salt);

    return encryptedPassword;
  } catch (error) {
    throw Error("Erro ao fazer hash da senha");
  }
}

export async function comparePasswords(
  userPassword: string,
  savedPassword: string,
) {
  try {
    return await bcrypt.compare(userPassword, savedPassword);
  } catch (error: any) {
    throw Error("Erro ao comparar senha");
  }
}
