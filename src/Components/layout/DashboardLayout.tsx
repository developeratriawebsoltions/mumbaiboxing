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
    <div className="min-h-screen bg-white">
      <Sidebar role={role} />

      <div className="lg:ml-[270px] min-h-screen">
        <Header />

        <main className="min-h-screen bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
}