"use server";

import { db } from "@/server/db";
import type { UsersTableType } from "@/server/db/schema";
import { users } from "@/server/db/schema";
import type { PaperlessDocumentsType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import type { AdviceAPIType } from "@/types";

export async function setUserProperty<K extends keyof UsersTableType>(
  propertyName: K,
  value: UsersTableType[K],
) {
  const { userId } = auth();

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
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userData;
}

export async function getPaperlessDocuments(query: string) {
  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData) return null;

  const response = await fetch(
    `${userData.paperlessURL}/api/documents/?query=${query}&page=1&page_size=10&truncate_content=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
    },
  );

  const data = (await response.json()) as PaperlessDocumentsType;

  return data;
}
