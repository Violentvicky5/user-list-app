import clientPromise from "@/lib/db/mongo";

export async function getUsers({ page, limit, search, sort }) {
  const skip = (page - 1) * limit;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("users");

  const filter = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

const sortObj = {};
if (sort === "createdAt") sortObj.createdAt = 1;      // ascending
else sortObj.createdAt = -1;   
  
  const users = await collection
    .find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .toArray();

  const total = await collection.countDocuments(filter); //to findd total number of pages- having users matching the filter

  return {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    users,
  };
}
