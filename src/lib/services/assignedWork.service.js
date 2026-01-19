import clientPromise from "@/lib/db/mongo";

export async function getAssignedWorks({ page, limit, search, sort }) {
  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("users");

  const filter = {
    assignedWork: { $exists: true, $ne: [] },
    ...(search && {
      "assignedWork.name": { $regex: search, $options: "i" },
    }),
  };

  const sortObj = {};
  sortObj.createdAt = sort === "createdAt" ? 1 : -1;

  const users = await collection
    .find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .project({
      name: 1,
      assignedWork: 1,
    })
    .toArray();

  const total = await collection.countDocuments(filter);

  const works = users.map((user) => ({
    userId: user._id,
    username: user.name,
    works: user.assignedWork,
  }));

  return {
    works,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
