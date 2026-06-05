import DashboardLayout from "@/Components/layout/DashboardLayout";

const boxer = {
  name: "Rahul Sharma",
  id: "MBA-BXR-2024-0042",
  dob: "12 March 2000",
  weight: "60 KG",
  ageGroup: "Senior",
  taluka: "Borivali",
  academy: "Mumbai Boxing Academy",
  rank: 1,
  status: "Active",
};

const bouts = [
  { event: "Mumbai Open 2024", opponent: "Aman Singh", result: "Win", date: "10 Dec 2024" },
  { event: "District Championship 2024", opponent: "Vikas More", result: "Win", date: "5 Nov 2024" },
  { event: "State Trials 2024", opponent: "Rohan Patil", result: "Loss", date: "20 Oct 2024" },
];

export default function BoxerDashboard() {
  return (
    <DashboardLayout role="boxer">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Boxer Dashboard</h2>
          <p className="text-gray-500 text-sm">Your personal boxing profile & records</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl font-bold text-red-600">
            {boxer.name.charAt(0)}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-400">Full Name</p><p className="font-semibold">{boxer.name}</p></div>
            <div><p className="text-gray-400">Boxer ID</p><p className="font-semibold">{boxer.id}</p></div>
            <div><p className="text-gray-400">Date of Birth</p><p className="font-semibold">{boxer.dob}</p></div>
            <div><p className="text-gray-400">Weight Category</p><p className="font-semibold">{boxer.weight}</p></div>
            <div><p className="text-gray-400">Age Group</p><p className="font-semibold">{boxer.ageGroup}</p></div>
            <div><p className="text-gray-400">Current Rank</p><p className="font-semibold text-red-600">#{boxer.rank}</p></div>
            <div><p className="text-gray-400">Academy</p><p className="font-semibold">{boxer.academy}</p></div>
            <div><p className="text-gray-400">Taluka</p><p className="font-semibold">{boxer.taluka}</p></div>
            <div><p className="text-gray-400">Status</p><span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span></div>
          </div>
          <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download ID Card</button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Medical Records", badge: "Valid" },
            { title: "Tournament Entries", badge: "2 active" },
            { title: "Payment Receipts", badge: "View" },
            { title: "Certificates", badge: "3 available" },
          ].map((item) => (
            <div key={item.title} className="bg-white border rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow text-center">
              <p className="font-medium text-sm">{item.title}</p>
              <span className="text-xs text-blue-600 mt-1 block">{item.badge}</span>
            </div>
          ))}
        </div>

        {/* Bout History */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Bout History</h3>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  {["Event", "Opponent", "Result", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {bouts.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{b.event}</td>
                    <td className="px-4 py-3 text-gray-500">{b.opponent}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.result === "Win" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {b.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{b.date}</td>
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
