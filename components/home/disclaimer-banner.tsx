import { DISCLAIMER } from "@/lib/constants";

export function DisclaimerBanner() {
  return (
    <section className="border-t border-border/30 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <span className="mt-0.5 shrink-0 text-sm" aria-hidden="true">
              ⚠️
            </span>

            {/* Content */}
            <div className="min-w-0">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200/60">
                {DISCLAIMER.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {DISCLAIMER.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
