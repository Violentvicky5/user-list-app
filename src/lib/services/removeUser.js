import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";

export async function removeWorkFromUser(userId) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $unset: { assignedWork: "" } }
  );

  return { success: true };
}
