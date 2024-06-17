"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function setFullUserName(name: string, userId: string) {
  await db
    .insert(users)
    .values({ fullName: name, userId: userId })
    .onConflictDoUpdate({ target: users.userId, set: { fullName: name } });
}
