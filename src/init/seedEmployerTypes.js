import { EmployerType } from "../models/EmployerType.js";

export async function seedEmployerTypes() {
  const types = [
    "FinTech",
    "E-commerce",
    "EdTech",
    "HealthTech",
    "AI / ML",
    "GameDev",
    "SaaS",
    "Cybersecurity",
    "Marketplace",
  ];

  for (const name of types) {
    await EmployerType.findOrCreate({ where: { name } });
  }
}
