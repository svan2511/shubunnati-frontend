import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import { fetchAllUsers, fetchUserLogout } from "../../users/userSlice";
import MySwal from "../../../utils/alert";
import { useEffect, useState } from "react";
import { fetchAllCenters } from "../../centers/centerSlice";
import { fetchAllMembers } from "../../members/memberSlice";
import { fetchDashboardData } from "../../emis/emisSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");
  const userText = useSelector(
    (state) => state.loggedUser.fetchingTextUser
  );
  const dashBoardData = useSelector((state) => state.emi.dashBoardData);
  const totalCenters = useSelector((state) => state.center.totalRecords);
  const totalMembers = useSelector((state) => state.member.totalRecords);

  const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);


  useEffect(() => {
    dispatch(fetchAllUsers({ token, page: 1 }));
    dispatch(fetchAllCenters({ token, page: 1 }));
    dispatch(fetchAllMembers({ token, page: 1 }));
    dispatch(fetchDashboardData({token , filterData:{}}));
  }, [dispatch, token]);

  /* ---------- Static KPI Data ---------- */
  const stats = [
    { title: "Total Users", value: userText },
    { title: "Total Members", value: totalMembers },
    { title: "Total Centers", value: totalCenters },
  ];

  console.log(userText);

   if (showLoader) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-lg font-semibold">
              Loading...
            </p>
            <p className="text-gray-400 text-sm">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }


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
              <p className="mt-2 text-1xl font-bold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Chart First ---------- */}
        <div className="rounded-xl bg-white/5 p-6 border border-white/10 mb-10">
          <h3 className="text-lg font-semibold mb-4">
            Disbursement vs Collection (Last 12 Months)
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashBoardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month_name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_dis"
                  name="Disbursement"
                  fill="#3B82F6"   // Blue
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="total_coll"
                  name="Collection"
                  fill="#22C55E"   // Green
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- Chart Second ---------- */}
                <div className="rounded-xl bg-white/5 p-6 border border-white/10 mb-10">
                  <h3 className="text-lg font-semibold mb-4">
                    Demand vs OD (Last 12 Months)
                  </h3>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashBoardData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="month_name" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="total_od"
                          name="OD"
                          fill="#ce1717ff"   // Blue
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar
                          dataKey="total_dem"
                          name="Demand"
                          fill="#e2e37eff"   // Green
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
        {/* ---------- Info & Activity ---------- */}
       
      </div>
    </div>
  );
}
