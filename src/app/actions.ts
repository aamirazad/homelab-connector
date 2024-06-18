"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function setFullUserName(name: string, userId: string) {
  try {
    await db
      .insert(users)
      .values({ fullName: name, userId: userId })
      .onConflictDoUpdate({ target: users.userId, set: { fullName: name } });
  } catch {
    throw new Error("Database error");
  }
}

export async function setPaperlessURL(url: string, userId: string) {
  try {
    await db
      .insert(users)
      .values({ paperlessURL: url, userId: userId })
      .onConflictDoUpdate({ target: users.userId, set: { paperlessURL: url } });
  } catch {
    throw new Error("Database error");
  } 
}

export async function setPaperlessToken(token: string, userId: string) {
  try {
    await db
      .insert(users)
      .values({ paperlessToken: token, userId: userId })
      .onConflictDoUpdate({ target: users.userId, set: { paperlessToken: token } });
  } catch {
    throw new Error("Database error");
  } 
}