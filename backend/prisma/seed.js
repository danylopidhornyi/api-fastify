import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Dev Editor Pro License",
      description: "One-year license for Dev Editor Pro IDE",
      price: "79.00",
    },
    {
      name: "Cloud CI Minutes Pack",
      description: "10,000 CI minutes/month for your team",
      price: "49.00",
    },
    {
      name: "API Requests Bundle",
      description: "1,000,000 API requests with analytics",
      price: "199.00",
    },
    {
      name: "Analytics Dashboard (Monthly)",
      description: "Real-time dashboards and alerts, per month",
      price: "29.99",
    },
    {
      name: "Auth Microservice License",
      description: "Standalone auth microservice (per instance)",
      price: "149.00",
    },
  ];

  // remove existing products (keeps seed idempotent)
  await prisma.product.deleteMany();
  const result = await prisma.product.createMany({
    data: products,
  });

  console.log(`Inserted ${result.count} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
