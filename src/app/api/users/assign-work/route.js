import { NextResponse } from "next/server";
import { userSchema } from "@/lib/validators/userValidator";
import { assignWorkToUser } from "@/lib/services/userWork-Service";
import { removeWorkFromUser } from "@/lib/services/removeUser";
import { rateLimit } from "@/lib/rateLimiter/rateLimit";
import clientPromise from "@/lib/db/mongo";

/**
 * GET → fetch users with assigned work
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const users = await db
      .collection("users")
      .find({ assignedWork: { $exists: true, $ne: [] } })
      .project({ name: 1, assignedWork: 1 })
      .sort({ "assignedWork.assignedAt": -1 })
      .toArray();

    // flatten assignedWork for table
   const works = users.flatMap((user) => {
  // ensure it's always an array
  const assigned = Array.isArray(user.assignedWork) ? user.assignedWork : [user.assignedWork];
  
  return assigned.map((work) => ({
    workId: work.workId,
    userId: user._id,
    username: user.name,
    work: work.name,
    assignedAt: work.assignedAt,
  }));
});


    return NextResponse.json({ works });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST → assign / remove work
 */
export async function POST(req) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.ip ||
      req.socket?.remoteAddress;

    if (!rateLimit({ key: ip, limit: 10, windowMs: 60000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { id, assignedWork } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Remove work if empty
    if (!assignedWork || assignedWork.length === 0) {
      await removeWorkFromUser(id);
      return NextResponse.json({ success: true, removed: true });
    }

    // Validate assignedWork array strictly
    userSchema.pick({ assignedWork: true }).parse({ assignedWork });

    // Assign work
    const result = await assignWorkToUser(id, assignedWork);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.errors || err.message }, { status: 400 });
  }
}
