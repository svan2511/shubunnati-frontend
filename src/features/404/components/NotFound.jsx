import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-xl w-full text-center"
      >
        {/* Big 404 */}
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[8rem] font-extrabold text-indigo-500 tracking-tight leading-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">
          Page not found
        </h2>

        <p className="text-gray-400 mt-3 max-w-md mx-auto">
          The page you are looking for doesn’t exist, was removed,
          or the URL is incorrect.
        </p>

        {/* Divider */}
        <div className="w-20 h-1 bg-indigo-500 rounded-full mx-auto my-6" />

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
