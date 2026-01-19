"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BreadCrumb";
export default function WorkTablePage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const worksCacheRef = useRef(new Map());

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  const handlePrev = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (page < pagination.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const cacheKey = `${page}_${limit}_${search}_${sort}`;

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);

    // from cache process
    if (worksCacheRef.current.has(cacheKey)) {
      const cached = worksCacheRef.current.get(cacheKey);
      setWorks(cached.works);
      setPagination(cached.pagination);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/users/assign-work?page=${page}&limit=${limit}&search=${search}&sort=${sort}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch work data");
      }

      // store in cache
      worksCacheRef.current.set(cacheKey, {
        works: data.works || [],
        pagination: data.pagination,
      });

      setWorks(data.works || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [page, limit, search, sort]);

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <Breadcrumb />
      <h1 className="text-2xl font-semibold mb-6">Assigned Works</h1>

      {loading && <p className="text-sm text-gray-500">Loading works…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Work ID</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Created At</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {!works.length && !loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No assigned works found
                </td>
              </tr>
            ) : (
              works.map((u) => (
                <tr key={u.userId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{u.userId}</td>
                  <td className="px-4 py-3">{u.username}</td>

                  {/* Works */}
                  <td className="px-4 py-3">
                    {u.works.map((w) => w.name).join(", ")}
                  </td>

                  {/* Assigned At (latest) */}
                  <td className="px-4 py-3">
                    {u.works[0]?.assignedAt
                      ? new Date(u.works[0].assignedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page === pagination.totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
