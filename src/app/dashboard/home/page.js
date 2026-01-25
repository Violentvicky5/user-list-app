"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PlainChart from "@/components/plainChart";
import UserSummaryPie from "@/components/userSummaryPie";
import UserSummaryPieChart from "@/components/UserSummaryPieChart";
import SimplifiedPieChart from "@/components/SimplifiedPieChart";
import TypeFour from "@/components/TypeFour";
import TypeFive from "@/components/TypeFive";
import TypeSix from "@/components/TypeSix";
import TypeSeven from "@/components/TypeSeven";
import TypeNine from "@/components/TypeNine";
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

  const card = "rounded-xl p-4 sm:p-5 text-white flex flex-col items-center";

  return (
    <div>
      <div className="space-y-6 w-full">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold">Dashboard</h2>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            className={`${card} bg-emerald-500 cursor-pointer hover:opacity-90`}
            onClick={() => router.push("/dashboard/users")}
          >
            <p className="text-sm sm:text-base">Total Users</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {summary.totalUsers}
            </p>
          </div>

          <div className={`${card} bg-teal-500`}>
            <p className="text-sm sm:text-base">Work 1</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {summary.workCounts.work1}
            </p>
          </div>

          <div className={`${card} bg-sky-500`}>
            <p className="text-sm sm:text-base">Work 2</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {summary.workCounts.work2}
            </p>
          </div>

          <div className={`${card} bg-blue-500`}>
            <p className="text-sm sm:text-base">Work 3</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {summary.workCounts.work3}
            </p>
          </div>

          <div className={`${card} bg-violet-500`}>
            <p className="text-sm sm:text-base">Unassigned</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {summary.unAssignedUsers}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          {/* type 1*/}
          <div>
            <PlainChart />
          </div>
        </div>

        {/* type 2*/}

        <div className="bg-white rounded-xl shadow-md p-2 w-full max-w-[250px] h-[300px] mx-auto">
          <SimplifiedPieChart
            values={[
              120, 90, 75, 60, 150, 110, 95, 80, 70, 65, 140, 100, 85, 55, 55,
              130, 105, 98, 88, 100,
            ]}
            labels={[
              "Chrome",
              "Firefox",
              "Edge",
              "Safari",
              "Brave",
              "Opera",
              "Vivaldi",
              "Samsung Internet",
              "UC Browser",
              "Tor",
              "Internet Explorer",
              "DuckDuckGo",
              "Yandex",
              "Maxthon",
              "Pale Moon",
              "QQ Browser",
              "Sogou",
              "Baidu",
              "Whale",
              "Other",
            ]}
          />
        </div>
        {/* type 3*/}
        <div className="bg-white rounded-xl shadow-md p-2 w-full max-w-[300px] h-[300px] mx-auto">
          <TypeFour
            values={[
              120, 90, 75, 60, 150, 110, 95, 80, 70, 65, 140, 100, 85, 55, 55,
              130, 105, 98, 88, 100,
            ]}
            labels={[
              "Chrome",
              "Firefox",
              "Edge",
              "Safari",
              "Brave",
              "Opera",
              "Vivaldi",
              "Samsung Internet",
              "UC Browser",
              "Tor",
              "Internet Explorer",
              "DuckDuckGo",
              "Yandex",
              "Maxthon",
              "Pale Moon",
              "QQ Browser",
              "Sogou",
              "Baidu",
              "Whale",
              "Other",
            ]}
          />
        </div>
        {/* type 4*/}

        <div className="bg-white rounded-xl shadow-md p-2 w-full max-w-[300px] h-[300px] mx-auto">
          <TypeFive
            values={[
              120, 90, 75, 60, 150, 110, 95, 80, 70, 65, 140, 100, 85, 55, 55,
              130, 105, 98, 88, 100,
            ]}
            labels={[
              "Chrome",
              "Firefox",
              "Edge",
              "Safari",
              "Brave",
              "Opera",
              "Vivaldi",
              "Samsung Internet",
              "UC Browser",
              "Tor",
              "Internet Explorer",
              "DuckDuckGo",
              "Yandex",
              "Maxthon",
              "Pale Moon",
              "QQ Browser",
              "Sogou",
              "Baidu",
              "Whale",
              "Other",
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center w-full">
          {/* type 5*/}

          <div className="bg-white rounded-xl shadow-md p-2 w-full max-w-[200px] h-[300px] mx-auto">
            <UserSummaryPieChart />
          </div>
          
          {/* type 6*/}
          <div className="bg-white rounded-xl shadow-md p-2 w-full max-w-[200px] h-[250px] mx-auto">
            <TypeSix />
          </div>
        </div>
        {/* type 7*/}
        <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 flex justify-center items-center w-full max-w-[350px] h-[350px] mx-auto">
          <UserSummaryPie />
        </div>
      </div>
      {/* type 8*/}
      <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 flex justify-center items-center w-full max-w-[350px] h-[350px] mx-auto">
        <TypeSeven />
      </div>
       <div className="bg-white rounded-xl p-3 sm:p-4 flex-1 flex justify-center items-center w-full max-w-[350px] h-[350px] mx-auto">
        <TypeNine />
      </div>
    </div>
  );
}
