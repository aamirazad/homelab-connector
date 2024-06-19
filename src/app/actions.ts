"use server";

import { db } from "@/server/db";
import { UsersTableType, users } from "@/server/db/schema";
import type { PaperlessDocumentsType } from "@/types";
import { auth } from "@clerk/nextjs/server";
interface User {
  userId: string;
  fullName?: string;
  paperlessURL?: string;
  paperlessToken?: string;
}

export async function setUserProperty<K extends keyof User>(
  propertyName: K,
  value: UsersTableType[K],
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
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
    throw new Error("Database error");
  }
}

export async function getUserData() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userData;
}

export async function getPaperlessDocuments(query: string) {
  const { userId } = auth();

  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData)
    return Response.json({ error: "Bad Request" }, { status: 400 });

  const response = await fetch(
    `${userData.paperlessURL}/api/search/?query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
    },
  );

  const data = (await response.json()) as PaperlessDocumentsType;

  return Response.json({ data });
}
