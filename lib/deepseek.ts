import OpenAI from "openai";

/**
 * DeepSeek API 客户端（OpenAI 兼容）
 * DeepSeek Chat API: https://platform.deepseek.com/api-docs
 */
export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-placeholder",
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

/** DeepSeek 当前推荐模型 */
export const DEEPSEEK_MODEL = "deepseek-chat";

/**
 * 调用 DeepSeek Chat Completion
 * 轻量封装，统一错误处理
 */
export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  },
) {
  const { temperature = 0.7, maxTokens = 2048, jsonMode = false } =
    options ?? {};

  const response = await deepseek.chat.completions.create({
    model: DEEPSEEK_MODEL,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    response_format: jsonMode ? { type: "json_object" } : undefined,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek API 返回空内容");
  }

  return content;
}
