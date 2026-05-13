import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  "Brincos",
  "Colares",
  "Pulseiras Femininas",
  "Pulseiras Masculinas",
  "Colares Masculinos",
  "Pingentes",
  "Berloques",
  "Braceletes",
  "Relógios",
  "Anéis",
  "Tornozeleiras",
];

async function main() {
  for (const name of CATEGORIES) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log(`Seeded ${CATEGORIES.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
