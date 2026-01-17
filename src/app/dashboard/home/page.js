"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserSummaryPie from "@/components/userSummaryPie";

export default function Page() {
  const [summary, setSummary] = useState(null);

  const router = useRouter();

 
const { status } = useSession();

  

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("/api/users/users-summary");
      const data = await res.json();
      setSummary(data);
    };
    fetchSummary();
  }, []);
if (status === "loading") return null;

  if (!summary) return <p>Loading...</p>;

  const card =
    "rounded-xl shadow-lg p-5 text-white flex flex-col items-center";

  return (
    <>
      <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
    
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
    
        <div
          className={`${card} bg-emerald-500 cursor-pointer hover:opacity-90`}
          onClick={() => router.push("/dashboard/users")}
        >
          <p>Total Users</p>
          <p className="text-3xl font-bold">{summary.totalUsers}</p>
        </div>

        <div className={`${card} bg-teal-500`}>
          <p>Work 1</p>
          <p className="text-3xl font-bold">{summary.workCounts.work1}</p>
        </div>

        <div className={`${card} bg-sky-500`}>
          <p>Work 2</p>
          <p className="text-3xl font-bold">{summary.workCounts.work2}</p>
        </div>

        <div className={`${card} bg-blue-500`}>
          <p>Work 3</p>
          <p className="text-3xl font-bold">{summary.workCounts.work3}</p>
        </div>

        <div className={`${card} bg-violet-500`}>
          <p>Unassigned</p>
          <p className="text-3xl font-bold">{summary.unAssignedUsers}</p>
        </div>
      </div>

      {/* PIE CHART */}
      <div className="bg-white rounded-xl shadow-lg p-5">
        <UserSummaryPie summary={summary} />
      </div>
    </>
  );
}
