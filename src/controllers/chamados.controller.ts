import { Request, Response } from "express"
import httpStatus from "http-status"
import { GeneralException } from "../exceptions/GeneralException"
import {
  errorResponse,
  successResponse,
} from "../middlewares/responseGenerator"
import {
  createChamadoService,
  deleteChamadoService,
  findAllChamadosService,
  findChamadoByIdService,
  findChamadoByUserService,
  updateChamadoService,
} from "../services/chamados.service"

export async function createChamadoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await createChamadoService(req.body)
    successResponse(res, httpStatus.CREATED, "Chamado salvo com êxito", null)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em salvar chamado",
      error
    )
  }
}

export async function findChamadoByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params
    const data = await findChamadoByIdService(id)

    successResponse(res, httpStatus.CREATED, "Busca de chamado", data)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em salvar chamado",
      error
    )
  }
}

export async function findChamadoByUserIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { userId } = req.params
    const data = await findChamadoByUserService(userId)

    successResponse(res, httpStatus.CREATED, "Busca de chamado", data)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em buscar chamado",
      error
    )
  }
}

export async function findAllChamadosController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const data = await findAllChamadosService()

    successResponse(res, httpStatus.CREATED, "Busca de chamados", data)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em buscar chamados",
      error
    )
  }
}

export async function updateChamadoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params
    const { chamado } = req.body

    const data = await updateChamadoService(id, chamado)

    successResponse(res, httpStatus.CREATED, "Chamado atualizado", data)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em atualização de chamado",
      error
    )
  }
}

export async function deleteeChamadoController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params

    const data = await deleteChamadoService(id)

    successResponse(res, httpStatus.CREATED, "Chamado excluído", data)
  } catch (error: any) {
    errorResponse(
      res,
      error.status || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Falha em exclusão de chamado",
      error
    )
  }
}
