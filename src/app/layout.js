"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex`}
      >
       
        <aside
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
              href="/home"
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              Home
            </Link>
            <Link
              href="/users"
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              Users list
            </Link>
            <Link
              href="/form"
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
             Add users
            </Link>
            <Link
              href="/workTable"
              className="block px-3 py-2 rounded hover:bg-gray-700"
            >
              assigned Work Table
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full">
          {/* Header */}
          <header className="h-14 bg-white border-b flex items-center px-4 gap-4 z-50 relative">
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden px-2 py-1 border rounded"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <h1 className="text-lg font-medium">Header</h1>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 bg-gray-100">{children}</main>

          {/* Footer */}
          <footer className="h-12 bg-white border-t flex items-center justify-center text-sm">
            © 2026 Next App
          </footer>
        </div>
      </body>
    </html>
  );
}
