import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";

export async function addUser(data) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("users").insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result;
}

export async function updateUser(id, data) {
  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  return result;
}
