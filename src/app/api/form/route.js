import { NextResponse } from "next/server";
import { addUser, updateUser } from "@/lib/services/formService";
import { userSchema } from "@/lib/validators/userValidator";

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

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    const parsed = userSchema.parse(data);

    const result = await updateUser(id, parsed);

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
