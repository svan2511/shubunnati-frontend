import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import Navbar from "../../dashboard/Navbar";
import { MySwal, formatTitle } from "../../../utils/alert";
import {
  fetchAllMembers,
  fetchCreateMember,
  fetchDeleteMember,
  fetchUpdateMember,
  setCurrentPage,
  setUpdateStatus,
} from "../memberSlice";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";
import { fetchAllCenters } from "../../centers/centerSlice";
import { calculateInstallment } from "../../../utils/calculateInstallment";

export default function List() {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("auth_token");

  const {
    isMemberCreate,
    members,
    currentPage,
    totalPages,
    loading
  } = useSelector((state) => state.member);

  const centers = useSelector((state) => state.center.centers);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // create | view | edit
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const { register, handleSubmit, reset, setValue, control,watch, formState: { errors } } = useForm({
    defaultValues: {
      mem_name: "",
      mem_phone: "",
      center_id: "",
      disb_amount: "",
      mem_tenor: "",
      monthly_inst: "",
      disb_date: "",
      mem_img: "",
      img_public_id: "",
    }
  });

  const disbAmount = watch("disb_amount");
  const tenor = watch("mem_tenor");

  useEffect(() => {
    dispatch(fetchAllMembers({ token, page: currentPage }));
    dispatch(fetchAllCenters({ token, page: "ALL" }));
  }, [dispatch, token, currentPage]);

  useEffect(() => {
  if (disbAmount && tenor) {
     const installment = calculateInstallment(disbAmount, tenor);
    setValue("monthly_inst", installment);
  } else {
    setValue("monthly_inst", "");
  }
}, [disbAmount, tenor, setValue]);


  useEffect(() => {
    if (
      isMemberCreate === "create" ||
      isMemberCreate === "update" ||
      isMemberCreate === "delete" ||
      isMemberCreate === "error"
    ) {
      let msg = "";
      let alertIcon = "";
      switch (isMemberCreate) {
        case "create":
          msg = "Member Created Successfully!";
          alertIcon = "success";
          break;
        case "update":
          msg = "Member Updated Successfully!";
          alertIcon = "success";
          break;
        case "delete":
          msg = "Member Deleted Successfully!";
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

      if (isMemberCreate !== "error") {
        dispatch(fetchAllMembers({ token, page: currentPage }));
        dispatch(setUpdateStatus());
      }
    }

    closeModal();
    reset({
      mem_name: "",
      mem_phone: "",
      center_id: "",
      disb_amount: "",
      mem_tenor: "",
      monthly_inst: "",
      disb_date: "",
      mem_img: "",
      img_public_id: "",
    });
    setImagePreview("");
    setUploadError("");
    setUploading(false);
  }, [isMemberCreate, reset]);

  const openCreateModal = () => {
    setModalMode("create");
    reset({
      mem_name: "",
      mem_phone: "",
      center_id: "",
      disb_amount: "",
      mem_tenor: "",
      monthly_inst: "",
      disb_date: "",
      mem_img: "",
      img_public_id: "",
    });
    setImagePreview("");
    setUploadError("");
    setUploading(false);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setModalMode("edit");
    reset({
      mem_name: member.mem_name,
      mem_phone: member.mem_phone,
      center_id: member.center_id,
      disb_amount: member.disb_amount,
      mem_tenor: member.mem_tenor,
      monthly_inst: member.monthly_inst,
      disb_date: member.disb_date,
      mem_img: member.mem_img,
      img_public_id: member.img_public_id,
      id:member.id
    });
    setImagePreview(member.mem_img);
    setUploadError("");
    setUploading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = (formData) => {
    if (modalMode === "create") {
      
      dispatch(fetchCreateMember({ token, mData: formData }));
    } else if (modalMode === "edit") {
      console.log(formData);
      dispatch(fetchUpdateMember({ token, mData: formData }));
    }
  };

  const handleDelete = (Id) => {
    MySwal.fire({
      title: "Delete Member?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mx-2",
        cancelButton: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mx-2",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(fetchDeleteMember({ token, Id }));
      }
    });
  };

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
          <h1 className="text-2xl font-bold">Members</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            + Add Member
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-white/10 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Tenor</th>
                <th className="px-4 py-3">Dis Amount</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No members found
                  </td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr key={member.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-center">{(currentPage - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-center">{formatTitle(member.mem_name)}</td>
                    <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 overflow-hidden rounded">
                        <img
                          src={member.mem_img}
                          alt={member.mem_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </td>

                    <td className="px-4 py-3 text-center">{member.mem_tenor}</td>
                    <td className="px-4 py-3 text-center">{member.disb_amount}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="px-3 py-1 bg-yellow-500 text-black rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="px-3 py-1 bg-red-600 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              className={`px-3 py-2 rounded ${currentPage === 1 ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Prev
            </button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => dispatch(setCurrentPage(p))}
                className={`px-3 py-2 rounded ${p === currentPage ? "bg-indigo-600" : "bg-gray-800 hover:bg-gray-700"}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              className={`px-3 py-2 rounded ${currentPage === totalPages ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:px-0">
          <div className="absolute inset-0 bg-black/70" onClick={closeModal} />
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
              <h2 className="text-2xl font-semibold capitalize">{modalMode} Member</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fields */}
                {[
                    { name: "mem_name", label: "Member Name", type: "text" },
                    { name: "mem_phone", label: "Phone Number", type: "text" },
                    { name: "disb_amount", label: "Disbursement Amount", type: "number" },
                    {
                      name: "mem_tenor",
                      label: "Tenor (Months)",
                      type: "select",
                      options: [15, 18, 22, 24],
                    },
                    { name: "monthly_inst", label: "Monthly Installment", type: "number" },
                    { name: "disb_date", label: "Disbursement Date", type: "date" },
                  ].map((field) => (
                    <div className="flex flex-col" key={field.name}>
                      <label className="text-sm font-medium mb-1">{field.label}</label>

                      {field.type === "select" ? (
                        <select
                          {...register(field.name, { required: `${field.label} is required` })}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Tenor</option>
                          {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt} Months
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          {...register(field.name, { required: `${field.label} is required` })}
                          type={field.type}
                          disabled={field.name === "monthly_inst"}
                          placeholder={field.label}
                          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      )}

                      {errors[field.name] && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors[field.name].message}
                        </span>
                      )}
                    </div>
                  ))}


                {/* Center Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Select Center</label>
                  <select
                    {...register("center_id", { required: "Center is required" })}
                    disabled={modalMode === "view"}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a center</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>{center.center_name}</option>
                    ))}
                  </select>
                  {errors.center_id && (
                    <span className="text-red-500 text-sm mt-1">{errors.center_id.message}</span>
                  )}
                </div>

                {/* Image Upload */}
                {modalMode !== "view" && (
                  <>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Upload Image</label>
                      <div className="relative w-full">
                        <button
                          type="button"
                          className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-left"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              setUploading(true);
                              setUploadError("");
                              setImagePreview(""); // hide preview initially

                              try {
                                const result = await uploadToCloudinary(file);
                                setValue("mem_img", result.secure_url);
                                setValue("img_public_id", result.public_id);
                                setImagePreview(result.secure_url); // show preview
                              } catch (err) {
                                console.error(err);
                                setUploadError("Image upload failed. Try again.");
                                setImagePreview("error"); // show preview with error
                              } finally {
                                setUploading(false);
                              }
                            }}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {uploading ? "Uploading..." : "Choose Image"}
                        </button>
                        {uploadError && (
                          <span className="text-red-500 text-sm mt-1">{uploadError}</span>
                        )}
                      </div>
                    </div>

                   {imagePreview && (
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Preview</label>

                      <div className="w-full h-40 border border-gray-700 rounded-lg bg-gray-800 flex items-center justify-center p-2">
                        {imagePreview === "error" ? (
                          <span className="text-red-500 text-sm text-center">
                            Image upload failed
                          </span>
                        ) : (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  </>
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
                    disabled={uploading || !imagePreview}
                    className={`px-6 py-2 rounded ${
                      uploading || !imagePreview ? "bg-gray-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {modalMode === "create" ? "Create Member" : "Save Changes"}
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
