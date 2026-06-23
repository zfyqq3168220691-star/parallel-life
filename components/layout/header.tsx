"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/mode-select", label: "开始探索" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="text-xl" aria-hidden="true">
            ⟡
          </span>
          <span className="hidden text-sm sm:inline">{SITE.name}</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              size="sm"
              render={<Link href={link.href}>{link.label}</Link>}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
