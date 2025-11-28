import { prisma } from "./prisma.js";

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateName(name: string): boolean {
  return name.length > 0;
}

export async function validateUniqueEmail(email: string): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  return !existingUser;
}

