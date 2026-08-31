import { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../../components/common/Modal";
import GalleryForm from "../../components/forms/GalleryForm";

import { getStatusColor } from "../../utils/getStatusColor";

import {
  showSuccessAlert,
  showErrorAlert,
  showDeleteAlert,
} from "../../utils/alertUtils";
const apiUrl = import.meta.env.VITE_API_URL_PUBLIC;

import {
  fetchRecords as fetchImage,
  addRecord as addImage,
  updateRecord as updateImage,
  deleteRecord as deleteImage,
} from "../../store/apps/public/images";

export default function AdminGallery() {
  const dispatch = useDispatch();

  // ==========================
  // State
  // ==========================
  const [searchValue, setSearchValue] = useState("");
  const [isActive, setIsActive] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ==========================
  // Redux
  // ==========================
  const {
    data: galleryImages = [],
    pagination = null,
    loading = false,
  } = useSelector((state) => state.images);

  // ==========================
  // Fetch Gallery
  // ==========================
  useEffect(() => {
    const params = {
      page,
      pageSize,
      search: searchValue || undefined,
      isActive: isActive || undefined,
    };

    dispatch(fetchImage(params));
  }, [dispatch, page, pageSize, searchValue, isActive]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setPage(1);
  };

  const handleStatus = (e) => {
    setIsActive(e.target.value);
    setPage(1);
  };

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleAdd = () => {
    setSelectedImage(null);
    setOpen(true);
  };

  // ==========================
  // Open Edit Modal
  // ==========================
  const handleEdit = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  // ==========================
  // Close Modal
  // ==========================
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedImage) {
        await dispatch(
          updateImage({
            id: selectedImage.id,
            data: formData,
          }),
        ).unwrap();

        showSuccessAlert("Updated!", "Image has been updated successfully.");
      } else {
        await dispatch(addImage(formData)).unwrap();

        showSuccessAlert("Created!", "Image has been created successfully.");
      }

      handleCloseModal();

      // Refresh current page
      dispatch(fetchImage());
    } catch (error) {
      console.error("Image save error:", error);

      showErrorAlert(
        "Something went wrong!",
        error?.message || "Unable to save image.",
      );
    }
  };

  const handleDelete = async (image) => {
    const confirmed = await showDeleteAlert(
      "Delete Image?",
      `Are you sure you want to delete "${image.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteImage(image.id)).unwrap();

      showSuccessAlert("Deleted!", "Image has been deleted successfully.");

      if (galleryImages.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        dispatch(fetchImage());
      }
    } catch (error) {
      console.error("Delete image error:", error);

      showErrorAlert(
        "Delete Failed!",
        error?.message || "Unable to delete image.",
      );
    }
  };

  return (
    <section className="space-y-6">
      <Modal
        open={open}
        title={selectedImage ? "Edit Image" : "Add Image"}
        onClose={handleCloseModal}
      >
        <GalleryForm
          selectedImage={selectedImage}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* ==========================
          Header
      ========================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Salon Gallery
          </h1>

          <p className="mt-2 text-stone-500">
            Manage gallery images displayed on your website.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <FiPlus />
          Upload Image
        </button>
      </div>

      {/* ==========================
          Search & Filter
      ========================== */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search image..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={isActive}
            onChange={handleStatus}
            className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
          >
            <option value="">All Status</option>

            <option value="true">Active</option>

            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* ==========================
          Gallery
      ========================== */}
      {loading ? (
        <div className="rounded-xl border border-stone-200 bg-white py-20 text-center text-stone-500">
          Loading gallery...
        </div>
      ) : galleryImages.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white py-20 text-center text-stone-500">
          No gallery images found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={`${apiUrl}/storage/${image.image}`}
                  alt={image.title || "Gallery image"}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(image)}
                    className="rounded-full bg-white p-3 text-stone-700 hover:bg-blue-600 hover:text-white"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    onClick={() => handleDelete(image)}
                    className="rounded-full bg-white p-3 text-stone-700 hover:bg-red-600 hover:text-white"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold `}
                  >
                    {image.is_active}
                  </span>
                </div>

                <h3 className="line-clamp-1 text-lg font-bold text-stone-900">
                  {image.title}
                </h3>

                <p className="text-sm text-stone-500">
                  Uploaded: {image.uploadedAt ?? image.created_at ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================
          Pagination
      ========================== */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Result Info */}
          <p className="text-sm text-stone-500">
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
              {pagination.total ?? 0}
            </span>
          </p>

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

          {/* Pagination Buttons */}
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
    </section>
  );
}
