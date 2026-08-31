import React, { useEffect, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

function GalleryForm({
  selectedImage,
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(selectedImage);

  const [formData, setFormData] = useState({
    title: "",
    is_active: true,
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // Load Edit Data
  // ==========================
  useEffect(() => {
    if (selectedImage) {
      setFormData({
        title: selectedImage.title ?? "",
        is_active:
          selectedImage.is_active === true ||
          selectedImage.is_active === 1 ||
          selectedImage.is_active === "1",
        image: null,
      });

      setPreview(selectedImage.image ?? null);
    } else {
      setFormData({
        title: "",
        is_active: true,
        image: null,
      });

      setPreview(null);
    }
  }, [selectedImage]);

  // ==========================
  // Input Change
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Status
  // ==========================
  const handleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  // ==========================
  // Image Change
  // ==========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // Create preview
    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // ==========================
  // Remove Image
  // ==========================
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setPreview(null);
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Image is required when creating
    if (!isEdit && !formData.image) {
      alert("Please select an image.");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "is_active",
        formData.is_active ? "1" : "0"
      );

      // Only append image if user selected
      // a new image.
      if (formData.image instanceof File) {
        data.append(
          "image",
          formData.image
        );
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Gallery form error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6"
    >
      {/* ==========================
          Description
      ========================== */}
      <div>
        <p className="text-sm text-stone-500">
          {isEdit
            ? "Update gallery image information."
            : "Upload a new image to your salon gallery."}
        </p>
      </div>

      {/* ==========================
          Upload
      ========================== */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Gallery Image
          {!isEdit && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>

        <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 transition hover:border-rose-500">
          <FiUploadCloud
            size={55}
            className="text-stone-400"
          />

          <p className="mt-4 font-semibold text-stone-700">
            Click to upload
          </p>

          <p className="text-sm text-stone-500">
            PNG, JPG or WEBP
          </p>

          <input
            type="file"
            name="image"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleImageChange}
          />
        </label>

        {isEdit && (
          <p className="mt-2 text-xs text-stone-500">
            Leave empty to keep the existing image.
          </p>
        )}
      </div>

      {/* ==========================
          Preview
      ========================== */}
      {preview && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-stone-700">
            Preview
          </label>

          <div className="relative overflow-hidden rounded-xl border">
            <img
              src={preview}
              alt="Gallery preview"
              className="h-64 w-full object-cover"
            />

            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* ==========================
          Title
      ========================== */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Image Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Modern Hair Styling"
          required
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
        />
      </div>

      {/* ==========================
          Status
      ========================== */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Status
        </label>

        <button
          type="button"
          onClick={handleStatus}
          className={`relative flex h-8 w-16 items-center rounded-full transition ${
            formData.is_active
              ? "bg-rose-600"
              : "bg-stone-300"
          }`}
        >
          <span
            className={`h-7 w-7 rounded-full bg-white shadow transition ${
              formData.is_active
                ? "translate-x-8"
                : "translate-x-1"
            }`}
          />
        </button>

        <p className="mt-2 text-sm text-stone-500">
          {formData.is_active
            ? "Active"
            : "Inactive"}
        </p>
      </div>

      {/* ==========================
          Footer
      ========================== */}
      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Image"
              : "Upload Image"}
        </button>
      </div>
    </form>
  );
}

export default GalleryForm;
