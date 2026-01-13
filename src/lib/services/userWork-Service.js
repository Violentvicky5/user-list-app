import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";
import { generateWorkId } from "@/lib/utils/workId";

export async function assignWorkToUser(userId, assignedWork) {
  const client = await clientPromise;
  const db = client.db();

  const userObjectId = new ObjectId(userId);

  if (!assignedWork || assignedWork.length === 0) {
    await db.collection("users").updateOne(
      { _id: userObjectId },
      { $unset: { assignedWork: "" } }
    );
    return { matchedCount: 1 };
  }

  const user = await db.collection("users").findOne(
    { _id: userObjectId },
    { projection: { _id: 1 } }
  );

  if (!user) return { matchedCount: 0 };

  // Add DB-only fields
  const worksToSave = assignedWork.map((w) => ({
    ...w,
    workId: generateWorkId(),
    assignedAt: new Date(),
  }));

  await db.collection("users").updateOne(
    { _id: userObjectId },
    { $set: { assignedWork: worksToSave } }
  );

  return { matchedCount: 1 };
}
