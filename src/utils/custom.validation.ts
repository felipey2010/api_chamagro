import { CustomHelpers } from "joi";

export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 6) {
    return helpers.error("any.custom", {
      message: "a senha deve ter pelo menos 6 caracteres",
    });
  }

  if (!value.match(/[a-zA-Z]/)) {
    return helpers.error("any.custom", {
      message: "a senha deve conter pelo menos uma letra",
    });
  }

  if (!value.match(/[0-9]/)) {
    return helpers.error("any.custom", {
      message: "a senha deve conter pelo menos um número",
    });
  }

  if (!value.match(/[^a-zA-Z0-9]/)) {
    return helpers.error("any.custom", {
      message: "a senha deve conter pelo menos um caractere especial",
    });
  }

  return value;
};

export const usernameQuery = (value: string, helpers: CustomHelpers) => {
  if (value.length < 3) {
    return helpers.error("any.custom", {
      message: "O nome do usuário deve ter pelo menos 3 caracteres",
    });
  }
  return value;
};
