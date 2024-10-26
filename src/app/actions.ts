"use server";

import { db } from "@/server/db";
import type { UsersTableType } from "@/server/db/schema";
import { users } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";

/*
Clerk helpers
  ___| | ___ _ __| | __
 / __| |/ _ | '__| |/ /
| (__| |  __| |  |   <
 \___|_|\___|_|  |_|\_\
*/

export async function setUserProperty<K extends keyof UsersTableType>(
  propertyName: K,
  value: UsersTableType[K],
) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    await db
      .insert(users)
      .values({ [propertyName]: value, userId: userId })
      .onConflictDoUpdate({
        target: users.userId,
        set: { [propertyName]: value },
      });
  } catch {
    return null;
  }
}

export async function getUserData() {
  const { userId } = await auth();

  if (!userId) return null;

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userData;
}