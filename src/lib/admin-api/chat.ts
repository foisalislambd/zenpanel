import { adminConfig } from "@/config/admin.config";

export type ChatMessageInput = {
  role: "user" | "assistant";
  content: string;
};

export type AdminChatPageContextPayload = {
  pageId: string;
  title: string;
  description?: string;
  data?: Record<string, unknown>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatNumber(value: unknown): string {
  return typeof value === "number" ? value.toLocaleString() : "—";
}

function buildDashboardReply(data: Record<string, unknown>, prompt: string): string {
  const lower = prompt.toLowerCase();

  if (/growth|analyze|metric|stat|revenue|order|user/.test(lower)) {
    const users = formatNumber(data.totalUsers);
    const revenue = data.totalRevenue;
    const orders = formatNumber(data.newOrdersLast7Days);
    const messages = formatNumber(data.unreadMessages);
    const revenueText =
      typeof revenue === "number"
        ? new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(revenue)
        : "—";

    return `Here's a quick read on your dashboard metrics:

• **Total users:** ${users}
• **Revenue (all time):** ${revenueText}
• **New orders (7 days):** ${orders}
• **Unread messages:** ${messages}

User sign-ups are steady and order volume is healthy for the week. Consider following up on unread messages and reviewing recent service orders for upsell opportunities.

_Connect your AI API to get deeper analysis tailored to your business._`;
  }

  return `I can see your dashboard overview with live preview stats. Ask me to analyze growth, summarize revenue, or suggest next steps for your admin workflow.

_Connect \`POST /api/admin/ai/chat\` in your backend to enable full AI responses._`;
}

function buildPageReply(page: AdminChatPageContextPayload, prompt: string): string {
  const lower = prompt.toLowerCase();

  if (/what can you|help|how do/.test(lower)) {
    return `On **${page.title}**, I can help you:

• Understand what this section manages
• Suggest workflows and best practices
• Draft content ideas (once your AI API is connected)
• Navigate to related admin pages

${page.description ? `\n${page.description}` : ""}

This panel is a UI shell — wire your backend AI endpoint to unlock generation and apply-to-editor flows.`;
  }

  if (/write|create|draft|generate/.test(lower)) {
    return `I'd prepare a draft for **${page.title}** based on your prompt. In this preview shell, generation is simulated.

To enable real AI output:
1. Add an AI route (e.g. \`/api/admin/ai/chat\`)
2. Replace \`previewSendAdminChatMessage\` in \`src/lib/admin-api/chat.ts\`
3. Optionally add editor apply handlers via \`useAdminChatPageContext\``;
  }

  return `You're on **${page.title}**. I received your message and I'm ready to assist once your AI backend is connected.

For now, this preview assistant confirms the chat panel is working and page context (\`${page.pageId}\`) is attached correctly.`;
}

/**
 * Preview chat — replace with a real API call when your backend is ready.
 */
export async function previewSendAdminChatMessage(input: {
  messages: ChatMessageInput[];
  pageContext?: AdminChatPageContextPayload;
}) {
  await delay(700 + Math.random() * 500);

  const lastUser = [...input.messages].reverse().find((m) => m.role === "user");
  const prompt = lastUser?.content ?? "";
  const page = input.pageContext;
  const brand = adminConfig.brand.name;

  let reply: string;

  if (page?.pageId === "dashboard" && page.data && Object.keys(page.data).length > 0) {
    reply = buildDashboardReply(page.data, prompt);
  } else if (page) {
    reply = buildPageReply(page, prompt);
  } else {
    reply = `Hello from **${brand} AI** (preview mode). Ask anything about the admin panel — connect your API for full assistant capabilities.`;
  }

  return { reply };
}
