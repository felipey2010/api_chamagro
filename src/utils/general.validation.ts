import { BadRequestException } from "../exceptions/BadRequestException";

export function _validateNonEmptyString(value: string, name: string): void {
  if (value === undefined || value.trim().length === 0) {
    throw new BadRequestException(`O campo '${name}' não pode estar vazio`);
  }
}
