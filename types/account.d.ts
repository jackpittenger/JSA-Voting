import { Request } from "./post";

export interface AccountDeleteBody {
  token: string;
}

export interface AccountLoginBody {
  token: string;
  pin: string;
}

export interface AccountPostBody {
  token: string;
}
