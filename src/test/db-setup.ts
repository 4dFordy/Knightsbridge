import { execSync } from "node:child_process";

/**
 * Before the test run: bring the test database (TEST_DATABASE_URL) up to date with all migrations.
 * Database tests are skipped when TEST_DATABASE_URL is not set; CI always sets it.
 */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url && process.env.CI) throw new Error("TEST_DATABASE_URL must be set in CI so the database tests run.");
  if (!url) return;
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url, DATABASE_URL_UNPOOLED: url },
  });
}
