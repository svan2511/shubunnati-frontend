import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../dashboard/Navbar";
import { fetchSingleMember } from "../memberSlice";
import { fetchUpdateEmi, setEmiUpdated } from "../../emis/emisSlice";
import { MySwal } from "../../../utils/alert";

export default function MemberView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const { member,emis, loading } = useSelector((state) => state.member);
  const isEmiUpdated = useSelector((state) => state.emi.isEmiUpdated);

  const [paymentInputs, setPaymentInputs] = useState({});
  const [processingBtn, setProcessingBtn] = useState(null);




  useEffect(() => {
    dispatch(fetchSingleMember({ token, id }));
  }, [dispatch, token, id]);

  useEffect(() => {
    
          if (isEmiUpdated !== null) {
          setProcessingBtn(null);
          let msg = "";
          let alertIcon = "";
          switch (isEmiUpdated) {
            case "updated":
              msg = "Emi updated Successfully!";
              alertIcon = "success";
              break;
            case "error":
              msg = "Internal error !";
              alertIcon = "error";
              break;
            default:
              msg = "";
          }

          MySwal.fire({
            toast: true,
            position: "top-end",
            icon: alertIcon,
            title: msg,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
          });

        dispatch(fetchSingleMember({ token, id }));
        dispatch(setEmiUpdated());
        }
    
  }, [isEmiUpdated]);

  // ✅ KEEP YOUR BEAUTIFUL LOADER
  if ((loading || !member) && !isEmiUpdated) {
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
  const updateEmis = (id , paid_amount , remain_amount ,type) => {
    setProcessingBtn(`${id}-${type}`);
   dispatch(fetchUpdateEmi({ token, emiData: {id , paid_amount , remain_amount} }));
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
          emis.map((emi , index) => {
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
            const disableAllActions = isPaid || isPartial;


            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueDate = emi?.due_date ? new Date(emi.due_date) : null;
            if (dueDate) dueDate.setHours(0, 0, 0, 0);
            const isFutureDue = dueDate && dueDate > today;

            return (
              <tr
                key={emi.id}
                className={`border-t border-white/10 transition
                            ${isFutureDue ? "opacity-50 cursor-not-allowed bg-white/5" : "hover:bg-white/5"}
                          `}
              >
                <td className="px-6 py-6 font-semibold">{index+1}</td>
                <td>
                {emi?.due_date
                  ? new Date(emi.due_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </td>

                <td className="px-6 py-6 font-medium">₹{instAmount}</td>

                {/* Paid Input */}
                <td className="px-6 py-6">
                  {isPaid || isPartial || isFutureDue ? (
                    <span className="text-green-400 font-semibold">₹{ isPartial ? paidAmount : instAmount }</span>
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
                  {isPaid ? "0" : `₹${isPartial ? remainAmount : newRemain}`}
                </td>

                {/* Status */}
                  <td className="px-6 py-6">
            {isPaid ? (
              <div className="flex flex-col gap-1">
                <span className="text-green-200 font-medium text-base">
                  Paid
                </span>
                <div className="w-24 h-1.5 rounded-full bg-green-200"></div>
              </div>
            ) : isPartial ? (
              <div className="flex flex-col gap-1">
                <span className="text-yellow-200 font-medium text-base">
                  Partial
                </span>
                <div className="w-24 h-1.5 rounded-full bg-yellow-200/70">
                  <div className="h-full w-1/2 bg-yellow-400 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-red-500 font-medium text-base">
                  Due
                </span>
                <div className="w-24 h-1.5 rounded-full bg-red-500/40"></div>
              </div>
            )}
          </td>





                {/* Actions */}
        <td className="px-6 py-6 text-center">
          <div className="flex justify-center gap-3">

            {/* Partial */}
            <button
              disabled={
                disableAllActions ||
                !paymentInputs[emi.id] ||
                inputAmount === instAmount ||
                processingBtn === `${emi.id}-partial`
              }
              className={`px-2 py-2 rounded-lg font-semibold tracking-wide shadow
                ${
                  disableAllActions ||
                  !paymentInputs[emi.id] ||
                  inputAmount === instAmount
                    ? "bg-yellow-100 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-200 hover:bg-yellow-300 text-black"
                }`}
              onClick={() =>
                updateEmis(emi.id, paymentInputs[emi.id], newRemain , "partial")
              }
            >
               { processingBtn === `${emi.id}-partial` ? "Processing..." : "Partially Paid" }
            </button>

            {/* Full */}
            <button
              disabled={
                disableAllActions ||
                inputAmount !== remainAmount ||
                processingBtn === `${emi.id}-full`
              }
              className={`px-2 py-2 rounded-lg font-semibold tracking-wide shadow
                ${
                  disableAllActions ||
                  inputAmount !== remainAmount
                    ? "bg-green-100 text-gray-500 cursor-not-allowed"
                    : "bg-green-200 hover:bg-green-300 text-black"
                }`}
              onClick={() =>
                updateEmis(emi.id, paymentInputs[emi.id], newRemain , 'full')
              }
            >
               { processingBtn === `${emi.id}-full` ? "Processing..." : "Fully Paid" }
            </button>

          </div>
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
