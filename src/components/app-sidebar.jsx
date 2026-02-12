"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  TableCellsIcon,
  ChevronUpIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar className="flex flex-col justify-between h-full">
      {/* Sidebar header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2 px-2 py-2">
                <BuildingOfficeIcon className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold">Grand Ventures</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <DropdownMenuSeparator />

      {/* Sidebar main content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/home">
                  <HomeIcon className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/users">
                  <UserGroupIcon className="h-5 w-5" />
                  <span>Users List</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/form">
                  <UserPlusIcon className="h-5 w-5" />
                  <span>Add User</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/workTable">
                  <TableCellsIcon className="h-5 w-5" />
                  <span>Assigned Work</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <DropdownMenuSeparator />

      {/* Sidebar footer with user dropdown */}
      <SidebarFooter>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent">
                <span className="truncate text-sm font-medium">
                  {session.user?.email || session.user?.name || "User"}
                </span>
                <ChevronUpIcon className="h-4 w-4 ml-2" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-red-500"
              >
                Logout
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
