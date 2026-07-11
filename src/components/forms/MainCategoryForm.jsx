import React from "react";

function MainCategoryForm({ editingItem }) {
  return (
    <form className="space-y-6 p-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Category Name
        </label>

        <input
          type="text"
          defaultValue={editingItem?.name || ""}
          placeholder="Hair"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Slug
        </label>

        <input
          type="text"
          defaultValue={editingItem?.slug || ""}
          placeholder="hair"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none transition focus:border-rose-500"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-stone-700">
          Status
        </label>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            defaultChecked={editingItem?.status ?? true}
            className="h-5 w-5 accent-rose-600"
          />

          <span className="text-sm text-stone-700">Active</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="submit"
          //   onClick={(e) => {
          //     e.preventDefault();

          //     Swal.fire({
          //       icon: "success",
          //       title: editingItem
          //         ? "Updated Successfully"
          //         : "Created Successfully",
          //       timer: 1500,
          //       showConfirmButton: false,
          //     });

          //     setShowModal(false);
          //   }}
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          {editingItem ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}

export default MainCategoryForm;
