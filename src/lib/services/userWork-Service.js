import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";
import { generateWorkId } from "@/lib/utils/workId";

export async function assignWorkToUser(userId, assignedWork) {
  const client = await clientPromise;
  const db = client.db();

  // Handle NO work
  if (!assignedWork) {
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { assignedWork: "" } }
    );

    // remove from userWorks table
    await db.collection("userWorks").deleteOne({
      userId: new ObjectId(userId),
    });

    return { matchedCount: 1 };
  }

  //Fetch user name to use in userWorks collection
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { name: 1 } }
  );

  if (!user) return { matchedCount: 0 };

  //Update assignedWork in users collection
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { assignedWork } }
  );

  // Upsert into userWorks to avoid duplicates
  await db.collection("userWorks").updateOne(
    { userId: new ObjectId(userId) }, // find by userId
    {
      $set: {
        username: user.name,
        work: assignedWork,
        createdAt: new Date(),
      },
      $setOnInsert: {
        workId: generateWorkId(), // generate only if new
      },
    },
    { upsert: true } // insert if does not exist
  );

  return { matchedCount: 1 };
}
