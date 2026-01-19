"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export default function Breadcrumb({ usernameMap }) {
  const pathname = usePathname();
  if (!pathname) return null;

  const pathParts = pathname.split("/").filter(Boolean);

  let href = "";
  const crumbs = pathParts.map((part, idx) => {
    href += `/${part}`;

    let label = part;
    let Icon;

    // Map top-level routes to label & icon
    if (href === "/dashboard/home") {
      label = "Home";
      Icon = HomeIcon;
    } else if (href === "/dashboard/users") {
      label = "Users";
      Icon = UserGroupIcon;
    } else if (href === "/dashboard/form") {
      label = "Add User";
      Icon = UserPlusIcon;
    } else if (href === "/dashboard/workTable") {
      label = "Assigned Work";
      Icon = TableCellsIcon;
    }

    // Dynamic username for /users/[id]
    if (usernameMap && pathParts[idx - 1] === "users") {
      label = usernameMap[part] || `User ${part}`;
    }

    return { href, label, Icon };
  });

  return (
    <nav className="flex items-center text-sm mb-4 space-x-1 text-gray-600">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {crumb.Icon && <crumb.Icon className="h-4 w-4" />}
            {isLast ? (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            )}
            {!isLast && <span className="mx-1">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
