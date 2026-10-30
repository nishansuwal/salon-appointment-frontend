import React, { useEffect, useRef, useState } from "react";

const emptyForm = {
  category_id: "",
  name: "",
  slug: "",
  description: "",
  duration_minutes: "",
  price: "",
  discount: "0",
  status: "active",
};

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServiceForm({
  editingItem,
  subCategories = [],
  onSubmit,
  onCancel,
}) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate the form when editingItem changes.
  useEffect(() => {
    if (editingItem) {
      setForm({
        category_id: editingItem.category_id ?? "",
        name: editingItem.name ?? "",
        slug: editingItem.slug ?? "",
        description: editingItem.description ?? "",
        duration_minutes: editingItem.duration_minutes ?? "",
        price: editingItem.price ?? "",
        discount: editingItem.discount ?? "0",
        status: editingItem.status ?? "active",
      });

      setExistingImages(
        Array.isArray(editingItem.images) ? editingItem.images : []
      );
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }

    setNewImages([]);
    setRemovedImageIds([]);
    setError("");
  }, [editingItem]);

  // Release temporary preview URLs when images change or the component unmounts.
  useEffect(() => {
    const urls = newImages.map((item) => item.previewUrl);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [newImages]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "name" && !editingItem
        ? { slug: makeSlug(value) }
        : {}),
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    setNewImages((previous) => [
      ...previous,
      ...validFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        key: `${file.name}-${file.lastModified}-${Math.random()}`,
      })),
    ]);

    event.target.value = "";
  };

  const removeNewImage = (key) => {
    setNewImages((previous) => previous.filter((image) => image.key !== key));
  };

  const removeExistingImage = (image) => {
    setExistingImages((previous) =>
      previous.filter((item) => item.id !== image.id)
    );

    if (image.id != null) {
      setRemovedImageIds((previous) =>
        previous.includes(image.id) ? previous : [...previous, image.id]
      );
    }
  };

  const getImageUrl = (image) => {
    if (typeof image === "string") return image;
    if (image.url) return image.url;
    if (image.image_url) return image.image_url;
    if (image.image_path?.startsWith("http")) return image.image_path;

    // Adjust this path if your API returns a different storage path.
    if (image.image_path) {
      const baseUrl = import.meta.env.VITE_API_URL_PUBLIC || "";
      return `${baseUrl.replace(/\/$/, "")}/storage/${image.image_path.replace(/^\//, "")}`;
    }

    return "";
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.category_id) {
      setError("Please select a subcategory.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.discount) < 0) {
      setError("Price and discount cannot be negative.");
      return;
    }

    const payload = {
      ...(editingItem?.id != null ? { id: editingItem.id } : {}),
      category_id: Number(form.category_id),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      discount: Number(form.discount || 0),
      status: form.status,
      images: newImages.map((item) => item.file),
      existing_image_ids: existingImages
        .filter((image) => image.id != null)
        .map((image) => image.id),
      removed_image_ids: removedImageIds,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (submitError) {
      setError(
        submitError?.message || "Unable to save the service. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-stone-900">
              Service Information
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="service-name" className="mb-2 block text-sm font-medium text-stone-700">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="e.g. Women's Hair Cut"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="service-slug" className="mb-2 block text-sm font-medium text-stone-700">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="womens-hair-cut"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
                <p className="mt-1 text-xs text-stone-500">
                  Used in the service URL. You can edit it if needed.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="service-category" className="mb-2 block text-sm font-medium text-stone-700">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  id="service-category"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">Select a subcategory</option>
                  {subCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {subCategories.length === 0 && (
                  <p className="mt-1 text-xs text-amber-700">
                    No subcategories available. Load subcategories before creating a service.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="service-price" className="mb-2 block text-sm font-medium text-stone-700">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="800"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label htmlFor="service-discount" className="mb-2 block text-sm font-medium text-stone-700">
                  Discount
                </label>
                <input
                  id="service-discount"
                  name="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
                <p className="mt-1 text-xs text-stone-500">
                  Enter a value using the same discount format as your backend.
                </p>
              </div>

              <div>
                <label htmlFor="service-duration" className="mb-2 block text-sm font-medium text-stone-700">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-duration"
                  name="duration_minutes"
                  type="number"
                  min="1"
                  step="1"
                  value={form.duration_minutes}
                  onChange={handleChange}
                  required
                  placeholder="45"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label htmlFor="service-status" className="mb-2 block text-sm font-medium text-stone-700">
                  Status
                </label>
                <select
                  id="service-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-stone-900">
              Description
            </h2>
            <label htmlFor="service-description" className="mb-2 block text-sm font-medium text-stone-700">
              Service details
            </label>
            <textarea
              id="service-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe what is included in this salon service..."
              className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-lg font-bold text-stone-900">
              Service Images
            </h2>
            <p className="mb-4 text-sm text-stone-500">
              Upload multiple images to showcase this service.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 px-4 py-6 text-center transition hover:border-rose-500 hover:bg-rose-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="mb-3 h-10 w-10 text-stone-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5 5 5M4 16.5v2A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-2" />
              </svg>
              <span className="font-semibold text-stone-800">Choose images</span>
              <span className="mt-1 text-xs text-stone-500">
                Image files only · Multiple selection allowed
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-800">
                    Selected images
                  </h3>
                  <span className="text-xs text-stone-500">
                    {existingImages.length + newImages.length} image(s)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {existingImages.map((image, index) => (
                    <div
                      key={image.id ?? getImageUrl(image) ?? index}
                      className="relative"
                    >
                      {getImageUrl(image) ? (
                        <img
                          src={getImageUrl(image)}
                          alt={image.name ?? "Existing service"}
                          className="h-28 w-full rounded-lg border border-stone-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-28 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-500">
                          Image unavailable
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image)}
                        aria-label="Remove existing image"
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg text-white shadow hover:bg-red-700"
                      >
                        ×
                      </button>
                      <span className="mt-1 block truncate text-xs text-stone-500">
                        Existing image
                      </span>
                    </div>
                  ))}

                  {newImages.map((image) => (
                    <div key={image.key} className="relative">
                      <img
                        src={image.previewUrl}
                        alt={image.file.name}
                        className="h-28 w-full rounded-lg border border-stone-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(image.key)}
                        aria-label={`Remove ${image.file.name}`}
                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg text-white shadow hover:bg-red-700"
                      >
                        ×
                      </button>
                      <span className="mt-1 block truncate text-xs text-stone-500">
                        {image.file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-stone-300 px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : editingItem
              ? "Update Service"
              : "Save Service"}
        </button>
      </div>
    </form>
  );
}
