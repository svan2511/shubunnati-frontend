import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Navbar from "../../dashboard/Navbar";
import {MySwal , formatTitle } from "../../../utils/alert";


import { fetchAllPermissions , fetchCreatePermission ,fetchDeletePermission,fetchUpdatePermission,setCurrentPage,setUpdateStatus } from "../permissionSlice";

const moduleOptions = [
  "dashboard",
  "users",
  "roles",
  "permissions",
  "members","centers"
];



export default function List() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const {
    isPermissionCreate,permissions,currentPage,totalPages,loading,isSubmitting
  } = useSelector((state) => state.permission);


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
      module: "",
      desc:"",
    },
  });

  /* ================= Fetch ================= */
  useEffect(() => {
    dispatch(fetchAllPermissions({  page: currentPage }));
    // dispatch(fetchAllRoles(token));
  }, [dispatch, currentPage]);

  /* ================= Toast ================= */
  useEffect(() => {
          if (isPermissionCreate === "create" || isPermissionCreate === "update" || isPermissionCreate === "delete" || isPermissionCreate === "error") {
          let msg = "";
          let alertIcon = "";
          switch (isPermissionCreate) {
            case "create":
              msg = "Permission Created Successfully!";
              alertIcon = "success";
              break;
            case "update":
              msg = "Permission Updated Successfully!";
              alertIcon = "success";
              break;
             case "delete":
              msg = "Permission Deleted Successfully!";
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

          if(isPermissionCreate !== "error") {
          dispatch(fetchAllPermissions({ page: currentPage }));
          dispatch(setUpdateStatus());
          closeModal();
          }
        }

      
      reset({ name: "", email: "", roles: [] });
  }, [isPermissionCreate, reset]);

 

  /* ================= Modal Handlers ================= */
  const openCreateModal = () => {
    setModalMode("create");
    reset({ name: "", module: "", desc: "" });
    setIsModalOpen(true);
  };

  const openViewModal = (permission) => {
    setModalMode("view");
    reset({
      name: formatTitle(permission.name),
      module: permission.module,
      desc: permission.desc,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (permission) => {
    setModalMode("edit");
    reset({
       name: formatTitle(permission.name),
      module: permission.module,
      desc: permission.desc,
      id:permission.id,
  
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ================= Submit ================= */
  const onSubmit = (formData) => {
    
    if (modalMode === "create") {
   
      dispatch(fetchCreatePermission({  pData: formData }));
    }
     if (modalMode === "edit") {
      dispatch(fetchUpdatePermission({ pData: formData }));
    }
  };

  /* ================= Delete ================= */
  const handleDelete = (Id) => {
    MySwal.fire({
      title: "Delete Permission?",
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
        dispatch(fetchDeletePermission({ Id}));
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
          <h1 className="text-2xl font-bold">Permissions</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            + Add Permission
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
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              { permissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No permissions found
                      </td>
                    </tr>
                  ) : permissions.map((permission, index) => (
                <tr key={permission.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-4 py-3 text-center">{ formatTitle(permission.name)}</td>
                  <td className="px-4 py-3 text-center">{permission.desc}</td>
                   <td className="px-4 py-3 text-center">{formatTitle(permission.module)}</td>
                 
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openViewModal(permission)}
                        className="px-3 py-1 bg-blue-600 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(permission)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(permission.id)}
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
                {modalMode} Permission
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


              {/* Module */}
              <div>
               <Controller
                name="module"
                control={control}
                rules={{ required: "Module is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    disabled={modalMode === "view"}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                              focus:outline-none focus:ring-2 focus:ring-indigo-500
                              disabled:opacity-60"
                  >
                    <option value="">Select module</option>
                    {moduleOptions.map((m) => (
                      <option key={m} value={m}>
                        {m.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
              />

              {errors.module && (
                <span className="text-red-500 text-sm">
                  {errors.module.message}
                </span>
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
                        ? "Create Permission"
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
