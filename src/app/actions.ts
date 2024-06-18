"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function setFullUserName(name: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  try {
    await db
      .insert(users)
      .values({ fullName: name, userId: userId })
      .onConflictDoUpdate({ target: users.userId, set: { fullName: name } });
  } catch {
    throw new Error("Database error");
  }
}

export async function setPaperlessURL(url: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  try {
    await db
      .insert(users)
      .values({ paperlessURL: url, userId: userId })
      .onConflictDoUpdate({ target: users.userId, set: { paperlessURL: url } });
  } catch {
    throw new Error("Database error");
  }
}

export async function setPaperlessToken(token: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  try {
    await db
      .insert(users)
      .values({ paperlessToken: token, userId: userId })
      .onConflictDoUpdate({
        target: users.userId,
        set: { paperlessToken: token },
      });
  } catch {
    throw new Error("Database error");
  }
}

export async function getUserPreferences(userId: string) {
  try {
    await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.userId, userId),
    });
  } catch {
    throw new Error("Database error");
  }
}

export async function getPaperlessDocuments(query: string) {
  const user = auth();

  if (!user.userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, user.userId),
  });

  if (!query || query == "null" || query.length < 3 || !userData)
    return Response.json({ error: "Bad Request" }, { status: 400 });


  const response = await fetch(
    `${userData.paperlessURL}/api/search/?query=${query}` + query,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
    },
  );

  const data = await response.json();

  return Response.json({ data });
}
