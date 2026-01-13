import { NextResponse } from "next/server";
import clientPromise from "@/lib/db/mongo";
import { ObjectId } from "mongodb";

// If you are using Edge runtime, you need to `await` params
// For Node runtime, just destructure normally
export async function GET(req, context) {
  const { params } = context;

  // unwrap promise if needed (Edge runtime)
  const resolvedParams = typeof params.then === "function" ? await params : params;

  const id = String(resolvedParams.id).trim();
  console.log("Fetching user with ID:", id);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { name: 1, email: 1, createdAt: 1, assignedWork: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
