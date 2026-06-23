import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MODE } from "@/lib/constants";

export function ModeFeatureCards() {
  return (
    <section id="modes" className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            两种探索模式
          </h2>
          <p className="text-lg text-muted-foreground">
            选择适合你的方式，开始探索人生的不同可能性
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {Object.values(MODE).map((mode) => (
            <Card
              key={mode.id}
              className="group relative flex flex-col overflow-hidden border-2 border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <span className="mb-4 text-4xl" aria-hidden="true">
                  {mode.icon}
                </span>
                <CardTitle className="text-2xl">{mode.title}</CardTitle>
                <CardDescription className="text-base font-medium text-foreground/70">
                  {mode.subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <p className="text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
                <Button className="w-full" variant={mode.id === "restart" ? "default" : "outline"} render={<Link href={mode.id === "future" ? "/future/onboarding" : "/onboarding?mode=restart"}>{mode.cta}</Link>} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
