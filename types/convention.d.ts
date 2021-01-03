import { Params } from "./post";

export interface GetParams extends Params {
  name: string;
}

export interface ConventionPostBody {
  name: string;
}
