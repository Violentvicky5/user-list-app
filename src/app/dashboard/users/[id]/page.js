"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/BreadCrumb";
export default function UserDetailPage() {
  const { id } = useParams(); // get dynamic id from URL
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const usernameMap = user? { [id]: user.name }: {};
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch user");

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p className="p-4">Loading user…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!user) return <p className="p-4 text-gray-500">User not found</p>;

  return (
    <div>
      <Breadcrumb usernameMap={usernameMap} />
    <div className="max-w-3xl mx-auto mt-10 p-4 border rounded">
      

      <h1 className="text-2xl font-semibold mb-4">User Details</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>

     <div className="mt-4">
  <h2 className="font-medium mb-2">Assigned Work</h2>

  {user.assignedWork && user.assignedWork.length > 0 ? (
    user.assignedWork.map((work, index) => {
      const assignedAt = work.assignedAt
        ? new Date(work.assignedAt).toLocaleString()
        : "N/A";
      const workId = work.workId || "N/A";

      return (
        <div
          key={index}
          className="border rounded p-3 mb-2 bg-gray-50"
        >
          <p>
            <strong>Work Name:</strong> {work.name}
          </p>
          <p>
            <strong>Assigned At:</strong> {assignedAt}
          </p>
          <p>
            <strong>Work ID:</strong> {workId}
          </p>
        </div>
      );
    })
  ) : (
    <p>No assigned work</p>
  )}
</div>


      <button
        onClick={() => router.back()}
        className="mt-6 px-3 py-2 bg-blue-600 text-white rounded"
      >
        Back
      </button>
    </div>
  </div>
  );
}
