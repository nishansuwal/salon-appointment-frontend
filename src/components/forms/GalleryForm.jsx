import React from "react";
import { useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

const categories = ["Hair", "Facial", "Massage", "Makeup", "Nails", "Salon"];

function GalleryForm({ selectedImage }) {
  const isEdit = Boolean(selectedImage);

  return (
    <form className="space-y-6">
      {/* Title */}

      <div>
        <p className="mt-1 text-sm text-stone-500">
          {isEdit
            ? "Update gallery image information."
            : "Upload a new image to your salon gallery."}
        </p>
      </div>

      {/* Upload */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Gallery Image
        </label>

        <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 transition hover:border-rose-500">
          <FiUploadCloud size={55} className="text-stone-400" />

          <p className="mt-4 font-semibold text-stone-700">Click to upload</p>

          <p className="text-sm text-stone-500">PNG, JPG or WEBP</p>

          <input type="file" hidden />
        </label>
      </div>

      {/* Preview */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Preview
        </label>

        <div className="relative overflow-hidden rounded-xl border">
          <img
            src={
              selectedImage?.image ?? "https://picsum.photos/700/450?random=11"
            }
            alt=""
            className="h-64 w-full object-cover"
          />

          <button
            type="button"
            className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* Title */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Image Title
        </label>

        <input
          type="text"
          defaultValue={selectedImage?.title}
          placeholder="Modern Hair Styling"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
        />
      </div>

      {/* Category */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Category
        </label>

        <select className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
          <option>Select Category</option>

          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Status */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Status
        </label>

        <button
          type="button"
          onClick={() => setStatus(!status)}
          className={`relative flex h-8 w-16 items-center rounded-full transition ${
            status ? "bg-rose-600" : "bg-stone-300"
          }`}
        >
          <span
            className={`h-7 w-7 rounded-full bg-white shadow transition ${
              status ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>

        <p className="mt-2 text-sm text-stone-500">
          {status ? "Active" : "Inactive"}
        </p>
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700"
        >
          {isEdit ? "Update Image" : "Upload Image"}
        </button>
      </div>
    </form>
  );
}

export default GalleryForm;
