import { NextResponse } from "next/server";
import { userSchema } from "@/lib/validators/userValidator";
import { assignWorkToUser } from "@/lib/services/userWork-Service";
import { removeWorkFromUser } from "@/lib/services/removeUser";
import { rateLimit } from "@/lib/rateLimiter/rateLimit";
import clientPromise from "@/lib/db/mongo";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const works = await db
      .collection("userWorks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ works });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    // rate limit
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.ip ||
      req.socket?.remoteAddress;

    if (!rateLimit({ key: ip, limit: 10, windowMs: 60000 })) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { id, assignedWork } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    //  removing work assignment
if (!assignedWork) {
  await removeWorkFromUser(id);
  return NextResponse.json({ success: true, removed: true });
}

    // validate only the field we need
    userSchema.pick({ assignedWork: true }).parse({ assignedWork });

    const result = await assignWorkToUser(id, assignedWork);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.errors || err.message },
      { status: 400 }
    );
  }
}
