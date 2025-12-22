import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full text-center bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 text-red-500 p-4 rounded-full">
            <ShieldAlert size={42} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-100 mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-400 text-sm mb-6">
          You don’t have permission to view this page.
          If you believe this is a mistake, please contact your administrator.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}
