import DashboardLayout from "@/Components/layout/DashboardLayout";

const coach = {
  name: "Suresh Patil",
  id: "MBA-CCH-2024-0018",
  qualification: "AIBA Level 2",
  academy: "Mumbai Boxing Academy",
  taluka: "Andheri",
  status: "Active",
};

const boxers = [
  { name: "Rahul Sharma", weight: "60 KG", medical: "Valid", docs: "Complete", rank: 1 },
  { name: "Pooja Desai", weight: "52 KG", medical: "Valid", docs: "Pending", rank: 4 },
  { name: "Kiran More", weight: "48 KG", medical: "Expired", docs: "Complete", rank: 8 },
  { name: "Aman Singh", weight: "65 KG", medical: "Valid", docs: "Complete", rank: 2 },
];

export default function CoachDashboard() {
  return (
    <DashboardLayout role="coach">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Coach Dashboard</h2>
          <p className="text-gray-500 text-sm">Your coaching profile & boxer management</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {coach.name.charAt(0)}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-400">Full Name</p><p className="font-semibold">{coach.name}</p></div>
            <div><p className="text-gray-400">Coach ID</p><p className="font-semibold">{coach.id}</p></div>
            <div><p className="text-gray-400">Qualification</p><p className="font-semibold">{coach.qualification}</p></div>
            <div><p className="text-gray-400">Academy</p><p className="font-semibold">{coach.academy}</p></div>
            <div><p className="text-gray-400">Taluka</p><p className="font-semibold">{coach.taluka}</p></div>
            <div><p className="text-gray-400">Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download ID Card</button>
            <button className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">Download Certificate</button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Boxers", value: boxers.length },
            { label: "Tournament Entries", value: 3 },
            { label: "Medical Alerts", value: 1 },
            { label: "Pending Docs", value: 1 },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Boxer List */}
        <div>
          <h3 className="font-semibold text-lg mb-3">My Boxers</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["Name", "Weight", "Medical", "Documents", "Rank"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {boxers.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-gray-500">{b.weight}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.medical === "Valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {b.medical}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.docs === "Complete" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {b.docs}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-600">#{b.rank}</td>
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
