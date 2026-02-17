import { env } from "../config/env.config.js";

import bcrypt from "bcrypt";
import { User } from "../models/User.js";

export async function seedAdmin() {
  const exists = await User.findOne({
    where: { email: env.ADMIN_EMAIL },
  });

  if (exists) return;

  const password = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await User.create({
    email: env.ADMIN_EMAIL,
    phone_number: env.ADMIN_PHONE_NUMBER,
    name: env.ADMIN_NAME,
    password,
    role_id: 1,
  });
}
