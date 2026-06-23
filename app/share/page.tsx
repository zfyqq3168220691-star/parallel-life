import { Metadata } from "next";

export const metadata: Metadata = {
  title: "分享",
  description: "分享你的人生探索结果。",
};

export default function SharePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md text-center">
        <span className="text-5xl" aria-hidden="true">
          📤
        </span>
        <h1 className="mt-4 text-2xl font-bold">分享</h1>
        <p className="mt-2 text-muted-foreground">
          此功能将在阶段6开发。你可以生成分享卡片，与好友分享你的人生探索结果。
        </p>
      </div>
    </div>
  );
}
