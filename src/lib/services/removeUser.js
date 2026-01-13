import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";

export async function removeWorkFromUser(userId) {
  const client = await clientPromise;
  const db = client.db();

  // Remove assignedWork in users
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $unset: { assignedWork: "" } }
  );

  // remove entries from userWorks collection
  await db.collection("userWorks").deleteMany({
    userId: new ObjectId(userId),
  });

  return { success: true };
}
