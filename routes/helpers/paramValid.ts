import { BadRequest } from "../middleware/errors";

export default function paramValid(
  value: string,
  min: number,
  max: number,
  desc: string
) {
  if (!value || value.length > max || value.length < min)
    throw new BadRequest(
      `Missing '${desc}', which must be between ${min} and ${max} characters!`
    );
}
