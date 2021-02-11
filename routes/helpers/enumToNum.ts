import { Role } from "@prisma/client";

export function roleEnumToNum(x: Role) {
  switch (x) {
    case "MOD":
      return 1;
    case "ADMIN":
      return 2;
    case "MANAGER":
      return 3;
    case "DEV":
      return 4;
  }
}
