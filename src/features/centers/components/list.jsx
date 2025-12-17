import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Navbar from "../../dashboard/Navbar";
import {MySwal , formatTitle } from "../../../utils/alert";
import { fetchAllCenters, fetchCreateCenter, fetchDeleteCenter, fetchUpdateCenter, setCurrentPage, setUpdateStatus } from "../centerSlice";


export default function List() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const {
    isCenterCreate , centers,currentPage,totalPages,loading
  } = useSelector((state) => state.center);


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
      center_name: "",
      center_address: ""
    },
  });

  /* ================= Fetch ================= */
  useEffect(() => {
    dispatch(fetchAllCenters({ token, page: currentPage }));
    // dispatch(fetchAllRoles(token));
  }, [dispatch, token, currentPage]);

  /* ================= Toast ================= */
  useEffect(() => {
          if (isCenterCreate === "create" || isCenterCreate === "update" || isCenterCreate === "delete" || isCenterCreate === "error") {
          let msg = "";
          let alertIcon = "";
          switch (isCenterCreate) {
            case "create":
              msg = "Center Created Successfully!";
              alertIcon = "success";
              break;
            case "update":
              msg = "Center Updated Successfully!";
              alertIcon = "success";
              break;
             case "delete":
              msg = "Center Deleted Successfully!";
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

          if(isCenterCreate !== "error") {
          dispatch(fetchAllCenters({ token, page: currentPage }));
          dispatch(setUpdateStatus());
          }
        }

      closeModal();
      reset({ center_name: "", center_address: "" });
  }, [isCenterCreate, reset]);

 

  /* ================= Modal Handlers ================= */
  const openCreateModal = () => {
    setModalMode("create");
    reset({ center_name: "", center_address: "" });
    setIsModalOpen(true);
  };

  const openViewModal = (center) => {
    setModalMode("view");
    reset({
      center_name: formatTitle(center.center_name),
      center_address: center.center_address,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (center) => {
    setModalMode("edit");
    reset({
      center_name: formatTitle(center.center_name),
      center_address: center.center_address,
      id:center.id,
  
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ================= Submit ================= */
  const onSubmit = (formData) => {
    
    if (modalMode === "create") {
      
      dispatch(fetchCreateCenter({ token, centerData: formData }));
    }
     if (modalMode === "edit") {
      dispatch(fetchUpdateCenter({ token, centerData: formData }));
    }
  };

  /* ================= Delete ================= */
  const handleDelete = (Id) => {
    MySwal.fire({
      title: "Delete Center?",
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
        dispatch(fetchDeleteCenter({token , Id}));
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
          <h1 className="text-2xl font-bold">Centers</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            + Add Center
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-white/10 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Total Members</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              { centers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-400"
                      >
                        No centers found
                      </td>
                    </tr>
                  ) : centers.map((center, index) => (
                <tr key={center.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-4 py-3 text-center">{ formatTitle(center.center_name)}</td>
                  <td className="px-4 py-3 text-center">{center.center_address}</td>
                   <td className="px-4 py-3 text-center">{center.members_count}</td>
                 
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openViewModal(center)}
                        className="px-3 py-1 bg-blue-600 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditModal(center)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(center.id)}
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
                {modalMode} Center
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
                {...register("center_name", {
                  required: "Name is required",
                })}
                disabled={modalMode === "view"}
                placeholder="Enter name"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                          disabled:opacity-60"
              />

              {errors.center_name && (
                <span className="text-red-500 text-sm">{errors.center_name.message}</span>
              )}

              <textarea
                {...register("center_address", {
                  required: "Address is required",
                })}
                disabled={modalMode === "view"}
                placeholder="Enter address"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
                          disabled:opacity-60"
              />

              {errors.center_address && (
                <span className="text-red-500 text-sm">{errors.center_address.message}</span>
              )}

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
                    className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
                  >
                    {modalMode === "create"
                      ? "Create Center"
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
