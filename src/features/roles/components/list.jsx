import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Navbar from "../../dashboard/Navbar";
import {MySwal , formatTitle } from "../../../utils/alert";
import { fetchAllRoles, fetchCreateRole, fetchDeleteRole, fetchUpdateRole, setCurrentPage, setUpdateStatus } from "../roleSlice";
import { fetchGroupedPermissions } from "../../permissions/permissionSlice";



const moduleOptions = [
  "users",
  "roles",
  "permissions",
  "members","centers"
];



export default function List() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const {
    isRoleCreate,roles,currentPage,totalPages,loading , isSubmitting
  } = useSelector((state) => state.role);

  const groupedPermissions = useSelector((state) => state.permission.groupedPermissions);


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
      desc:"",
      permissions: []
    },
  });

  /* ================= Fetch ================= */
  useEffect(() => {
    dispatch(fetchAllRoles({ page: currentPage }));
    dispatch(fetchGroupedPermissions());
  }, [dispatch, currentPage]);

  /* ================= Toast ================= */
  useEffect(() => {
          if (isRoleCreate === "create" || isRoleCreate === "update" || isRoleCreate === "delete" || isRoleCreate === "error") {
          let msg = "";
          let alertIcon = "";
          switch (isRoleCreate) {
            case "create":
              msg = "Role Created Successfully!";
              alertIcon = "success";
              break;
            case "update":
              msg = "Role Updated Successfully!";
              alertIcon = "success";
              break;
             case "delete":
              msg = "Role Deleted Successfully!";
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

          if(isRoleCreate !== "error") {
          dispatch(fetchAllRoles({ page: currentPage }));
          dispatch(setUpdateStatus());
          closeModal();
          }
        }

      
     reset({
      name: "",
      desc: "",
      permissions: [],
    });
  }, [isRoleCreate, reset]);

 

  /* ================= Modal Handlers ================= */
  const openCreateModal = () => {
    setModalMode("create");
    reset({ name: "", desc: "" , permissions: [] });
    setIsModalOpen(true);
  };

  const openViewModal = (role) => {
    setModalMode("view");
    reset({
      name: formatTitle(role.name),
      desc: role.desc,
      permissions: role.permissions?.map(p => p.id) || []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setModalMode("edit");
    reset({
       name: formatTitle(role.name),
      desc: role.desc,
      permissions: role.permissions?.map(p => p.id) || [],
      id: role.id
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ================= Submit ================= */
  const onSubmit = (formData) => {
    
    if (modalMode === "create") {
   
      dispatch(fetchCreateRole({  roleData: formData }));
    }
     if (modalMode === "edit") {
      dispatch(fetchUpdateRole({  roleData: formData }));
    }
  };

  /* ================= Delete ================= */
  const handleDelete = (Id) => {
    MySwal.fire({
      title: "Delete Role?",
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
        dispatch(fetchDeleteRole({ Id}));
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
          <h1 className="text-2xl font-bold">Roles</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            + Add Role
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-white/10 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">description</th>
                <th className="px-4 py-3">Permissions</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              { roles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No role found
                      </td>
                    </tr>
                  ) : roles.map((role, index) => (
                <tr key={role.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-4 py-3 text-center">{ formatTitle(role.name)}</td>
                  <td className="px-4 py-3 text-center">{role.desc}</td>
                 <td className="px-4 py-3">
                  {role.permissions?.length > 0 ? (
                    <div className="flex flex-col gap-1 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 4).map((perm) => (
                          <span
                            key={perm.id}
                            className="px-2 py-0.5 text-xs rounded-full
                                      bg-indigo-600/20 text-indigo-300
                                      border border-indigo-500/30"
                          >
                            {perm.name.replace("-", " ")}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>
                          {role.permissions.length} permissions
                        </span>

                        {role.permissions.length > 4 && (
                          <button
                            onClick={() => openViewModal(role)}
                            className="text-indigo-400 hover:text-indigo-300 underline"
                          >
                            View all
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500 italic">
                      No permissions
                    </span>
                  )}
                </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openViewModal(role)}
                        className="px-3 py-1 bg-blue-600 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(role)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       {totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 gap-1">

    {/* Previous */}
    <button
      disabled={currentPage === 1}
      onClick={() => dispatch(setCurrentPage(currentPage - 1))}
      className={`px-3 py-2 rounded ${
        currentPage === 1
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-700"
      }`}
    >
      Prev
    </button>

    {/* Page Numbers */}
    {getPageNumbers().map((p) => (
      <button
        key={p}
        onClick={() => dispatch(setCurrentPage(p))}
        className={`px-3 py-2 rounded ${
          p === currentPage
            ? "bg-indigo-600"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        {p}
      </button>
    ))}

    {/* Next */}
    <button
      disabled={currentPage === totalPages}
      onClick={() => dispatch(setCurrentPage(currentPage + 1))}
      className={`px-3 py-2 rounded ${
        currentPage === totalPages
          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-700"
      }`}
    >
      Next
    </button>

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
                {modalMode} Role
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

              <textarea
                {...register("desc", {
                  required: "Description is required",
                })}
                disabled={modalMode === "view"}
                placeholder="Enter description"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                          disabled:opacity-60"
              />

              {errors.desc && (
                <span className="text-red-500 text-sm">{errors.desc.message}</span>
              )}

              {/* ================= Grouped Permissions ================= */}
              <div>
                <label className="block mb-2 font-semibold text-gray-300">
                  Assign Permissions
                </label>

                <Controller
                  name="permissions"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value?.length > 0 || "Select at least one permission",
                  }}
                  render={({ field }) => {
                    const selected = field.value ?? [];

                    return (
                      <div className="space-y-4">
                        {groupedPermissions.map((group) => (
                          <div
                            key={group.module}
                            className="border border-gray-700 rounded-lg p-4"
                          >
                            <h3 className="mb-3 text-sm font-semibold uppercase text-indigo-400">
                              {group.module}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {group.permissions.map((perm) => (
                                <label
                                  key={perm.id}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selected.includes(perm.id)}
                                    onChange={(e) => {
                                      if (modalMode === "view") return;

                                      if (e.target.checked) {
                                        field.onChange([...selected, perm.id]);
                                      } else {
                                        field.onChange(selected.filter((id) => id !== perm.id));
                                      }
                                    }}
                                    className={`accent-indigo-600 ${
                                      modalMode === "view"
                                        ? "cursor-not-allowed pointer-events-none"
                                        : ""
                                    }`}
                                  />

                                  <span className="text-gray-300">{perm.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />


                {errors.permissions && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.permissions.message}
                  </p>
                )}
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
                        ? "Create Role"
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
