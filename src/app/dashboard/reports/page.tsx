import DashboardLayout from "@/Components/layout/DashboardLayout";

const reportTypes = [
  {
    category: "Member Reports",
    reports: [
      { name: "Boxer Report", desc: "All registered boxers with status & details", rows: 1240 },
      { name: "Coach Report", desc: "All coaches with qualifications & academies", rows: 186 },
      { name: "Academy Report", desc: "Registered academies & affiliation status", rows: 42 },
    ],
  },
  {
    category: "Administrative Reports",
    reports: [
      { name: "Taluka-wise Report", desc: "Boxer & coach data grouped by taluka", rows: 3 },
      { name: "Event-wise Report", desc: "All tournaments, entries & results", rows: 12 },
      { name: "Payment Report", desc: "Complete payment records with audit trail", rows: 342 },
    ],
  },
];

export default function ReportsDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Reports Dashboard</h2>
          <p className="text-gray-500 text-sm">Generate & export Excel / PDF reports for all data</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Boxers", value: "1,240" },
            { label: "Total Coaches", value: "186" },
            { label: "Total Academies", value: "42" },
            { label: "Total Payments", value: "342" },
          ].map((s) => (
            <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Report Cards */}
        {reportTypes.map((group) => (
          <div key={group.category}>
            <h3 className="font-semibold text-lg mb-3">{group.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {group.reports.map((r) => (
                <div key={r.name} className="bg-white border rounded-xl p-5 shadow-sm">
                  <h4 className="font-semibold">{r.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
                  <p className="text-xs text-gray-400 mt-2">{r.rows.toLocaleString()} records</p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 text-sm bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium">
                      Excel
                    </button>
                    <button className="flex-1 text-sm bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium">
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Report */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Custom Report Generator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Report Type</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Boxer Report</option>
                <option>Coach Report</option>
                <option>Payment Report</option>
                <option>Event Report</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">From Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">To Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-slate-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-slate-800">Generate Report</button>
            <button className="bg-gray-100 text-gray-700 text-sm px-6 py-2 rounded-lg hover:bg-gray-200">Preview</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
