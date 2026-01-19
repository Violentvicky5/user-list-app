import { NextResponse } from "next/server";
import { userSchema } from "@/lib/validators/userValidator";
import { assignWorkToUser } from "@/lib/services/userWork-Service";
import { removeWorkFromUser } from "@/lib/services/removeUser";
import { rateLimit } from "@/lib/rateLimiter/rateLimit";
import { validateUserQuery } from "@/lib/validators/user.query";
import { getAssignedWorks } from "@/lib/services/assignedWork.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "-createdAt";

    const { page, limit } = validateUserQuery({
      page: rawPage,
      limit: rawLimit,
    });

    const result = await getAssignedWorks({
      page,
      limit,
      search,
      sort,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to fetch assigned works" },
      { status: 500 }
    );
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
