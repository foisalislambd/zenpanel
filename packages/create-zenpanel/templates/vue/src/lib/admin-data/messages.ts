export type AdminMessage = {
  id: string;
  from: "customer" | "admin";
  body: string;
  sentAt: string;
};

export type AdminConversation = {
  id: string;
  name: string;
  email: string;
  subject: string;
  unread: number;
  messages: AdminMessage[];
};

function minutesAgo(min: number) {
  return new Date(Date.now() - min * 60_000).toISOString();
}

/** Sample inbox for the UI preview - replace with your messaging API. */
export const adminConversations: AdminConversation[] = [
  {
    id: "c-1",
    name: "Sarah Mitchell",
    email: "sarah.m@example.com",
    subject: "Invoice for website redesign",
    unread: 2,
    messages: [
      { id: "m-1", from: "customer", body: "Hi! Could you resend the invoice for ORD-1048? Our finance team needs a PDF copy.", sentAt: minutesAgo(95) },
      { id: "m-2", from: "admin", body: "Of course - I'll send it over shortly.", sentAt: minutesAgo(80) },
      { id: "m-3", from: "customer", body: "Thanks! Also, can the billing address be updated to our new office?", sentAt: minutesAgo(12) },
      { id: "m-4", from: "customer", body: "It's 200 Market St, Suite 400, San Francisco.", sentAt: minutesAgo(11) },
    ],
  },
  {
    id: "c-2",
    name: "James Chen",
    email: "james.chen@example.com",
    subject: "SEO audit timeline",
    unread: 1,
    messages: [
      { id: "m-5", from: "customer", body: "When should we expect the first SEO audit report?", sentAt: minutesAgo(180) },
    ],
  },
  {
    id: "c-3",
    name: "Emma Rodriguez",
    email: "emma.r@example.com",
    subject: "Brand kit feedback",
    unread: 0,
    messages: [
      { id: "m-6", from: "customer", body: "Loved the new color palette! One question about the logo spacing.", sentAt: minutesAgo(60 * 26) },
      { id: "m-7", from: "admin", body: "Glad you like it! Happy to adjust - send me the details.", sentAt: minutesAgo(60 * 25) },
    ],
  },
  {
    id: "c-4",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    subject: "Pro license activation",
    unread: 0,
    messages: [
      { id: "m-8", from: "customer", body: "My Pro license key says it's already in use.", sentAt: minutesAgo(60 * 50) },
      { id: "m-9", from: "admin", body: "I've reset the activation - please try again now.", sentAt: minutesAgo(60 * 49) },
      { id: "m-10", from: "customer", body: "Works now, thank you!", sentAt: minutesAgo(60 * 48) },
    ],
  },
];
