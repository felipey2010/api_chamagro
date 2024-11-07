type PaginationInterface = {
  name: string;
  page: number;
  size: number;
  order: string;
  totalPages: number;
  totalElements: number;
};

export type PaginatedData<T> = {
  content: T[];
  pagination: PaginationInterface;
};

export type FilterType = {
  size: number;
  page: number;
  name: string;
  order: "asc" | "desc";
};

export type tokenTypes = "EMAIL_VERIFICATION" | "RESET_PASSWORD";

export type Token = {
  id?: number;
  email: string;
  code: string;
  type: string;
  verification_tries?: number;
  created_at?: Date;
  updated_at?: Date | null;
  expires_at: Date;
};

export type UserEmail = {
  email: string;
};

export type UserCredentials = {
  id?: number;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date | null;
  last_accessed?: Date | null;
};

export type RegisteredUserType = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string | null;
  role: string | "DEFAULT" | "FARMER" | "ADMIN" | "TECHNICIAN" | "MERCHANT";
  active: boolean | null;
  last_accessed: Date | null;
  last_modified: Date | null;
  created_at: Date | null;
  auth_provider: string | "GOOGLE" | "CREDENTIALS";
};
