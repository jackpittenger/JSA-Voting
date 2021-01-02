import type { Role } from "./enums";

export interface Token {
  token: string;
  conventionId: number;
  role: Role;
  iat: number;
  exp: number;
}
