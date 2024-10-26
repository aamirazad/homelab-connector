import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) return new Response(`Unauthorized`, { status: 401 });

  const userData = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.userId, userId),
  });

  return Response.json(userData);
}
