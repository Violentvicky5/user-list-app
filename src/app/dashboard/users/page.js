"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/BreadCrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  const [alertState, setAlertState] = useState(null);
  /*
alertState structure:
{
  type: "success" | "error",
  title: string,
  message: string
}
*/

  const [editingUser, setEditingUser] = useState(null); // full user object
  const [dialogValues, setDialogValues] = useState({ name: "", email: "" }); // local temp values
  const searchTimeoutRef = useRef(null);
  const usersCacheRef = useRef(new Map());

  const WORK_OPTIONS = [
    { label: "Branch 1", value: "work1" },
    { label: "Branch 2", value: "work2" },
    { label: "Branch 3", value: "work3" },
  ];

  const fetchUsers = async ({
    page = 1,
    searchVal = search,
    sortVal = sort,
    limitVal = limit,
  } = {}) => {
    const cacheKey = `${page}|${searchVal}|${sortVal}|${limitVal}`;

    if (usersCacheRef.current.has(cacheKey)) {
      const cachedData = usersCacheRef.current.get(cacheKey);
      setUsers(cachedData.users);
      setPagination(cachedData.pagination);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/users?page=${page}&limit=${limitVal}&search=${searchVal}&sort=${sortVal}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      usersCacheRef.current.set(cacheKey, {
        users: data.users,
        pagination: data.pagination,
      });

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
  useEffect(() => {
    if (!alertState) return;

    const timer = setTimeout(() => {
      setAlertState(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alertState]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      usersCacheRef.current.clear();
      fetchUsers({ page: 1, searchVal: value });
    }, 3500);
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

  const handleAssignWork = async (userId, work, actionLabel) => {
    const user = users.find((u) => u._id === userId);

    try {
      const res = await fetch("/api/users/assign-work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          assignedWork: work,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assign work failed");

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, assignedWork: work } : u)),
      );

      usersCacheRef.current.clear();
      fetchUsers({ page: pagination.page });

      // ✅ Success alert with user name
      setAlertState({
        type: "success",
        title: "Success",
        message: `${actionLabel} (User: ${user?.name})`,
      });
    } catch (err) {
      setAlertState({
        type: "error",
        title: "Error",
        message: `${err.message} (User: ${user?.name})`,
      });
    }
  };

  if (status === "loading") return null;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 text-black dark:text-white">
      <Breadcrumb />

      <h1 className="text-2xl font-semibold mb-6">Users</h1>

      {/* Controls */}
      <div className="grid grid-cols-12 gap-3 mb-4 items-center">
        {/* Search Input */}
        <div className="col-span-12 md:col-span-8">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* SORT */}
        <div className="col-span-6 md:col-span-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
              >
                Sort
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => {
                  usersCacheRef.current.clear();
                  setSort("-createdAt");
                  fetchUsers({ page: 1, sortVal: "-createdAt" });
                }}
              >
                Newest First
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  usersCacheRef.current.clear();
                  setSort("createdAt");
                  fetchUsers({ page: 1, sortVal: "createdAt" });
                }}
              >
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PER PAGE */}
        <div className="col-span-6 md:col-span-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between"
              >
                Per Page
                <ChevronDownIcon className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  usersCacheRef.current.clear();
                  setLimit(5);
                  fetchUsers({ page: 1, limitVal: 5 });
                }}
              >
                5 / page
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  usersCacheRef.current.clear();
                  setLimit(10);
                  fetchUsers({ page: 1, limitVal: 10 });
                }}
              >
                10 / page
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  usersCacheRef.current.clear();
                  setLimit(20);
                  fetchUsers({ page: 1, limitVal: 20 });
                }}
              >
                20 / page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status */}
      {loading && (
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          Loading users…
        </p>
      )}
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      {alertState && (
        <div className="fixed top-5 right-5 z-50 w-[350px]">
          <Alert
            className={`shadow-lg ${
              alertState.type === "error"
                ? "border-red-500"
                : "border-green-500"
            }`}
          >
            {alertState.type === "error" ? (
              <XCircleIcon className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2Icon className="h-4 w-4 text-green-500" />
            )}

            <AlertTitle>{alertState.title}</AlertTitle>
            <AlertDescription>{alertState.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded border-gray-300 dark:border-gray-600">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700 text-sm text-black dark:text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
              <th className="px-4 py-3 text-left">Assign Work</th>
            </tr>
          </thead>
          <tbody className="text-sm text-black dark:text-white">
            {!users.length && !loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {/* Dialog Trigger */}
                    <Dialog
                      open={!!editingUser && editingUser._id === u._id}
                      onOpenChange={(open) => {
                        if (!open) {
                          // cancel pressed
                          setEditingUser(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setDialogValues({ name: u.name, email: u.email });
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Update
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-sm">
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              const res = await fetch("/api/form", {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  id: editingUser._id,
                                  name: dialogValues.name,
                                  email: dialogValues.email,
                                }),
                              });
                              if (!res.ok) throw new Error("Update failed");

                              // update table locally
                              setUsers((prev) =>
                                prev.map((user) =>
                                  user._id === editingUser._id
                                    ? {
                                        ...user,
                                        name: dialogValues.name,
                                        email: dialogValues.email,
                                      }
                                    : user,
                                ),
                              );

                              usersCacheRef.current.clear();
                              fetchUsers({ page: pagination.page });
                              setAlertState({
                                type: "success",
                                title: "Success",
                                message: `User ${dialogValues.name} updated successfully`,
                              });
                              setEditingUser(null); // close dialog
                            } catch (err) {
                              setAlertState({
                                type: "error",
                                title: "Error",
                                message: `${err.message} (User: ${editingUser?.name})`,
                              });
                            }
                          }}
                        >
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update name and email for {u.name}.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex flex-col gap-3 my-2">
                            <div>
                              <Label htmlFor="name" className="mb-2">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={dialogValues.name}
                                onChange={(e) =>
                                  setDialogValues((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="mb-2">
                                Email
                              </Label>
                              <Input
                                id="email"
                                value={dialogValues.email}
                                onChange={(e) =>
                                  setDialogValues((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <button
                      onClick={() => router.push(`/dashboard/users/${u._id}`)}
                      className="text-green-600 dark:text-green-400 hover:underline text-sm ml-2"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      {WORK_OPTIONS.map((work) => {
                        const selectedWorks =
                          u.assignedWork?.map((w) => w.name) || [];
                        const isChecked = selectedWorks.includes(work.value);

                        const onToggle = () => {
                          const updatedWorks = isChecked
                            ? selectedWorks.filter((v) => v !== work.value)
                            : [...selectedWorks, work.value];

                          const confirmMsg = isChecked
                            ? `Remove ${work.label} from this user?`
                            : `Assigned ${work.label} to this user?`;

                          handleAssignWork(
                            u._id,
                            updatedWorks.map((name) => ({ name })),
                            confirmMsg,
                          );
                        };

                        return (
                          <label
                            key={work.value}
                            className="flex items-center gap-1 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={onToggle}
                              className="accent-blue-500 dark:accent-blue-400"
                            />
                            {work.label}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-black dark:text-white">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page {pagination.page} of {pagination.totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers({ page: pagination.page - 1 })}
            disabled={pagination.page <= 1 || loading}
            className="px-3 py-1 border rounded border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => fetchUsers({ page: pagination.page + 1 })}
            disabled={pagination.page >= pagination.totalPages || loading}
            className="px-3 py-1 border rounded border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
