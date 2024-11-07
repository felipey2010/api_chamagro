import { Request, Response } from "express";
import httpStatus from "http-status";
import { GeneralException } from "../exceptions/GeneralException";
import {
  errorResponse,
  successResponse,
} from "../middlewares/responseGenerator";
import {
  createUserService,
  deleteUserByIdService,
  getUserByEmailService,
  getUserByIdService,
  queryUsersService,
  updateUserByIdService,
} from "../services/user.service";
import extractFilter from "../utils/extractFilter";

export async function createUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await createUserService(req.body);
    successResponse(res, httpStatus.CREATED, "Usuário salvo com êxito", null);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em salvar usuário",
      error,
    );
  }
}

export async function getUsersController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const filter = extractFilter(req);
    const result = await queryUsersService(filter);
    successResponse(res, httpStatus.OK, "Lista de usuários", result);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em listar usuários",
      error,
    );
  }
}

export async function getUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = await getUserByIdService(req.params.userId);
    successResponse(res, httpStatus.OK, "Busca de usuário efetuada", user);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em buscar usuário",
      error,
    );
  }
}

export async function updateUserPhotoController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const userId = req.params.userId;
    const user = await getUserByIdService(userId);
    if (!user)
      throw new GeneralException(
        httpStatus.BAD_REQUEST,
        "Usuário não encontrado",
      );

    // if (!req.files || !req.files.image) {
    //   throw new GeneralException(
    //     httpStatus.BAD_REQUEST,
    //     'Image file is required'
    //   )
    // }

    // const imageFile = req.files.image as Express.Multer.File // Assuming multer is used for file handling

    // const imageUrl = await uploadImageToAppwrite(imageFile)

    // // Update the user record with the new image URL
    // const updatedUser = await UserService.updateUserImage(userId, imageUrl)
    successResponse(res, httpStatus.OK, "Atualização de foto efetuada", "");
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em atualizar foto do usuário",
      error,
    );
  }
}

export async function getUserByEmailController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = await getUserByEmailService(req.params.email);
    successResponse(res, httpStatus.OK, "Busca de usuário efetuada", user);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em buscar usuário",
      error,
    );
  }
}

export async function updateUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const user = await updateUserByIdService(req.params.userId, req.body);
    successResponse(res, httpStatus.OK, "Busca de usuário efetuada", user);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em buscar usuários",
      error,
    );
  }
}

export async function deleteUserController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await deleteUserByIdService(req.params.userId);
    successResponse(res, httpStatus.OK, "Exclusão de usuário efetuada", null);
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em excluir usuários",
      error,
    );
  }
}

async function validateUser(
  userId: string,
  userType: "usuário alvo" | "solicitante",
) {
  if (!userId)
    throw new GeneralException(
      httpStatus.BAD_REQUEST,
      "Os dados enviados estão incompletos",
    );

  const user = await getUserByIdService(userId);
  if (!user)
    throw new GeneralException(
      httpStatus.BAD_REQUEST,
      `O ${userType} não existe`,
    );
  return user;
}
