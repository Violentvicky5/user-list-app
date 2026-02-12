"use client"

import { useSession, signOut } from "next-auth/react"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
export default function DashboardLayout({ children }) {
  const { data: session } = useSession()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground truncate max-w-[180px]">
              Welcome,
              <span className="ml-1 font-medium text-foreground ">
                {session?.user?.email ||
                  session?.user?.name ||
                  "User"}
              </span>
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-md bg-destructive px-4 py-2 text-sm text-white hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-14 border-t flex items-center justify-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Next App. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
</ThemeProvider>  )
}
