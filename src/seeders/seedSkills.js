import { Skill } from "../models/Skill.js";

export async function seedSkills() {
  const skills = ["React.js", "Node.js", "Redux", "JavaScript", "TypeScript"];

  for (const name of skills) {
    await Skill.findOrCreate({ where: { name } });
  }
}
