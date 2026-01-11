import { getUsers } from "@/lib/services/user.service";
import { validateUserQuery } from "@/lib/validators/user.query";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const rawPage = searchParams.get("page");
    const rawLimit = searchParams.get("limit");
    const search = searchParams.get("search") || "";
const sortParam = searchParams.get("sort") || "-createdAt"; // default descending

    const { page, limit } = validateUserQuery({
      page: rawPage,
      limit: rawLimit,
    });

const result = await getUsers({ page, limit, search, sort: sortParam });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch users", details: error.message }),
      { status: 500 }
    );
  }
}
