import DashboardLayout from "@/Components/layout/DashboardLayout";

const academy = {
  name: "Mumbai Boxing Academy",
  id: "MBA-ACD-2024-0007",
  taluka: "Andheri",
  affiliation: "Valid till Dec 2025",
  renewalDue: "31 Dec 2025",
};

export default function AcademyDashboard() {
  return (
    <DashboardLayout role="academy">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Academy / Club Dashboard</h2>
          <p className="text-gray-500 text-sm">Manage your academy profile, members & events</p>
        </div>

        {/* Profile */}
        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-xl bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-600">
            MA
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-400">Academy Name</p><p className="font-semibold">{academy.name}</p></div>
            <div><p className="text-gray-400">Academy ID</p><p className="font-semibold">{academy.id}</p></div>
            <div><p className="text-gray-400">Taluka</p><p className="font-semibold">{academy.taluka}</p></div>
            <div><p className="text-gray-400">Affiliation Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{academy.affiliation}</span></div>
            <div><p className="text-gray-400">Renewal Due</p><p className="font-semibold text-orange-500">{academy.renewalDue}</p></div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Affiliation Certificate</button>
            <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Payment Receipts</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Registered Boxers", value: "48" },
            { label: "Registered Coaches", value: "6" },
            { label: "Active Tournaments", value: "2" },
            { label: "Renewal Status", value: "Valid" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Registered Boxers */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Registered Boxers</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["Name", "Age Group", "Weight", "Rank", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Rahul Sharma", age: "Senior", weight: "60 KG", rank: 1, status: "Active" },
                  { name: "Pooja Desai", age: "Junior", weight: "52 KG", rank: 4, status: "Active" },
                  { name: "Kiran More", age: "Youth", weight: "48 KG", rank: 8, status: "Inactive" },
                ].map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-gray-500">{b.age}</td>
                    <td className="px-4 py-3">{b.weight}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">#{b.rank}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Entry */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Event Entry Submission</h3>
          <p className="text-sm text-gray-500 mb-4">Submit your academy's boxer entries for upcoming tournaments.</p>
          <button className="bg-red-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-red-700">Submit Event Entry</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
