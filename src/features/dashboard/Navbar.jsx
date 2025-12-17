import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {MySwal} from "../../utils/alert";
import { fetchUserLogout } from "../../features/users/userSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("auth_token");

  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-semibold transition ${
      isActive
        ? "bg-indigo-500 text-white"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  const logoutUser = () => {
    MySwal.fire({
      title: "Are you sure to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mx-2",
        cancelButton:
          "px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 mx-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(fetchUserLogout(token));

        MySwal.fire({
          title: "Logged out successfully!",
          icon: "success",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
          },
        });

        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <nav className="border-b border-white/10 bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">
          Subh Unnati Micro Finance
        </h1>

        <div className="flex gap-2">
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>

          <NavLink to="/users" className={linkClasses}>
            Users
          </NavLink>

          <NavLink to="/roles" className={linkClasses}>
            Roles
          </NavLink>

           <NavLink to="/permissions" className={linkClasses}>
            Permissions
          </NavLink>

          <NavLink to="/centers" className={linkClasses}>
            Centers
          </NavLink>

          <button
            onClick={logoutUser}
            className="px-4 py-2 rounded-md text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
