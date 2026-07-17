export default function AdminMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-full min-h-0 flex-1 flex-col">{children}</div>;
}
