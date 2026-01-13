"use client";

import { useEffect, useState } from "react";

export default function WorkTablePage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/assign-work");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch work data");
      }

      setWorks(data.works || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
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
              <th className="px-4 py-3 text-left">Work</th>
              <th className="px-4 py-3 text-left">Assigned At</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {!works.length && !loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No assigned works found
                </td>
              </tr>
            ) : (
              works.map((w) => (
                <tr key={w._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{w.workId}</td>
                  <td className="px-4 py-3">{String(w.userId)}</td>
                  <td className="px-4 py-3">{w.username}</td>
                  <td className="px-4 py-3">{w.work}</td>
                  <td className="px-4 py-3">
                    {w.assignedAt
                      ? new Date(w.assignedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
