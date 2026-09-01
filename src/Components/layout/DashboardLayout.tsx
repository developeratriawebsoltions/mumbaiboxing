import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  return (
    <div className="flex bg-white" style={{ minHeight: "100vh" }}>
      <Sidebar role={role} />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}