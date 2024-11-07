import Joi from "joi";

const usernameValidator = Joi.string()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .message(
    "O nome de usuário deve conter apenas letras, números, hífen e underscore",
  )
  .min(6)
  .message("O nome de usuário deve ter pelo menos 6 caracteres")
  .max(30)
  .message("O nome de usuário deve ter no máximo 30 caracteres")
  .required()
  .messages({
    "any.required": "{{#nome_de_usuario}} é obrigatório!",
    "string.empty": "{{#nome_de_usuario}} não deve ser vazio!",
  });

export const userRegistrationSchema = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required().messages({
      "string.base": "O campo ID deve ser uma string.",
      "string.uuid": "O campo ID deve ser um UUID válido.",
      "any.required": "O campo ID é obrigatório.",
    }),
    username: usernameValidator.messages({
      "any.required": "O nome de usuário é obrigatório.",
    }),
    name: Joi.string().min(3).max(80).required().messages({
      "string.base": "O nome deve ser uma string.",
      "string.min": "O nome deve ter pelo menos 3 caracteres.",
      "string.max": "O nome não pode exceder 80 caracteres.",
      "any.required": "O campo nome é obrigatório.",
    }),
    email: Joi.string().email().lowercase().required().messages({
      "string.email": "O email deve ser um endereço de email válido.",
      "any.required": "O campo email é obrigatório.",
    }),
    image: Joi.string().allow(null, "").messages({
      "string.base": "O campo imagem deve ser uma string.",
    }),
    bio: Joi.string().max(220).allow(null, "").messages({
      "string.max": "A biografia não pode exceder 220 caracteres.",
    }),
    role: Joi.string().valid("MENTOR", "MENTEE").required().messages({
      "any.only": 'O campo {role} deve ser "MENTOR" ou "MENTORADO".',
      "any.required": "O campo {role} é obrigatório.",
    }),
    auth_provider: Joi.string()
      .valid("GOOGLE", "GITHUB", "EMAIL")
      .required()
      .messages({
        "any.only":
          'O provedor de autenticação deve ser "GOOGLE", "GITHUB" ou "CREDENTIALS".',
        "any.required": "O campo provedor de autenticação é obrigatório.",
      }),
    available_for_mentoring: Joi.boolean().messages({
      "boolean.base":
        "O campo disponível para mentoria deve ser verdadeiro ou falso.",
    }),
    // created_at: Joi.date().messages({
    //   'date.base': 'O campo created_at deve ser uma data válida.',
    // }),
    // last_accessed: Joi.date().allow(null).messages({
    //   'date.base': 'O campo last_accessed deve ser uma data válida.',
    // }),
    // last_modified: Joi.date().allow(null).messages({
    //   'date.base': 'O campo last_modified deve ser uma data válida.',
    // }),
  }),
};

export const adminRegistrationSchema = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    username: usernameValidator,
    name: Joi.string().min(3).max(80).required(),
    email: Joi.string().email().lowercase().required(),
    image: Joi.string().allow(null, ""),
    bio: Joi.string().max(220).allow(null, ""),
    role: Joi.string().valid("ADMIN").required(),
    active: Joi.boolean(),
    email_provider: Joi.string().valid("GOOGLE", "GITHUB", "EMAIL").required(),
    available_for_mentoring: Joi.boolean(),
    last_accessed: Joi.date().allow(null),
    last_modified: Joi.date().allow(null),
  }),
};

export const queryUsersSchema = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const queryUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};

export const queryUserEmailSchema = {
  params: Joi.object().keys({
    email: Joi.string().trim().required().email().required().messages({
      "string.base": "Este campo deve ser uma string válida",
      "any.required": "É obrigatório informar o email",
      "string.empty": "O email não deve estar vazio",
      "string.invalid": "Este campo deve conter email válido",
    }),
  }),
};

export const updateUserSchema = {
  params: Joi.object().keys({
    userId: Joi.required(),
  }),
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    username: usernameValidator,
    name: Joi.string().min(3).max(80).required(),
    email: Joi.string().email().lowercase().required(),
    image: Joi.string().allow(null, ""),
    bio: Joi.string().max(220).allow(null, ""),
    role: Joi.string().valid("MENTOR", "MENTEE").required(),
    available_for_mentoring: Joi.boolean(),
  }),
};

export const userSearchSchema = {
  params: Joi.object().keys({
    userId: Joi.string().required().messages({
      "string.base": "O ID do usuário alvo deve ser uma string válida",
      "any.required": "É obrigatório informar o ID do usuário alvo",
      "string.empty": "O ID do usuário alvo não deve estar vazio",
    }),
  }),
  body: Joi.object().keys({
    query: Joi.string().required().messages({
      "string.base": "O texto de pesquisa deve ser uma string válida",
      "any.required": "É obrigatório informar o texto de pesquisa",
      "string.empty": "O texto de pesquisa não deve estar vazio",
    }),
  }),
};
