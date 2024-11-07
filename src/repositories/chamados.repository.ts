import { ChamadoType } from "../types"
import { handlePrismaError } from "../utils/handlePrismaError"
import prisma from "../utils/prisma"

export async function createChamado(data: ChamadoType) {
  try {
    return prisma.chamados.create({ data })
  } catch (error: any) {
    handlePrismaError(error, "salvando chamado")
  }
}

export async function findChamadoByUser(userId: string) {
  try {
    return prisma.chamados.findMany({
      where: {
        owner_id: userId,
      },
    })
  } catch (error: any) {
    handlePrismaError(error, "buscando chamados")
  }
}

export async function findChamadoById(id: string) {
  try {
    return prisma.chamados.findUnique({ where: { id } })
  } catch (error: any) {
    handlePrismaError(error, "buscando chamado")
  }
}

export async function findAllChamados() {
  try {
    return prisma.chamados.findMany()
  } catch (error: any) {
    handlePrismaError(error, "buscando chamados")
  }
}

export async function updateChamado(id: string, data: Partial<ChamadoType>) {
  try {
    return prisma.chamados.update({
      where: { id },
      data,
    })
  } catch (error: any) {
    handlePrismaError(error, "atualizando chamado")
  }
}

export async function deleteChamado(id: string) {
  try {
    return prisma.chamados.delete({ where: { id } })
  } catch (error: any) {
    handlePrismaError(error, "excluindo chamado")
  }
}
