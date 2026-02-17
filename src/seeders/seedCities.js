import { City } from "../models/City.js";

export async function seedCities() {
  const cities = ["Астана", "Алматы"];

  for (const name of cities) {
    await City.findOrCreate({ where: { name } });
  }
}
