import { Pool } from "pg";
import setup from "./setup";

const pool = new Pool();

pool.on("connect", () => {
  console.log("\x1b[32m✓\x1b[0m Postgres Pool Connected");
});

pool.on("error", (err: Error) => {
  console.error("Postgress Error: ", err);
});

(() => {
  setup(pool);
})();
