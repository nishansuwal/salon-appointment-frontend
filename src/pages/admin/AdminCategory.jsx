import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import MainCategoryForm from "../../components/forms/MainCategoryForm";
import SubCategoryForm from "../../components/forms/SubCategoryForm";
import LargeModal from "../../components/common/LargeModal";

import {
  showSuccessAlert,
  showErrorAlert,
  showDeleteAlert,
} from "../../utils/alertUtils";

import {
  fetchMainCategories,
  fetchChildCategories,
  addRecord as addCategory,
  updateRecord as updateCategory,
  deleteRecord as deleteCategory,
} from "../../store/apps/public/categories";

export default function AdminCategory() {
  const dispatch = useDispatch();

  // ==========================
  // Redux
  // ==========================
  const {
    mainCategories = [],
    childCategories = [],
    mainPagination,
    childPagination,
    loading = false,
  } = useSelector((state) => state.categories);

  // ==========================
  // UI
  // ==========================
  const [activeTab, setActiveTab] = useState("main");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ==========================
  // Fetch
  // ==========================
  useEffect(() => {
    const params = {
      page,
      pageSize,
      search: searchValue || undefined,
      status: status || undefined,
    };

    if (activeTab === "main") {
      dispatch(fetchMainCategories(params));
    } else {
      dispatch(fetchChildCategories(params));
    }
  }, [dispatch, activeTab, page, pageSize, searchValue, status]);

  // ==========================
  // Search
  // ==========================
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setPage(1);
  };

  // ==========================
  // Status
  // ==========================
  const handleStatus = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  // ==========================
  // Page Size
  // ==========================
  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // ==========================
  // Tab
  // ==========================
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Reset pagination/filter when changing tab
    setPage(1);
    setSearchValue("");
    setStatus("");
  };

  // ==========================
  // Add
  // ==========================
  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  // ==========================
  // Edit
  // ==========================
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // ==========================
  // Close
  // ==========================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await dispatch(
          updateCategory({
            id: editingItem.id,
            data: formData,
          }),
        ).unwrap();

        showSuccessAlert("Updated!", "Category has been updated successfully.");
      } else {
        await dispatch(addCategory(formData)).unwrap();

        showSuccessAlert("Created!", "Category has been created successfully.");
      }

      handleCloseModal();
    } catch (error) {
      console.error("FAQ save error:", error);

      showErrorAlert(
        "Something went wrong!",
        error?.message || "Unable to save Category.",
      );
    }
  };

  const handleDelete = (item, type) => {
    const itemType = type === "main" ? "Main Category" : "Subcategory";

    showDeleteAlert(
      `Delete ${itemType}?`,
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      async () => {
        try {
          await dispatch(deleteCategory(item.id)).unwrap();

          showSuccessAlert(
            "Deleted!",
            `${itemType} "${item.name}" has been deleted.`,
          );

          // If current page becomes empty,
          // go to previous page.
          const pagination =
            activeTab === "main" ? mainPagination : childPagination;

          if (
            pagination &&
            pagination.current_page > 1 &&
            pagination.data?.length === 1
          ) {
            setPage((prev) => prev - 1);
          } else {
            const params = {
              page,
              pageSize,
              search: searchValue || undefined,
              status: status || undefined,
            };

            if (activeTab === "main") {
              dispatch(fetchMainCategories(params));
            } else {
              dispatch(fetchChildCategories(params));
            }
          }
        } catch (error) {
          showErrorAlert(
            "Error",
            error?.message || `Failed to delete ${itemType}.`,
          );
        }
      },
    );
  };

  // ==========================
  // Current Data
  // ==========================
  const data = activeTab === "main" ? mainCategories : childCategories;

  // ==========================
  // Current Pagination
  // ==========================
  const pagination = activeTab === "main" ? mainPagination : childPagination;

  // ==========================
  // Status
  // ==========================
  const isActive = (item) => {
    return (
      item.status === true ||
      item.status === 1 ||
      item.status === "1" ||
      item.is_active === true ||
      item.is_active === 1 ||
      item.is_active === "1"
    );
  };

  const getStatusBadge = (item) => {
    return isActive(item)
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-600">
            Categories
          </p>

          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Category Management
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Manage your salon categories and subcategories.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <FiPlus />

          {activeTab === "main" ? "Add Main Category" : "Add Subcategory"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => handleTabChange("main")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold ${
              activeTab === "main"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-stone-500"
            }`}
          >
            Main Category
          </button>

          <button
            onClick={() => handleTabChange("sub")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold ${
              activeTab === "sub"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-stone-500"
            }`}
          >
            Subcategory
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2
              -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
              className="rounded-lg border border-stone-300
              py-2 pl-9 pr-4 text-sm outline-none
              focus:border-rose-500"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={handleStatus}
            className="rounded-lg border border-stone-300
            px-4 py-2 text-sm outline-none
            focus:border-rose-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-16 text-center text-stone-500">
            Loading...
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold">S.N.</th>

                {activeTab === "sub" && (
                  <th className="px-6 py-4 text-left text-sm font-bold">
                    Main Category
                  </th>
                )}

                <th className="px-6 py-4 text-left text-sm font-bold">Name</th>

                <th className="px-6 py-4 text-left text-sm font-bold">Slug</th>

                <th className="px-6 py-4 text-center text-sm font-bold">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-stone-200 hover:bg-stone-50"
                  >
                    <td className="px-6 py-5">
                      {((pagination?.current_page ?? page) - 1) *
                        (pagination?.per_page ?? pageSize) +
                        index +
                        1}
                    </td>

                    {activeTab === "sub" && (
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                          {item.parent?.name ?? item.main_category?.name ?? "—"}
                        </span>
                      </td>
                    )}

                    <td className="px-6 py-5 font-semibold text-stone-900">
                      {item.name}
                    </td>

                    <td className="px-6 py-5 text-stone-500">{item.slug}</td>

                    <td className="px-6 py-5 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(item)}`}
                      >
                        {isActive(item) ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <FiEdit2 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item, activeTab)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === "sub" ? 6 : 5}
                    className="px-6 py-10 text-center text-stone-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Info */}
          <div className="text-sm text-stone-500">
            Showing{" "}
            <span className="font-semibold text-stone-700">
              {pagination.from ?? 0}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-stone-700">
              {pagination.to ?? 0}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-stone-700">
              {pagination.total}
            </span>{" "}
            results
          </div>

          {/* Page Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">Per page:</span>

            <select
              value={pageSize}
              onChange={handlePageSize}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Pages */}
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from(
              {
                length: pagination.last_page ?? 1,
              },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  page === pageNumber
                    ? "bg-rose-600 text-white"
                    : "border text-stone-700 hover:bg-stone-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              disabled={page >= (pagination.last_page ?? 1)}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <LargeModal
        open={showModal}
        title={
          editingItem
            ? activeTab === "main"
              ? "Edit Main Category"
              : "Edit Subcategory"
            : activeTab === "main"
              ? "Add Main Category"
              : "Add Subcategory"
        }
        onClose={handleCloseModal}
      >
        {activeTab === "main" ? (
          <MainCategoryForm
            editingItem={editingItem}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        ) : (
          <SubCategoryForm
            editingItem={editingItem}
            mainCategories={mainCategories}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        )}
      </LargeModal>
    </section>
  );
}
