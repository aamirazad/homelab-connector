import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = auth();

  if (!user.userId)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  console.log(user.userId);

  const data = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, user.userId),
  });

  console.log(data);

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 500 });
  }

  return Response.json(data);
}
