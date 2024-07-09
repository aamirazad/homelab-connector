"use server";

import { db } from "@/server/db";
import type { UsersTableType } from "@/server/db/schema";
import { users } from "@/server/db/schema";
import type { PaperlessDocumentsType } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { WhishperRecordingType } from "@/types";

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

  if (!userId) return null;

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return userData;
}

/*
Paperless
|  _ \ __ _ _ __   ___ _ __| | ___ ___ ___
| |_) / _` | '_ \ / _ | '__| |/ _ / __/ __|
|  __| (_| | |_) |  __| |  | |  __\__ \__ \
|_|   \__,_| .__/ \___|_|  |_|\___|___|___/
           |_|
*/

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

export async function getWhishperRecordings(
  query: string,
): Promise<WhishperRecordingType[] | null> {
  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData) return null;

  const response = await fetch(`${userData.whishperURL}/api/transcriptions`);

  const data = (await response.json()) as WhishperRecordingType[];
  const lowerCaseQuery = query.toLowerCase();
  const filteredAndScored = data
    .filter(
      (item) =>
        item.fileName.toLowerCase().includes(lowerCaseQuery) ||
        item.result.text.toLowerCase().includes(lowerCaseQuery),
    )
    .map((item) => {
      const fileNameOccurrences = (
        item.fileName.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) ?? []
      ).length;
      const textOccurrences = (
        item.result.text.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) ??
        []
      ).length;
      const score = fileNameOccurrences + textOccurrences;
      return { ...item, score };
    });
  const sortedByScore = filteredAndScored.sort((a, b) => b.score - a.score);

  // Step 4: Return the sorted array without the score
  return sortedByScore.map(({ ...item }) => item);
}