import { Role } from "@prisma/client";
import { Token } from "./jwt";

export interface AccountDeleteBody {
  token: string;
  _token: Token;
}

export interface AccountLoginBody {
  token: string;
  pin: string;
}

export interface AccountPostBody {
  token: string;
  type: Role;
  _token: Token;
}
