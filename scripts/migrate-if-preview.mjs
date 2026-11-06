// Applies database migrations during Vercel *preview* builds only.
// Production migrations are run deliberately by the developer, never automatically by a build.
import { execSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
const hasDb = Boolean(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);

if (env === "preview" && hasDb) {
  console.log("Preview build: applying database migrations");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log(`Skipping migrations (VERCEL_ENV=${env ?? "unset"}, database ${hasDb ? "set" : "not set"})`);
}
