import DashboardLayout from "@/Components/layout/DashboardLayout";

const certs = [
  { id: "CERT-001", name: "Rahul Sharma", type: "Participation", event: "Mumbai Open 2024", issued: "15 Dec 2024", qr: "verified" },
  { id: "CERT-002", name: "Pooja Desai", type: "Merit – Gold", event: "District Championship 2024", issued: "20 Nov 2024", qr: "verified" },
  { id: "CERT-003", name: "Suresh Patil", type: "Coach Certificate", event: "Annual Renewal 2024", issued: "01 Jan 2025", qr: "verified" },
  { id: "CERT-004", name: "Mumbai Boxing Academy", type: "Academy Affiliation", event: "Annual Renewal 2025", issued: "05 Jan 2025", qr: "verified" },
  { id: "CERT-005", name: "Aman Singh", type: "Participation", event: "Borivali Trials 2024", issued: "10 Dec 2024", qr: "pending" },
];

const types = [
  { label: "Participation", count: 428, color: "bg-blue-100 text-blue-700" },
  { label: "Merit", count: 96, color: "bg-yellow-100 text-yellow-700" },
  { label: "Coach", count: 186, color: "bg-green-100 text-green-700" },
  { label: "Academy", count: 42, color: "bg-purple-100 text-purple-700" },
];

export default function CertificateDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Certificate Dashboard</h2>
            <p className="text-gray-500 text-sm">Issue, manage & verify certificates with QR codes</p>
          </div>
          <button className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700">Generate Certificate</button>
        </div>

        {/* Certificate Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {types.map((t) => (
            <div key={t.label} className="bg-white border rounded-xl p-5 shadow-sm text-center">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${t.color}`}>{t.label}</span>
              <p className="text-3xl font-bold mt-3">{t.count}</p>
              <p className="text-xs text-gray-500 mt-1">Issued</p>
            </div>
          ))}
        </div>

        {/* QR Verification */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">QR Code Verification</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter certificate ID or scan QR code…"
              className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700">Verify</button>
          </div>
        </div>

        {/* Certificates Table */}
        <div>
          <h3 className="font-semibold text-lg mb-3">All Certificates</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["ID", "Name", "Type", "Event", "Issued", "QR Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {certs.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.id}</td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.type}</td>
                    <td className="px-4 py-3 text-gray-500">{c.event}</td>
                    <td className="px-4 py-3 text-gray-400">{c.issued}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.qr === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {c.qr === "verified" ? "✓ Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-blue-600 hover:underline mr-3">PDF</button>
                      <button className="text-xs text-gray-500 hover:underline">View</button>
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
