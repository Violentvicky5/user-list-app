import { NextResponse } from "next/server";
import { addUser, updateUser } from "@/lib/services/formService";
import { userSchema } from "@/lib/validators/userValidator";
import { rateLimit } from "@/lib/rateLimiter/rateLimit";

//create new user 
export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = userSchema.parse(body);

    const result = await addUser(parsed);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// updating existing user
export async function PUT(req) {
  try {
    // Rate limiting per IP
    const ip = req.headers.get("x-forwarded-for") || req.ip || req.socket?.remoteAddress;
    if (!rateLimit({ key: ip, limit: 10, windowMs: 60000 })) {
      return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });
    }

    const parsed = userSchema.parse(data);
    const result = await updateUser(id, parsed);

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, updatedCount: result.modifiedCount }), {
      status: 200,
    });
  } catch (err) {
    if (err.errors) {
      
      return new Response(JSON.stringify({ error: err.errors }), { status: 400 });
    }

    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
    });
  }
}

