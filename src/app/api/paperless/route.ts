import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const user = auth();

  if (!user.userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });


  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query");

  if (!query || query == "null" || query.length < 3) return Response.json({ error: 'Bad Request' }, { status: 400 });

  const response = await fetch(
    "https://papers.aamira.me/api/search/?query=" + query,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.PAPERLESS_API_KEY}`,
      },
    },
  );

  const data = await response.json();

  return Response.json({ data });
}
