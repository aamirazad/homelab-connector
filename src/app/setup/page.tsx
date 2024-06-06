import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export default async function userSetup() {
  const authUser = auth()
  const user = await db.query.users.findFirst();
  console.log(authUser, user)
  return <div>tbd</div>;
}
