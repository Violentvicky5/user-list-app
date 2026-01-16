import { getUserSummary } from "@/lib/services/userSummary.service";
import { formatUserSummary } from "@/lib/validators/userSummary.validator";

export async function GET() {
  try {
    const rawData = await getUserSummary();
    const response = formatUserSummary(rawData);

    return Response.json(response);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user summary" }),
      { status: 500 }
    );
  }
}
