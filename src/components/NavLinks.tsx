"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/brand/navigation";

type Item = { readonly href: string; readonly label: string };

/** Desktop top menu: the current page is gold and announced to screen readers. */
export function NavLinks({ items }: { items: readonly Item[] }) {
  const pathname = usePathname() ?? "/";
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium ${
                active ? "text-gold" : "text-ivory hover:text-pale-gold"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
