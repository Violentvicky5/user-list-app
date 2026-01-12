"use client";

import { useEffect, useRef, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [limit, setLimit] = useState(5);

  const searchTimeoutRef = useRef(null);
  const usersCacheRef = useRef(new Map());

  const fetchUsers = async ({
    page = 1,
    searchVal = search,
    sortVal = sort,
    limitVal = limit,
  } = {}) => {
    const cacheKey = `${page}|${searchVal}|${sortVal}|${limitVal}`;
    console.log("CACHE KEY:", cacheKey);

    if (usersCacheRef.current.has(cacheKey)) {
      console.log("CACHE HIT");
      const cachedData = usersCacheRef.current.get(cacheKey);
      setUsers(cachedData.users);
      setPagination(cachedData.pagination);

      return;
    }
    console.log("CACHE MISS → FETCH:", cacheKey);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/users?page=${page}&limit=${limitVal}&search=${searchVal}&sort=${sortVal}`
      );
      const data = await res.json();
      usersCacheRef.current.set(cacheKey, {
        users: data.users,
        pagination: data.pagination,
      });
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      usersCacheRef.current.clear(); //remove this for search value cache because it clears all cache on every search type
      fetchUsers({ page: 1, searchVal: value });
    }, 500);
  };

  const handleSortChange = (e) => {
    usersCacheRef.current.clear();
    const value = e.target.value;
    setSort(value);
    fetchUsers({ page: 1, sortVal: value });
  };

  const handleLimitChange = (e) => {
    usersCacheRef.current.clear();
    const value = Number(e.target.value);
    setLimit(value);
    fetchUsers({ page: 1, limitVal: value });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />

        <select
          value={sort}
          onChange={handleSortChange}
          className="border rounded px-3 py-2"
        >
          <option value="-createdAt">Newest first</option>
          <option value="createdAt">Oldest first</option>
        </select>

        <select
          value={limit}
          onChange={handleLimitChange}
          className="border rounded px-3 py-2"
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>

      {/* Status */}
      {loading && <p className="text-sm text-gray-500 mb-2">Loading users…</p>}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {!users.length && !loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers({ page: pagination.page - 1 })}
            disabled={pagination.page <= 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => fetchUsers({ page: pagination.page + 1 })}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
