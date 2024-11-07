import { BadRequestException } from "../exceptions/BadRequestException";
import { FilterType, PaginatedData, RegisteredUserType } from "../types";
import { handlePrismaError } from "../utils/handlePrismaError";
import prisma from "../utils/prisma";

export async function saveUser(data: RegisteredUserType) {
  try {
    return prisma.users.create({
      data,
    });
  } catch (error: any) {
    handlePrismaError(error, "saving user");
  }
}

export async function getAllUsers(
  filter: FilterType,
): Promise<PaginatedData<RegisteredUserType> | undefined> {
  const { size, page, order, name } = filter;
  try {
    const [totalElements, queriedUsers] = await Promise.all([
      prisma.users.count(),
      prisma.users.findMany({
        take: size,
        skip: (page - 1) * size,
        orderBy: {
          created_at: order,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    const filterOptions = {
      name,
      page: parseInt(page.toString(), 10),
      size,
      order,
      totalPages,
      totalElements,
    };

    return {
      content: queriedUsers as RegisteredUserType[],
      pagination: filterOptions,
    };
  } catch (error: any) {
    handlePrismaError(error, "buscando usuário");
  }
}

export async function findUserByEmail(email: string) {
  try {
    return prisma.users.findFirst({
      where: {
        email,
      },
    });
  } catch (error: any) {
    handlePrismaError(error, "buscando usuário por email");
  }
}

export async function checkDuplicateEmail(
  email: string,
): Promise<boolean | undefined> {
  try {
    const count = await prisma.users.count({
      where: { email },
    });

    return count > 0;
  } catch (error: any) {
    handlePrismaError(error, "verificando usuário por email");
  }
}

export async function findUserById(id: string) {
  try {
    return prisma.users.findFirst({
      where: {
        id,
      },
    });
  } catch (error: any) {
    handlePrismaError(error, "buscando usuário por id");
  }
}

export async function updateUser(userNewData: RegisteredUserType) {
  try {
    const { id } = userNewData;
    const savedUser = await findUserById(id);
    if (!savedUser) throw new BadRequestException("Usuário não encontrado");

    const userToUpdate = {
      ...savedUser,
      ...userNewData,
    };

    return prisma.users.update({
      where: { id },
      data: userToUpdate,
    });
  } catch (error: any) {
    handlePrismaError(error, "atualizando dado do usuário");
  }
}

export async function deleteUser(id: string) {
  try {
    return prisma.users.delete({
      where: {
        id,
      },
    });
  } catch (error: any) {
    handlePrismaError(error, "excluindo usuário");
  }
}

/**
 * Fetches user details for the specified user ID.
 * @param userId - The ID of the user to fetch.
 * @returns The user's details (id, username, name, image).
 * @throws Error if the user is not found.
 */
export async function getUserDetails(userId: string) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      image: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
}
