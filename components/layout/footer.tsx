import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SITE, FOOTER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/20 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-base" aria-hidden="true">
              ⟡
            </span>
            <span>{SITE.name}</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-4 text-xs text-muted-foreground">
            {FOOTER.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-3 bg-border/20" />

        <p className="text-center text-[11px] text-muted-foreground/60 sm:text-left">
          {FOOTER.copyright}
        </p>
      </div>
    </footer>
  );
}
