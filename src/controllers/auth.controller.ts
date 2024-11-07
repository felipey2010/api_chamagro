import { Request, Response } from "express";
import httpStatus from "http-status";
import { TOKEN_TYPES } from "../config/tokens";
import { BadRequestException } from "../exceptions/BadRequestException";
import { GeneralException } from "../exceptions/GeneralException";
import {
  errorResponse,
  successResponse,
} from "../middlewares/responseGenerator";
import {
  createCredentialService,
  findUserCredentialByEmailService,
  getCredentialsByEmailService,
  loginWithEmailAndPassword,
  updatePasswordService,
} from "../services/auth.service";
import {
  checkResetPasswordRequestCode,
  deleteTokenService,
  findAndCheckTokenService,
  findTokenByEmailService,
  generatePasswordResetRequestToken,
} from "../services/token.service";
import {
  createUserService,
  getUserByEmailService,
} from "../services/user.service";

export async function checkUserCredentialByEmailController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = req.params;
    const existingEmail = await findUserCredentialByEmailService(email);
    successResponse(
      res,
      httpStatus.CREATED,
      "Verificação do credencial do usuário efetuada",
      existingEmail,
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function registerController(req: Request, res: Response) {
  try {
    const { email, password, ...rest } = req.body;
    const foundCredentials = await getCredentialsByEmailService(email);
    const userFound = await getUserByEmailService(email);
    if (userFound !== null || foundCredentials !== null) {
      throw new BadRequestException("Usuário já existe!");
    }

    const userNotVerified = await findTokenByEmailService(
      email,
      TOKEN_TYPES.EMAIL_VERIFICATION,
    );
    if (userNotVerified !== null) {
      throw new BadRequestException("Usuário ainda não foi verificado");
    }
    //create credentials
    await createCredentialService({ email, password });

    const userDetails = {
      ...rest,
      email,
      active: true,
      image: "",
      auth_provider: "CREDENTIALS",
      created_at: new Date(),
      last_accessed: new Date(),
      last_modified: null,
    };

    //save user details
    await createUserService(userDetails);

    successResponse(
      res,
      httpStatus.CREATED,
      "Usuário cadastrado com êxito",
      null,
    );
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    await loginWithEmailAndPassword(email, password);
    const user = await getUserByEmailService(email);
    successResponse(res, httpStatus.OK, "Login efetuado", user);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function loginWithNextAuthController(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const user = await getUserByEmailService(email);
    if (
      user &&
      user.auth_provider.toUpperCase() !== "GOOGLE" &&
      user.auth_provider.toUpperCase() !== "GITHUB"
    ) {
      throw new GeneralException(
        httpStatus.UNAUTHORIZED,
        "Por favor, faça login usando o mesmo método de autenticação.",
      );
    }
    successResponse(res, httpStatus.OK, "Login efetuado", user);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function verifyTokenController(req: Request, res: Response) {
  try {
    const { email, code } = req.body;
    const token = await findAndCheckTokenService(
      email,
      code,
      TOKEN_TYPES.EMAIL_VERIFICATION,
    );
    if (!token) {
      throw new GeneralException(
        httpStatus.UNAUTHORIZED,
        "Não encontramos a solicitação de verificação",
      );
    }
    successResponse(res, httpStatus.OK, "Verificação efetuada", null);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function requestPasswordResetController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = req.params;
    const userCredentials = await getCredentialsByEmailService(email);
    if (!userCredentials)
      throw new BadRequestException(
        "A forma de autenticação utilizada no cadastro não permite executar essa operação!",
      );
    const user = await getUserByEmailService(email);
    if (!user)
      throw new BadRequestException(
        "O cadastro do usuário não foi encontrado.",
      );

    const userName = user.first_name + " " + user.last_name;
    await generatePasswordResetRequestToken(email, userName);
    successResponse(res, httpStatus.OK, "Solicitação encaminhada", null);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function verifyPasswordResetRequestController(
  req: Request,
  res: Response,
) {
  try {
    const { email, code } = req.body;
    const token = await checkResetPasswordRequestCode(
      email,
      code,
      TOKEN_TYPES.PASSWORD_RESET,
    );
    if (!token) {
      throw new GeneralException(
        httpStatus.UNAUTHORIZED,
        "Não encontramos a solicitação de recuperação de senha",
      );
    }
    successResponse(res, httpStatus.OK, "Verificação efetuada", null);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { email, code, password } = req.body;

    const userCredentials = await getCredentialsByEmailService(email);
    if (!userCredentials)
      throw new BadRequestException(
        "A forma de autenticação utilizada no cadastro não permite executar essa operação!",
      );

    const token = await findTokenByEmailService(
      email,
      TOKEN_TYPES.PASSWORD_RESET,
    );
    if (!token) {
      throw new GeneralException(
        httpStatus.UNAUTHORIZED,
        "Não encontramos a solicitação de recuperação de senha",
      );
    }
    if (token.code !== code)
      throw new GeneralException(
        httpStatus.BAD_REQUEST,
        "O código da solicitação não corresponde ao que foi enviado",
      );

    await updatePasswordService({
      ...userCredentials,
      password: password,
    });

    await deleteTokenService(email, TOKEN_TYPES.PASSWORD_RESET);
    successResponse(
      res,
      httpStatus.OK,
      "Verificação efetuada com sucesso",
      null,
    );
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha interna do servidor",
      error,
    );
  }
}
