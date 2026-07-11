import React, { useState } from "react";
import Select from "react-select";
import { FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const categories = [
  { value: 1, label: "Hair" },
  { value: 2, label: "Facial" },
  { value: 3, label: "Massage" },
  { value: 4, label: "Makeup" },
];

const staffOptions = [
  { value: 1, label: "Ram Sharma" },
  { value: 2, label: "Sita Thapa" },
  { value: 3, label: "Hari KC" },
  { value: 4, label: "Anita Rai" },
];

export default function ServiceForm() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const [status, setStatus] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState([]);

  return (
    <section className="mx-auto max-w-7xl space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <button
            onClick={() => navigate("/admin/services")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-rose-600"
          >
            <FiArrowLeft />
            Back to Services
          </button>

          <h1 className="text-3xl font-black text-stone-900">
            {isEdit ? "Edit Service" : "Add New Service"}
          </h1>

          <p className="mt-1 text-stone-500">
            {isEdit
              ? "Update your salon service."
              : "Create a new salon service."}
          </p>
        </div>

      </div>

      {/* Form */}
      <form className="space-y-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Service Information */}
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-lg font-bold">
                Service Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Service Name
                  </label>

                  <input
                    className="w-full rounded-lg border px-4 py-3 focus:border-rose-500 focus:outline-none"
                    placeholder="Hair Cut"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">
                    Slug
                  </label>

                  <input
                    className="w-full rounded-lg border px-4 py-3 focus:border-rose-500 focus:outline-none"
                    placeholder="hair-cut"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <select className="w-full rounded-lg border px-4 py-3 focus:border-rose-500 focus:outline-none">

                    <option>Select Category</option>

                    {categories.map((category) => (
                      <option key={category.value}>
                        {category.label}
                      </option>
                    ))}

                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Price
                  </label>

                  <input
                    type="number"
                    className="w-full rounded-lg border px-4 py-3 focus:border-rose-500 focus:outline-none"
                    placeholder="800"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duration (Minutes)
                  </label>

                  <input
                    type="number"
                    className="w-full rounded-lg border px-4 py-3 focus:border-rose-500 focus:outline-none"
                    placeholder="45"
                  />
                </div>

                <div>

                  <label className="mb-3 block text-sm font-medium">
                    Status
                  </label>

                  <button
                    type="button"
                    onClick={() => setStatus(!status)}
                    className={`relative flex h-7 w-14 items-center rounded-full transition ${
                      status ? "bg-rose-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white shadow transition ${
                        status
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>

                  <span className="mt-2 block text-sm text-stone-500">
                    {status ? "Active" : "Inactive"}
                  </span>

                </div>

              </div>

            </div>

            {/* Description */}

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold">
                Description
              </h2>

              <textarea
                rows={6}
                className="w-full rounded-lg border p-4 focus:border-rose-500 focus:outline-none"
                placeholder="Write description..."
              />

            </div>

            {/* Staff */}

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold">
                Assign Staff
              </h2>

              <Select
                isMulti
                options={staffOptions}
                value={selectedStaff}
                onChange={setSelectedStaff}
                placeholder="Select staff..."
              />

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="sticky top-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold">
                Service Images
              </h2>

              <label className="flex h-60 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 transition hover:border-rose-500">

                <FiUploadCloud className="text-5xl text-stone-400" />

                <p className="mt-4 font-semibold">
                  Upload Images
                </p>

                <p className="text-sm text-stone-500">
                  Click or drag images here
                </p>

                <input
                  type="file"
                  multiple
                  hidden
                />

              </label>

              <div className="mt-6 grid grid-cols-2 gap-3">

                {[1, 2, 3, 4].map((image) => (

                  <div
                    key={image}
                    className="relative overflow-hidden rounded-lg"
                  >

                    <img
                      src={`https://picsum.photos/300?random=${image}`}
                      alt=""
                      className="h-28 w-full object-cover"
                    />

                    <button
                      type="button"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white"
                    >
                      ✕

                    </button>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t pt-6">

          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="rounded-lg border px-6 py-3 font-semibold hover:bg-stone-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700"
          >
            {isEdit ? "Update Service" : "Save Service"}
          </button>

        </div>

      </form>

    </section>
  );
}