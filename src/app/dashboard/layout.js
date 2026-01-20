"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex`}
    >
      <aside
       onMouseLeave={() => {
    if (open) setOpen(false);
  }}
        className={`
    fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-40
    transform transition-transform duration-200
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className="p-4 text-lg font-semibold border-b border-gray-700">
          Dashboard
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard/home"
            className="px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
           <HomeIcon className="h-5 w-5 " /> Home
          </Link>
          <Link
            href="/dashboard/users"
            className="px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
           <UserGroupIcon className="h-5 w-5" /> Users list
          </Link>
          <Link
            href="/dashboard/form"
            className="px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
        <UserPlusIcon className="h-5 w-5" /> Add users
          </Link>
          <Link
            href="/dashboard/workTable"
            className="px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
          <TableCellsIcon className="h-5 w-5" /> Assigned Work Table
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full ">
        {/* Header */}
        <header className="h-16 bg-white border-b px-4 z-50 sticky top-0">
          <div className="flex items-center h-full gap-4">
            {/* Left */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600">
                Welcome,
                <span className="ml-1 font-medium text-gray-900">
                  {session?.user?.email
                    ? session.user.email
                    : session?.user?.name || "User"}
                </span>
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100 min-h-[calc(100vh-4rem-3.5rem)]">{children}</main>

        {/* Footer */}
        <footer className="h-14 bg-white border-t flex items-center justify-center text-sm text-gray-500 ">
          <span>
            © {new Date().getFullYear()} Next App. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}
