import { seedRoles } from "./seedRoles.js"
import { seedAdmin } from "./seedAdmin.js"
import { seedSkills } from "./seedSkills.js"
import { seedCities } from "./seedCities.js"
import { seedEmployerTypes } from "./seedEmployerTypes.js"

export async function runSeeds() {
  await seedRoles()
  await seedAdmin()
  await seedSkills()
  await seedCities()
  await seedEmployerTypes()

  console.log("success init")
}