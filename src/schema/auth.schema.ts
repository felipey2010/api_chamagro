import Joi from "joi";
import { password } from "../utils/custom.validation";

export const registerSchema = {
  body: Joi.object().keys({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    role: Joi.string().required(),
    email: Joi.string().trim().required().email().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "É obrigatório informar o email",
      "string.empty": "O email não deve estar vazio",
      "string.invalid": "Este campo deve conter email válido",
    }),
    password: Joi.string().required().custom(password),
  }),
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().trim().required().email().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "É obrigatório informar o email",
      "string.empty": "O email não deve estar vazio",
      "string.invalid": "Este campo deve conter email válido",
    }),
    password: Joi.string().required().messages({
      "any.required": "É obrigatório informar a senha",
      "string.empty": "O campo da senha não deve estar vazio",
    }),
  }),
};

export const logoutSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokensSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPasswordSchema = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .messages({
        "string.base": "Este campo deve ser uma string válida",
        "string.empty": "É obrigatório informar um email",
      })
      .email()
      .messages({
        "string.invalid": "Este campo deve conter email válido",
      })
      .required(),
  }),
};

export const resetPasswordSchema = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmailSchema = {
  query: Joi.object().keys({
    token: Joi.string().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "string.empty": "É obrigatório informar o código",
    }),
  }),
};

export const credentialCheckSchema = {
  params: Joi.object().keys({
    email: Joi.string().trim().required().email().required().messages({
      "string.base": "O email deve ser uma string válida",
      "any.required": "É obrigatório informar o email",
      "string.empty": "O email não deve estar vazio",
      "string.invalid": "Este campo deve conter email válido",
    }),
  }),
};

export const verifyTokenSchema = {
  body: Joi.object().keys({
    email: Joi.string().trim().email().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "É obrigatório informar o email",
      "string.empty": "O email não deve estar vazio",
    }),
    code: Joi.string().trim().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "O código é obrigatório",
      "string.empty": "É obrigatório informar o código",
    }),
  }),
};

export const passwordResetSchema = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .messages({
        "string.base": "Este campo deve ser uma string válida",
        "string.empty": "É obrigatório informar um email",
      })
      .email()
      .messages({
        "string.invalid": "Este campo deve conter email válido",
      })
      .required(),
    code: Joi.string().trim().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "O código é obrigatório",
      "string.empty": "É obrigatório informar o código",
    }),
    password: Joi.string().required().messages({
      "any.required": "É obrigatório informar a senha",
      "string.empty": "O campo da senha não deve estar vazio",
    }),
  }),
};
