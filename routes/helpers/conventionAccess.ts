import { BadRequest } from "../middleware/errors";
import { Role } from "@prisma/client";

import type { Token } from "../../types/jwt";

export default function conventionAccess(token: Token, conventionId: number) {
  if (token.role !== Role.DEV && token.conventionId !== conventionId)
    throw new BadRequest("Improper convention access!");
}
