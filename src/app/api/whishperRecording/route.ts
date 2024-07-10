import { getUserData } from "@/app/actions";
import { getWhishperRecordings } from "@/app/whishper/page";

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response("Name parameter is missing", { status: 400 });
  }

  const userData = await getUserData();

  if (!userData) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(
    `${userData.whishperURL}/api/transcriptions/${name}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Network error");
  }

  // Assuming the deletion is successful and you want to return a JSON response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
