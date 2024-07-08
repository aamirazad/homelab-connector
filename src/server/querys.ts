import "server-only";

import { getUserData } from "@/app/actions";

export async function deleteRecording(id: string) {
  const userData = await getUserData();
  if (!userData?.whishperURL) {
    throw new Error("Can't do that");
  }
  const response = await fetch(`${userData.whishperURL}/api/transcriptions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network error");
  }
  return response.json();
}