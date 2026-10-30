import React from "react";

function MainCategoryForm({ editingItem, onSubmit, onCancel }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const categoryData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      is_active: formData.get("is_active") === "on",
    };
    onSubmit(categoryData);
  };

  return (
    <form className="space-y-6 p-6" onSubmit={handleFormSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Category Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={editingItem?.name || ""}
          placeholder="Hair"
          required
          className="w-full rounded-lg border border-stone-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Slug
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={editingItem?.slug || ""}
          placeholder="hair"
          required
          className="w-full rounded-lg border border-stone-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-stone-700">
          Status
        </label>
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={editingItem?.is_active ?? true}
            className="h-5 w-5 accent-rose-600"
          />
          <span className="text-sm text-stone-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white"
        >
          {editingItem ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default MainCategoryForm;