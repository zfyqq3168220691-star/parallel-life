import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MODE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "选择模式",
  description: "选择重启人生或未来推演，开始探索不同的人生可能性。",
};

export default function ModeSelectPage() {
  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            选择你的探索模式
          </h1>
          <p className="text-lg text-muted-foreground">
            两种方式，同一个目的——探索可能性
          </p>
        </div>

        {/* Mode cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {Object.values(MODE).map((mode) => (
            <Card
              key={mode.id}
              className="group relative flex flex-col overflow-hidden border-2 border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <span className="mb-4 text-5xl" aria-hidden="true">
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
                <Button size="lg" className="w-full" render={<Link href={mode.id === "future" ? "/future/onboarding" : `/onboarding?mode=${mode.id}`}>{mode.cta}</Link>} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Button variant="ghost" render={<Link href="/">← 返回首页</Link>} />
        </div>
      </div>
    </div>
  );
}
