import {
  createChamado,
  deleteChamado,
  findAllChamados,
  findChamadoById,
  findChamadoByUser,
  updateChamado,
} from "../repositories/chamados.repository"
import { ChamadoType } from "../types"

export async function createChamadoService(data: ChamadoType) {
  return createChamado(data)
}

export async function findChamadoByIdService(id: string) {
  return findChamadoById(id)
}

export async function findChamadoByUserService(userId: string) {
  return findChamadoByUser(userId)
}

export async function findAllChamadosService() {
  return findAllChamados()
}

export async function updateChamadoService(
  id: string,
  data: Partial<ChamadoType>
) {
  return updateChamado(id, data)
}

export async function deleteChamadoService(id: string) {
  return deleteChamado(id)
}
