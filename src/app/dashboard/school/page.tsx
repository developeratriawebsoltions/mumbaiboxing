import DashboardLayout from "@/Components/layout/DashboardLayout";

export default function SchoolDashboard() {
  return (
    <DashboardLayout role="school">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">School / College Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage student boxers, coach details & competition entries</p>
        </div>

        {/* Profile */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-400">Institution Name</p><p className="font-semibold">Borivali High School</p></div>
            <div><p className="text-gray-400">Institution ID</p><p className="font-semibold">MBA-SCH-2024-0011</p></div>
            <div><p className="text-gray-400">Taluka</p><p className="font-semibold">Borivali</p></div>
            <div><p className="text-gray-400">Affiliated Coach</p><p className="font-semibold">Suresh Patil</p></div>
            <div><p className="text-gray-400">Affiliation Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Valid</span></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Student Boxers", value: "28" },
            { label: "Coaches", value: "2" },
            { label: "Competition Entries", value: "5" },
            { label: "Certificates", value: "18" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Student List */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Registered Student Boxers</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["Name", "Class", "Weight", "Coach", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Arjun Nair", cls: "11th", weight: "54 KG", coach: "Suresh Patil", status: "Active" },
                  { name: "Sneha Kulkarni", cls: "10th", weight: "46 KG", coach: "Suresh Patil", status: "Active" },
                  { name: "Rohan Joshi", cls: "12th", weight: "60 KG", coach: "Suresh Patil", status: "Pending" },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.cls}</td>
                    <td className="px-4 py-3">{s.weight}</td>
                    <td className="px-4 py-3 text-gray-500">{s.coach}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Competition Entries", action: "Submit Entry" },
            { title: "Payment Receipts", action: "View Receipts" },
            { title: "Certificates", action: "Download Certificates" },
          ].map((item) => (
            <div key={item.title} className="bg-white border rounded-xl p-5 shadow-sm">
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <button className="text-sm text-blue-600 font-medium hover:underline">{item.action} →</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
