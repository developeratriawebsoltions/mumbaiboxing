import DashboardLayout from "@/Components/layout/DashboardLayout";

const stats = [
  { label: "Total Boxers", value: "1,240", color: "bg-blue-500" },
  { label: "Total Coaches", value: "186", color: "bg-green-500" },
  { label: "Academies", value: "42", color: "bg-purple-500" },
  { label: "Pending Approvals", value: "28", color: "bg-orange-500" },
  { label: "Payments Pending", value: "₹84,500", color: "bg-red-500" },
  { label: "Active Tournaments", value: "5", color: "bg-teal-500" },
];

const actions = [
  { title: "User Approvals", desc: "Review & approve new registrations", badge: "28 pending" },
  { title: "Payment Verification", desc: "Verify incoming payments", badge: "12 unverified" },
  { title: "ID / Certificate Generation", desc: "Generate digital IDs & certificates", badge: "" },
  { title: "Ranking Updates", desc: "Update boxer rankings manually", badge: "" },
  { title: "Reports Export", desc: "Export Excel / PDF reports", badge: "" },
  { title: "Notice Management", desc: "Post official notices & circulars", badge: "3 drafts" },
];

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout role="superadmin">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Full website control & oversight</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4 shadow-sm text-center">
              <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((a) => (
              <div key={a.title} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md cursor-pointer transition-shadow">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold">{a.title}</h4>
                  {a.badge && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{a.badge}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{a.desc}</p>
                <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">
                  Open →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
          <div className="bg-white rounded-xl border shadow-sm divide-y">
            {[
              { action: "New boxer registration", user: "Rahul Sharma", time: "2 min ago", type: "info" },
              { action: "Payment received ₹1,500", user: "Mumbai Boxing Academy", time: "15 min ago", type: "success" },
              { action: "Document uploaded", user: "Aman Singh", time: "1 hr ago", type: "info" },
              { action: "Certificate generated", user: "Coach Suresh Patil", time: "3 hr ago", type: "success" },
              { action: "Ranking updated – Senior 60kg", user: "Admin", time: "5 hr ago", type: "warning" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.user}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
