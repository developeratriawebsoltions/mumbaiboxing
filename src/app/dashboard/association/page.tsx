import DashboardLayout from "@/Components/layout/DashboardLayout";

const stats = [
  { label: "Registered Boxers", value: "1,240" },
  { label: "Coaches", value: "186" },
  { label: "Academies", value: "42" },
  { label: "Upcoming Events", value: "8" },
];

const sections = [
  {
    title: "Manage Members",
    items: ["Boxers List", "Coaches List", "Academies List"],
  },
  {
    title: "Events & Trials",
    items: ["Create Event", "Manage Trials", "Upload Notices"],
  },
  {
    title: "Documents & Payments",
    items: ["Approve Documents", "Payment Reports", "Pending Approvals"],
  },
];

export default function AssociationAdminDashboard() {
  return (
    <DashboardLayout role="association">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Association Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage boxers, coaches, academies, events & documents</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <div key={sec.title} className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold mb-3">{sec.title}</h3>
              <ul className="space-y-2">
                {sec.items.map((item) => (
                  <li key={item}>
                    <button className="w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Pending Document Approvals</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {["Name", "Type", "Document", "Submitted", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Rahul Sharma", type: "Boxer", doc: "Aadhaar Card", date: "12 Jan 2025" },
                  { name: "Suresh Patil", type: "Coach", doc: "Coach Certificate", date: "11 Jan 2025" },
                  { name: "Borivali Boxing Club", type: "Academy", doc: "Affiliation Docs", date: "10 Jan 2025" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-gray-500">{row.type}</td>
                    <td className="px-4 py-3">{row.doc}</td>
                    <td className="px-4 py-3 text-gray-400">{row.date}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">Approve</button>
                      <button className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
