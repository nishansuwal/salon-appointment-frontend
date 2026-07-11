import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiToggleRight,
  FiToggleLeft,
} from "react-icons/fi";
import MainCategoryForm from "../../components/forms/MainCategoryForm";
import SubCategoryForm from "../../components/forms/SubCategoryForm";
import LargeModal from "../../components/common/LargeModal";
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
  showDeleteAlert,
  showToast,
} from "../../utils/alertUtils";

export default function AdminCategory() {
  const [activeTab, setActiveTab] = useState("main");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for categories with proper management
  const [mainCategories, setMainCategories] = useState([
    {
      id: 1,
      name: "Hair",
      slug: "hair",
      status: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Facial",
      slug: "facial",
      status: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 3,
      name: "Massage",
      slug: "massage",
      status: false,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: 4,
      name: "Makeup",
      slug: "makeup",
      status: true,
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
    },
  ]);

  const [subCategories, setSubCategories] = useState([
    {
      id: 1,
      mainCategoryId: 1,
      category: "Hair",
      name: "Hair Cut",
      slug: "hair-cut",
      status: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      mainCategoryId: 1,
      category: "Hair",
      name: "Hair Coloring",
      slug: "hair-coloring",
      status: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 3,
      mainCategoryId: 1,
      category: "Hair",
      name: "Hair Spa",
      slug: "hair-spa",
      status: true,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: 4,
      mainCategoryId: 2,
      category: "Facial",
      name: "Gold Facial",
      slug: "gold-facial",
      status: false,
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: 5,
      mainCategoryId: 3,
      category: "Massage",
      name: "Body Massage",
      slug: "body-massage",
      status: true,
      createdAt: "2024-01-17",
      updatedAt: "2024-01-17",
    },
  ]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle Add
  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  // Handle Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // Handle Delete with confirmation
  const handleDelete = (item, type) => {
    const itemType = type === "main" ? "Main Category" : "Subcategory";

    showDeleteAlert(
      `Delete ${itemType}?`,
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      () => {
        try {
          if (type === "main") {
            // Check if main category has subcategories
            const hasSubCategories = subCategories.some(
              (sub) => sub.mainCategoryId === item.id,
            );
            if (hasSubCategories) {
              showErrorAlert(
                "Cannot Delete",
                `This category has subcategories. Please delete all subcategories first.`,
              );
              return;
            }

            setMainCategories((prev) =>
              prev.filter((cat) => cat.id !== item.id),
            );
            showSuccessAlert(
              "Deleted!",
              `${itemType} "${item.name}" has been deleted.`,
            );
          } else {
            setSubCategories((prev) =>
              prev.filter((sub) => sub.id !== item.id),
            );
            showSuccessAlert(
              "Deleted!",
              `${itemType} "${item.name}" has been deleted.`,
            );
          }
        } catch (error) {
          showErrorAlert(
            "Error",
            "Failed to delete category. Please try again.",
          );
        }
      },
    );
  };

  // Filter data based on search and status
  const getFilteredData = (data) => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      const isActive = filterStatus === "active";
      filtered = filtered.filter((item) => item.status === isActive);
    }

    return filtered;
  };

  const filteredMainCategories = getFilteredData(mainCategories);
  const filteredSubCategories = getFilteredData(subCategories);

  // Get status badge class
  const getStatusBadge = (status) => {
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
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

      {/* Tabs & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab("main")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "main"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            Main Category
          </button>

          <button
            onClick={() => setActiveTab("sub")}
            className={`border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === "sub"
                ? "border-rose-600 text-rose-600"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            Subcategory
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-stone-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm outline-none focus:border-rose-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        {activeTab === "main" ? (
          <table className="min-w-full">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  S.N.
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Slug
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMainCategories.length > 0 ? (
                filteredMainCategories.map((category, index) => {
                  return (
                    <tr
                      key={category.id}
                      className="border-t border-stone-200 hover:bg-stone-50"
                    >
                      <td className="px-6 py-5">{index + 1}</td>
                      <td className="px-6 py-5 font-semibold text-stone-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-5 text-stone-500">
                        {category.slug}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(category.status)}`}
                        >
                          {category.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(category, "main")}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-stone-500"
                  >
                    No main categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  S.N.
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Main Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Subcategory
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Slug
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubCategories.length > 0 ? (
                filteredSubCategories.map((subcategory, index) => (
                  <tr
                    key={subcategory.id}
                    className="border-t border-stone-200 hover:bg-stone-50"
                  >
                    <td className="px-6 py-5">{index + 1}</td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        {subcategory.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-semibold text-stone-900">
                      {subcategory.name}
                    </td>
                    <td className="px-6 py-5 text-stone-500">
                      {subcategory.slug}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(subcategory.status)}`}
                      >
                        {subcategory.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(subcategory)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(subcategory, "sub")}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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
                    colSpan="6"
                    className="px-6 py-10 text-center text-stone-500"
                  >
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

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
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
      >
        {activeTab === "main" ? (
          <MainCategoryForm editingItem={editingItem} />
        ) : (
          <SubCategoryForm editingItem={editingItem} />
        )}
      </LargeModal>
    </section>
  );
}
