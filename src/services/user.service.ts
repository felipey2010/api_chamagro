import httpStatus from "http-status";
import { BadRequestException } from "../exceptions/BadRequestException";
import { GeneralException } from "../exceptions/GeneralException";
import {
  checkDuplicateEmail,
  deleteUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  saveUser,
  updateUser,
} from "../repositories/user.repository";
import { FilterType, PaginatedData, RegisteredUserType } from "../types";

/**
 * Create a user
 * @param {UserToRegisterType} userData - user authenticated with OAuth
 * @returns {Promise<RegisteredUserType>} - saved user
 */
export async function createUserService(userData: RegisteredUserType) {
  const { email } = userData;
  const userByEmail = await findUserByEmail(email);
  const current_date = new Date();

  if (userByEmail) {
    const updatedUser = {
      ...userData,
      id: userByEmail.id,
    };
    return await updateUserByIdService(userByEmail.id, updatedUser);
  }

  const newUser = {
    ...userData,
    created_at: current_date,
    last_accessed: current_date,
    last_modified: null,
    active: true,
  };

  return await saveUser(newUser);
}

/**
 * Query for users
 * @param {FilterType} filter - filter: name, order, size and page
 * @returns {Promise<PaginatedData<RegisteredUserType>>} - pagination of user data
 */
export async function queryUsersService(
  filter: FilterType,
): Promise<PaginatedData<RegisteredUserType> | undefined> {
  return getAllUsers(filter);
}

/**
 * Get user by id
 * @param {string} id - the id of the user
 * @returns {Promise<RegisteredUserType | null>} user data or null if user not found
 */
export async function getUserByIdService(id: string) {
  if (!id)
    throw new BadRequestException("Falha pela ausência de ID do usuário");
  return await findUserById(id);
}

/**
 * Get user by email
 * @param {string} email - email of the user being queried
 * @returns {Promise<RegisteredUserType | undefined | null>} - data of user found
 */
export async function getUserByEmailService(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  return {
    ...user,
    name: `${user.first_name} ${user.last_name}`,
  };
}

/**
 * Update user by id
 * @param {string} userId - id of user being updated
 * @param {UserToRegisterType} updateBody - information to update
 * @returns {Promise<RegisteredUserType | null>} - data of updated user
 */
export async function updateUserByIdService(
  userId: string,
  userNewData: RegisteredUserType,
) {
  if (userId !== userNewData.id) {
    throw new BadRequestException(
      "Houve uma inconsistência de dados do usuário",
    );
  }
  const userOldData = (await getUserByIdService(userId)) as RegisteredUserType;
  if (!userOldData) {
    throw new GeneralException(httpStatus.NOT_FOUND, "Usuário não encontrado");
  }

  if (userNewData.email !== userOldData.email) {
    const isDuplicateEmail = await checkDuplicateEmail(userNewData.email);
    if (isDuplicateEmail) {
      throw new GeneralException(httpStatus.BAD_REQUEST, "Email já existe");
    }
  }

  const updatedUser = buildUserUpdate(userOldData, userNewData);
  return await updateUser(updatedUser);
}

/**
 * Delete user by id
 * @param {string} userId - id of user to delete
 * @returns {Promise<RegisteredUserType | null>} - user data deleted or null (undefined) if operation fails
 */
export async function deleteUserByIdService(userId: string) {
  const user = await getUserByIdService(userId);
  if (!user) {
    throw new GeneralException(httpStatus.NOT_FOUND, "User not found");
  }

  return await deleteUser(user.id);
}

function buildUserUpdate(
  userOldData: RegisteredUserType,
  userNewData: RegisteredUserType,
) {
  const image = userNewData.image || userOldData.image || null;
  const dateNow = new Date();

  return {
    ...userOldData,
    first_name: userNewData.first_name,
    last_name: userNewData.last_name,
    email: userNewData.email,
    image,
    role: userNewData.role,
    last_accessed: dateNow,
    last_modified: dateNow,
    created_at: userOldData.created_at,
  };
}
