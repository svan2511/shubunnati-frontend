import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Navbar from "../../dashboard/Navbar";
import {can, MySwal} from "../../../utils/alert";

import {
  fetchAllUsers,
  fetchCreateUser,
  fetchDeleteUser,
  fetchUpdateUser,
  setUpdateStatus,
} from "../userSlice";
import { fetchAllRoles } from "../../roles/roleSlice";

export default function List() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");
  
  const {
    users,
    currentPage,
    totalPages,
    loading,isSubmitting,
    isUserCreate,
  } = useSelector((state) => state.loggedUser);

  const roles = useSelector((state) => state.role.roles);

  /* ================= Modal State ================= */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // create | view | edit

  /* ================= useForm ================= */
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      roles: [],
    },
  });

  /* ================= Fetch ================= */
  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage }));
    dispatch(fetchAllRoles({ page:"ALL" }));
  }, [dispatch, currentPage]);

  /* ================= Toast ================= */
  useEffect(() => {
          if (isUserCreate === "create" || isUserCreate === "update" || isUserCreate === "delete" || isUserCreate === "error") {
          let msg = "";
          let alertIcon = "";
          switch (isUserCreate) {
            case "create":
              msg = "User Created Successfully!";
              alertIcon = "success";
              break;
            case "update":
              msg = "User Updated Successfully!";
              alertIcon = "success";
              break;
             case "delete":
              msg = "User Deleted Successfully!";
              alertIcon = "success";
              break;
              case "error":
              msg = "Some internal error!";
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

          if(isUserCreate !== "error") {
          dispatch(fetchAllUsers({ page: currentPage }));
          dispatch(setUpdateStatus());
          closeModal();
          }
        }

      
      reset({ name: "", email: "", roles: [] });
  }, [isUserCreate, reset]);

  /* ================= Helpers ================= */
  const normalizeRoleIds = (userRoles = []) => {
    if (!userRoles.length) return [];

    if (typeof userRoles[0] === "number") {
      return userRoles.map(Number);
    }

    if (typeof userRoles[0] === "object") {
      return userRoles.map((r) => Number(r.id));
    }

    return userRoles
      .map((name) => roles.find((r) => r.name === name)?.id)
      .filter(Boolean)
      .map(Number);
  };

  /* ================= Modal Handlers ================= */
  const openCreateModal = () => {
    setModalMode("create");
    reset({ name: "", email: "", roles: [] });
    setIsModalOpen(true);
  };

  const openViewModal = (user) => {
    setModalMode("view");
    reset({
      name: user.name,
      email: user.email,
      roles: normalizeRoleIds(user.roles),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    reset({
      name: user.name,
      email: user.email,
      user_id:user.id,
      roles: normalizeRoleIds(user.roles),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ================= Submit ================= */
  const onSubmit = (formData) => {
    console.log(formData);
    if (modalMode === "create") {
      dispatch(fetchCreateUser({ userdata: formData }));
    }
     if (modalMode === "edit") {
      dispatch(fetchUpdateUser({ userdata: formData }));
    }
  };

  /* ================= Delete ================= */
  const handleDelete = (userId) => {
    MySwal.fire({
      title: "Delete user?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mx-2",
        cancelButton:
          "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mx-2",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(fetchDeleteUser({ userId}));
      }
    });
  };

  /* ================= Pagination ================= */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <span className="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
        { can('create-users') && <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            + Add User
          </button>}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-white/10 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : users.map((user, index) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-4 py-3 text-center">{user.name}</td>
                  <td className="px-4 py-3 text-center">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((r) => (
                        <span
                          key={r.id ?? r}
                          className="px-2 py-1 text-xs rounded bg-indigo-600/20 text-indigo-400  text-center"
                        >
                          {r.name ?? r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                     {
                      can('view-users') &&
                       <button
                        onClick={() => openViewModal(user)}
                        className="px-3 py-1 bg-blue-600 rounded"
                      >
                        View
                      </button>
                     }
                      { can('edit-users') && <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded"
                      >
                        Edit
                      </button> }
                     { can('delete-users') && <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-1">
            {getPageNumbers().map((p) => (
              <button
                key={p}
                className={`px-3 py-2 rounded ${
                  p === currentPage
                    ? "bg-indigo-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= Modal ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-2xl bg-gray-900 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold capitalize">
                {modalMode} User
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 space-y-5"
            >
              {modalMode === "create" && <input type="hidden" name="password" value="password"  {...register("password")} /> }
               
                <input
                {...register("name", {
                  required: "Name is required",
                })}
                disabled={modalMode === "view"}
                placeholder="Enter name"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                          disabled:opacity-60"
              />

              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}

              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                disabled={modalMode === "view"}
                placeholder="Enter email"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                          disabled:opacity-60"
              />

              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}


              {/* Roles */}
              <div>
                <p className="mb-2 text-gray-400">Roles</p>
                <Controller
  name="roles"
  control={control}
  rules={{
    validate: (value) =>
      value.length > 0 || "Select at least one role",
  }}
  render={({ field }) => (
    <>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const roleId = Number(role.id);
          const isChecked = field.value.includes(roleId);

          return (
            <label
              key={roleId}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border
                ${isChecked ? "bg-indigo-600/20 border-indigo-500" : "bg-gray-800 border-gray-700"}
                ${modalMode === "view" ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <input
                type="checkbox"
                // do NOT disable; instead prevent change in view mode
                checked={isChecked}
                onChange={() => {
                  if (modalMode !== "view") {
                    field.onChange(
                      isChecked
                        ? field.value.filter((id) => id !== roleId)
                        : [...field.value, roleId]
                    );
                  }
                }}
                className="h-4 w-4 accent-indigo-500"
              />
              <span
                className={`text-sm capitalize ${
                  isChecked ? "text-indigo-400 font-semibold" : "text-gray-200"
                }`}
              >
                {role.name}
              </span>
            </label>
          );
        })}
      </div>

      {errors.roles && (
        <span className="text-red-500 text-sm mt-1 block">
          {errors.roles.message}
        </span>
      )}
    </>
  )}
/>


              </div>

              {/* Footer */}
              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 bg-gray-600 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>

                {modalMode !== "view" && (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded
                      ${isSubmitting
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : modalMode === "create"
                        ? "Create User"
                        : "Save Changes"}
                  </button>

                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
