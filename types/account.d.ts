import { Role } from "./enums";
import { Token } from "./jwt";

export interface AccountDeleteBody {
  token: string;
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
