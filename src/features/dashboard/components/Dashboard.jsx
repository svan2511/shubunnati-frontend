import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchAllUsers, fetchUserLogout } from "../../users/userSlice";
import MySwal from "../../../utils/alert";
import { useEffect } from "react";
import { fetchAllCenters } from "../../centers/centerSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");
  const userText = useSelector(
    (state) => state.loggedUser.fetchingTextUser
  );
  const totalCenters = useSelector((state) => state.center.totalRecords);

  useEffect(() => {
    dispatch(fetchAllUsers({ token, page: 1 }));
    dispatch(fetchAllCenters({ token, page: 1 }));
  }, []);

   /* ---------- Static KPI Data ---------- */
  const stats = [
    { title: "Total Users", value: userText },
    { title: "Total Members", value: 980 },
    { title: "Total Centers", value: totalCenters },
  ];

  /* ---------- Dummy Chart Data ---------- */
  const chartData = [
    { month: "Jan", members: 120 },
    { month: "Feb", members: 180 },
    { month: "Mar", members: 260 },
    { month: "Apr", members: 320 },
    { month: "May", members: 410 },
    { month: "Jun", members: 520 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* ✅ Reusable Navbar */}
      <Navbar />

      {/* ---------- Main Content ---------- */}
       <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        {/* ---------- KPI Cards ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-white/5 p-6 border border-white/10 shadow-md"
            >
              <p className="text-sm text-gray-400">{item.title}</p>
              <p className="mt-2 text-3xl font-bold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Chart ---------- */}
        <div className="rounded-xl bg-white/5 p-6 border border-white/10 mb-10">
          <h3 className="text-lg font-semibold mb-4">
            Member Growth (Last 6 Months)
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="members"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- Info & Activity ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notices */}
          <div className="rounded-xl bg-white/5 p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-3">
              Important Notices
            </h3>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>• Monthly center audits scheduled for next week</li>
              <li>• New loan policy applicable from 1st October</li>
              <li>• Field officer training program starts Monday</li>
              <li>• Ensure KYC compliance for all new members</li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white/5 p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">
              Recent Member Activity
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="py-2">Member Name</th>
                    <th className="py-2">Center</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Sunita Devi</td>
                    <td className="py-2">Center 12</td>
                    <td className="py-2 text-green-400">Active</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">Ramesh Kumar</td>
                    <td className="py-2">Center 07</td>
                    <td className="py-2 text-yellow-400">Pending</td>
                  </tr>
                  <tr>
                    <td className="py-2">Meena Sharma</td>
                    <td className="py-2">Center 19</td>
                    <td className="py-2 text-green-400">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
