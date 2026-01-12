import clientPromise from "./mongo.js";

async function seed() {
  const client = await clientPromise;
  const db = client.db("userlistdb");

  const users = Array.from({ length: 50 }).map((_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    createdAt: new Date(Date.now() - i * 1000 * 60), 
  }));

  await db.collection("users").insertMany(users);

  console.log("Seeded 50 users successfully");
  process.exit(0);
}

seed();
