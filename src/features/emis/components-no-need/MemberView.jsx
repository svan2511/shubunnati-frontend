import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../dashboard/Navbar";
import { fetchSingleMember } from "../memberSlice";

export default function MemberView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const { member,emis, loading } = useSelector((state) => state.member);

  const [partialAmount, setPartialAmount] = useState({});
  const [paymentInputs, setPaymentInputs] = useState({});


  useEffect(() => {
    dispatch(fetchSingleMember({ token, id }));
  }, [dispatch, token, id]);

 

  // ✅ KEEP YOUR BEAUTIFUL LOADER
  if (loading || !member) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-white text-lg font-semibold">
              Loading member details
            </p>
            <p className="text-gray-400 text-sm">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 🔁 ACTION HANDLERS (API CALLS CAN BE PLUGGED HERE)
  const handleFullPayment = (emi) => {
    console.log("FULL PAYMENT", emi.id);
    // dispatch(updateEmiStatus({ type: "full", emiId: emi.id }))
  };

  const handlePartialPayment = (emi) => {
    const amount = partialAmount[emi.id];
    if (!amount || amount <= 0) return alert("Enter valid amount");

    console.log("PARTIAL PAYMENT", emi.id, amount);
    // dispatch(updateEmiStatus({ type: "partial", emiId: emi.id, amount }))
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* ================= MEMBER DETAILS ================= */}
        <div className="bg-gray-800 rounded-xl p-6 flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-indigo-600 text-2xl font-semibold">
            {member.mem_img ? (
              <img
                src={member.mem_img}
                alt={member.mem_name}
                className="w-full h-full object-cover"
              />
            ) : (
              member.mem_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <Info label="Name" value={member.mem_name} />
            <Info label="Phone" value={member.mem_phone} />
            <Info label="Center" value={member.center?.center_name} />
            <Info label="Disbursed" value={`₹ ${member.disb_amount}`} />
            <Info label="Tenor" value={`${member.mem_tenor} Months`} />
            <Info label="Monthly EMI" value={`₹ ${member.monthly_inst}`} />
            <Info label="Disb Date" value={member.disb_date} />
          </div>
        </div>

        {/* ================= EMI / TRANSACTIONS ================= */}
    <div className="mt-10">
  <h3 className="text-2xl font-bold tracking-wide mb-6">
    Installments / EMIs
  </h3>

  <div className="overflow-x-auto rounded-xl border border-white/10">
    <table className="min-w-full text-base">
      <thead className="bg-white/10 text-gray-300 uppercase text-sm">
        <tr>
          <th className="px-6 py-4 text-left">Installment</th>
          <th className="px-6 py-4 text-left">Due Date</th>
          <th className="px-6 py-4 text-left">Amount</th>
          <th className="px-6 py-4 text-left">Paid</th>
          <th className="px-6 py-4 text-left">Remaining</th>
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {(Array.isArray(emis) ? emis : []).length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
              No installments found
            </td>
          </tr>
        ) : (
          emis.map((emi) => {
            const instAmount = Number(emi?.inst_amount || 0);
            const paidAmount = Number(emi?.paid_amount || 0);
            const remainAmount =
              emi?.remain_amount != null
                ? Number(emi.remain_amount)
                : instAmount - paidAmount;

            const inputAmount = Number(paymentInputs[emi.id] || 0);
            const newRemain = Math.max(remainAmount - inputAmount, 0);

            const isPaid = emi?.status === 1;
            const isPartial = paidAmount > 0 && !isPaid;

            return (
              <tr
                key={emi.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-6 py-6 font-semibold">{emi?.inst_name || "—"}</td>
                <td className="px-6 py-6">{emi?.due_date || "—"}</td>
                <td className="px-6 py-6 font-medium">₹{instAmount}</td>

                {/* Paid Input */}
                <td className="px-6 py-6">
                  {isPaid ? (
                    <span className="text-green-400 font-semibold">₹{instAmount}</span>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      max={remainAmount}
                      placeholder="₹ Amount"
                      className="w-36 px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={paymentInputs[emi.id] ?? ""}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > remainAmount) val = remainAmount;
                        setPaymentInputs((prev) => ({
                          ...prev,
                          [emi.id]: val,
                        }));
                      }}
                    />
                  )}
                </td>

                {/* Remaining */}
                <td className="px-6 py-6 font-medium text-yellow-300">
                  {isPaid ? "—" : `₹${newRemain}`}
                </td>

                {/* Status */}
                <td className="px-6 py-6">
                  {isPaid ? (
                    <span className="px-4 py-2 rounded-full bg-green-600/20 text-green-400 font-semibold text-base">
                      PAID
                    </span>
                  ) : isPartial ? (
                    <span className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold text-base">
                      PARTIAL
                    </span>
                  ) : (
                    <span className="px-4 py-2 rounded-full bg-red-600/20 text-red-400 font-semibold text-base">
                      DUE
                    </span>
                  )}
                </td>

                {/* Actions */}
        
                <td className="px-6 py-6 text-center">
                {isPaid ? (
                    <span className="text-gray-400 text-sm">Completed</span>
                ) : (
                    <div className="flex justify-center gap-3">
                    {/* Partial */}
                    <button
                        disabled={!paymentInputs[emi.id] || isPaid || inputAmount === instAmount}
                        className={`px-2 py-2 rounded-lg font-semibold tracking-wide shadow
                        ${(!paymentInputs[emi.id] || isPaid || inputAmount === instAmount)
                            ? "bg-yellow-100 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-200 hover:bg-yellow-300 text-black"
                        }`}
                        onClick={() =>
                        console.log("PARTIAL", emi.id, paymentInputs[emi.id])
                        }
                    >
                        Partialy paid
                    </button>

                    {/* Full */}
                    <button
                        disabled={inputAmount !== remainAmount || isPaid}
                        className={`px-2 py-2 rounded-lg font-semibold tracking-wide shadow
                        ${(inputAmount !== remainAmount || isPaid)
                            ? "bg-green-100 text-gray-500 cursor-not-allowed"
                            : "bg-green-200 hover:bg-green-300 text-black"
                        }`}
                        onClick={() =>
                        console.log("FULL", emi.id)
                        }
                    >
                        Fully paid
                    </button>
                    </div>
                )}
                </td>


              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>


      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-3 py-2 text-left text-gray-300 font-medium">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="px-3 py-2">
      {children}
    </td>
  );
}
