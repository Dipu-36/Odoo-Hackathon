// TODO: Add role-based auth guard middleware
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-white border-r" />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
