import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations use the direct (unpooled) connection when Neon provides one.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url },
});
