import DashboardLayout from "@/Components/layout/DashboardLayout";

const records = [
  { name: "Rahul Sharma", weight: "60 KG", fitness: "Valid", expiry: "30 Jun 2025", injury: "None", eligible: true },
  { name: "Aman Singh", weight: "65 KG", fitness: "Expired", expiry: "01 Jan 2025", injury: "Shoulder strain", eligible: false },
  { name: "Pooja Desai", weight: "52 KG", fitness: "Valid", expiry: "15 Aug 2025", injury: "None", eligible: true },
  { name: "Kiran More", weight: "48 KG", fitness: "Expiring Soon", expiry: "25 Jan 2025", injury: "None", eligible: true },
];

export default function MedicalDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Medical Dashboard</h2>
          <p className="text-gray-500 text-sm">Boxer medical records, fitness certificates & competition eligibility</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Fit Boxers", value: "1,180", color: "text-green-600" },
            { label: "Expired Certificates", value: "32", color: "text-red-600" },
            { label: "Expiring Soon", value: "48", color: "text-orange-500" },
            { label: "With Injury", value: "15", color: "text-yellow-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h3 className="font-semibold text-orange-700 mb-2">⚠️ Medical Expiry Alerts</h3>
          <ul className="text-sm text-orange-600 space-y-1">
            <li>Kiran More – Fitness certificate expiring on 25 Jan 2025</li>
            <li>Vikas More – Fitness certificate expiring on 28 Jan 2025</li>
          </ul>
        </div>

        {/* Records Table */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Boxer Medical Records</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["Boxer", "Weight", "Fitness", "Expiry Date", "Injury", "Eligible"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-gray-500">{r.weight}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        r.fitness === "Valid" ? "bg-green-100 text-green-700"
                        : r.fitness === "Expired" ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600"
                      }`}>{r.fitness}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{r.expiry}</td>
                    <td className="px-4 py-3">{r.injury}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${r.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {r.eligible ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Verification */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-2">Doctor Verification Panel</h3>
          <p className="text-sm text-gray-500 mb-3">Verify and approve fitness certificates submitted by boxers.</p>
          <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700">Open Verification Panel</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
