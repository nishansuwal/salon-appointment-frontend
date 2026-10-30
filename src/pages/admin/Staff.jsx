import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMail,
  FiClock,
  FiBriefcase,
  FiUser,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import LargeModal from "../../components/common/LargeModal";
import StaffForm from "../../components/forms/StaffForm";
import { useDispatch, useSelector } from "react-redux";

import {
  showSuccessAlert,
  showErrorAlert,
  showDeleteAlert,
} from "../../utils/alertUtils";
const apiUrl = import.meta.env.VITE_API_URL_PUBLIC;

import {
  fetchRecords as fetchStaff,
  addRecord as addStaff,
  updateRecord as updateStaff,
  deleteRecord as deleteStaff,
  fetchRecordById as fetchStaffById,
} from "../../store/apps/public/staffs";

export default function Staff() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isActive, setIsActive] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const params = {
      page,
      pageSize,
      search: searchValue || undefined,
      isActive: isActive || undefined,
    };

    dispatch(fetchStaff(params));
  }, [dispatch, page, pageSize, searchValue, isActive]);

  const {
    data: staffsDetails = [],
    pagination = null,
    loading = false,
  } = useSelector((state) => state.staffs);

  const staffs = staffsDetails.data;

  const handleAdd = () => {
    setSelectedStaff(null);
    setOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStaff(null);
    setOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedStaff) {
        await dispatch(
          updateStaff({
            id: selectedStaff.id,
            data: formData,
          }),
        ).unwrap();

        showSuccessAlert("Updated!", "Image has been updated successfully.");
      } else {
        await dispatch(addStaff(formData)).unwrap();

        showSuccessAlert("Created!", "Image has been created successfully.");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Image save error:", error);

      showErrorAlert(
        "Something went wrong!",
        error?.message || "Unable to save image.",
      );
    }
  };

  const handleDelete = async (staff) => {
    const confirmed = await showDeleteAlert(
      "Delete Staff?",
      `Are you sure you want to delete`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteStaff(staff.id)).unwrap();

      showSuccessAlert("Deleted!", "Staff has been deleted successfully.");
    } catch (error) {
      console.error("Delete image error:", error);

      showErrorAlert(
        "Delete Failed!",
        error?.message || "Unable to delete image.",
      );
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      const DEFAULT_AVATAR = "/user.jpg";
      return DEFAULT_AVATAR;
    }

    return `${apiUrl}/storage/${image}`;
  };

  return (
    <section className="space-y-8">
      <LargeModal
        open={open}
        title={selectedStaff ? "Edit Staff" : "Add Staff"}
        onClose={() => setOpen(false)}
      >
        <StaffForm
          staff={selectedStaff}
          onSubmit={handleSubmit}
          onClose={() => setOpen(false)}
        />
      </LargeModal>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600">Staff Management</p>

          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Staff Members
          </h1>

          <p className="mt-2 text-stone-500">
            Manage salon staff, schedules and assigned services.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <FiPlus />
          Add Staff
        </button>
      </div>

      {/* Filters */}

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
            <option>All Status</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Cards */}

      <div className="grid gap-6 lg:grid-cols-2">
        {staffs?.map((staff) => (
          <div
            key={staff.id}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            {/* Top */}

            <div className="flex items-start gap-4">
              <img
                src={getImageUrl(staff.user?.avatar)}
                alt={staff.user?.name}
                className="h-20 w-20 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {staff?.user?.name}
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                      {staff.position}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      staff.status === true
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {staff.is_active}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}

            <div className="mt-6 space-y-3 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <FiPhone />
                {staff.user?.phone}
              </div>

              <div className="flex items-center gap-2">
                <FiMail />
                {staff.user?.email}
              </div>

              <div className="flex items-center gap-2">
                <FiBriefcase />
                {staff.experience} Years Experience
              </div>

              <div className="flex flex-wrap gap-2">
                {staff.categories.map((categorie) => (
                  <span
                    key={categorie}
                    className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    {categorie?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}

            <div className="mt-6 flex justify-end gap-3 border-t border-stone-200 pt-5">
              <button
                type="button"
                onClick={() => handleEdit(staff)}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                <FiEdit2 />
                Edit
              </button>

              <button
                onClick={() => handleDelete(staff)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
