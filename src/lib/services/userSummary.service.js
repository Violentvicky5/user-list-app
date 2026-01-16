import clientPromise from "@/lib/db/mongo";

export async function getUserSummary() {
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection("users");

  const totalUsers = await usersCollection.countDocuments();

  // count users per work 
  const workCountsAgg = await usersCollection
    .aggregate([
      { $unwind: "$assignedWork" },
      {
        $group: {
          _id: "$assignedWork.name",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return {
    totalUsers,
    workCountsAgg,
  };
}
