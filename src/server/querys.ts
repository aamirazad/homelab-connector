"use server";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function getUserData() {
  const { userId } = auth();

  if (!userId) return null;

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userData;
}
