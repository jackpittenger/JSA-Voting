import { Ctx } from "blitz";
import { authenticateUser } from "app/auth/auth-utils";
import { LoginInput, LoginInputType } from "app/auth/validations";

export default async function login(input: LoginInputType, { session }: Ctx) {
  // This throws an error if input is invalid
  try {
    const { token, pin } = LoginInput.parse(input);
    const user = await authenticateUser(token, pin);
    return user;
  } catch (err) {
    return false;
  }
  // This throws an error if credentials are invalid
  // const user = await authenticateUser(token, pin);

  //await session.create({ userId: user.id, roles: [user.role] });
}
