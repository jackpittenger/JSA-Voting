import type { Role } from "@prisma/client";

export interface Token {
  token: string;
  conventionId: number;
  role: Role;
  iat: number;
  exp: number;
}
