import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl?.trim()) {
  throw new Error("Missing DATABASE_URL environment variable.");
}
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER = "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce";

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

const MOCK_PRODUCTS = [
  {
    name: "Colar Lua Crescente",
    price: 89,
    description:
      "Um colar delicado com pingente de lua crescente em prata 925. Perfeito para o uso diário, trazendo elegância e sofisticação ao seu visual.",
    sizeDetails: "45cm, Prata 925, Caixa de presente incluída",
    isNew: true,
    category: "Colares",
    image: `${PLACEHOLDER}/jewelry-ring`,
  },
  {
    name: "Brincos Aria Drop",
    price: 65,
    description:
      "Brincos pendentes com design moderno e acabamento polido em prata 925. Leves e confortáveis para uso prolongado.",
    sizeDetails: "3cm, Prata 925, Caixa de presente incluída",
    isNew: true,
    category: "Brincos",
    image: `${PLACEHOLDER}/jewelry-earrings`,
  },
  {
    name: "Pulseira Serpente",
    price: 120,
    description:
      "Pulseira com design de serpente em prata 925 com acabamento oxidado. Uma peça marcante que combina ousadia e elegância.",
    sizeDetails: "18cm, Prata 925, Caixa de presente incluída",
    isNew: true,
    category: "Braceletes",
    image: `${PLACEHOLDER}/leather-bag-gray`,
  },
  {
    name: "Berloque Estrela Celeste",
    price: 45,
    description:
      "Berloque em formato de estrela com detalhes em zircônia. Compatível com pulseiras de berloque padrão.",
    sizeDetails: "1.5cm, Prata 925, Caixa de presente incluída",
    isNew: false,
    category: "Berloques",
    image: `${PLACEHOLDER}/accessories-bag`,
  },
  {
    name: "Brinco Ponto de Luz",
    price: 48,
    description:
      "Brinco solitário com zircônia cravejada em prata 925. Discreto e brilhante, ideal para qualquer ocasião.",
    sizeDetails: "0.5cm, Prata 925, Caixa de presente incluída",
    isNew: false,
    category: "Brincos",
    image: `${PLACEHOLDER}/jewelry-ring`,
  },
  {
    name: "Colar de Pérolas",
    price: 135,
    description:
      "Colar com pérolas de água doce e corrente em prata 925. Uma peça clássica e atemporal que eleva qualquer produção.",
    sizeDetails: "50cm, Prata 925, Caixa de presente incluída",
    isNew: false,
    category: "Colares",
    image: `${PLACEHOLDER}/jewelry-earrings`,
  },
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

  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Skipping products — ${existingCount} already exist`);
    return;
  }

  for (const p of MOCK_PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) continue;

    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        description: p.description,
        sizeDetails: p.sizeDetails,
        isNew: p.isNew,
        categoryId: category.id,
        images: {
          create: [{ url: p.image, publicId: `seed/${p.name.toLowerCase().replace(/\s+/g, "-")}` }],
        },
      },
    });
  }
  console.log(`Seeded ${MOCK_PRODUCTS.length} mock products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
