import { BadRequest } from "../middleware/errors";

export function paramValid(
  value: string,
  min: number,
  max: number,
  desc: string
) {
  if (!value || value.length > max || value.length < min)
    throwError(
      `Missing '${desc}', which must be between ${min} and ${max} characters!`
    );
}

export function paramValidEnum(
  value: string,
  desc: string,
  enumStrings: String[]
) {
  if (!value || enumStrings.indexOf(value) === -1)
    throwError(`Missing/invalid '${desc}'!`);
}

function throwError(text: string) {
  throw new BadRequest(text);
}
