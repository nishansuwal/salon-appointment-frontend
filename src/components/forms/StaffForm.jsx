import React, { useState } from "react";
import Select from "react-select";

const serviceOptions = [
  { value: 1, label: "Hair Cut" },
  { value: 2, label: "Hair Color" },
  { value: 3, label: "Hair Spa" },
  { value: 4, label: "Facial" },
  { value: 5, label: "Massage" },
];

const positions = [
  "Hair Stylist",
  "Barber",
  "Makeup Artist",
  "Massage Therapist",
  "Beautician",
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function StaffForm({ staff, onClose }) {
  const [status, setStatus] = useState(staff?.status ?? true);

  return (
    <form className="space-y-8">

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left */}
        <div className="space-y-6 lg:col-span-2">

          {/* Personal Information */}
          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-6 text-lg font-bold">
              Personal Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <input
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
                  placeholder="Ram Sharma"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3"
                  placeholder="ram@gmail.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone
                </label>

                <input
                  className="w-full rounded-lg border border-stone-300 px-4 py-3"
                  placeholder="9800000000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Gender
                </label>

                <select className="w-full rounded-lg border border-stone-300 px-4 py-3">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Position
                </label>

                <select className="w-full rounded-lg border border-stone-300 px-4 py-3">
                  <option>Select Position</option>

                  {positions.map((position) => (
                    <option key={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3"
                  placeholder="5"
                />
              </div>

            </div>

          </div>

          {/* Assign Services */}

          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-bold">
              Assign Services
            </h3>

            <Select
              isMulti
              options={serviceOptions}
              placeholder="Select Services..."
            />

          </div>

          {/* Working Schedule */}

          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-bold">
              Working Schedule
            </h3>

            <div className="grid gap-3 md:grid-cols-4">

              {weekDays.map((day) => (

                <label
                  key={day}
                  className="flex items-center gap-2"
                >
                  <input type="checkbox" />

                  {day}
                </label>

              ))}

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Start Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  End Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3"
                />

              </div>

            </div>

          </div>

          {/* Notes */}

          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-bold">
              Notes
            </h3>

            <textarea
              rows="5"
              className="w-full rounded-lg border border-stone-300 p-4"
              placeholder="Additional information..."
            />

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6">

          {/* Image */}

          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-bold">
              Profile Photo
            </h3>

            <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 hover:border-rose-500">

              <div className="text-5xl">📷</div>

              <p className="mt-3 font-semibold">
                Upload Image
              </p>

              <p className="text-sm text-stone-500">
                JPG, PNG
              </p>

              <input hidden type="file" />

            </label>

          </div>

          {/* Status */}

          <div className="rounded-xl border border-stone-200 bg-white p-6">

            <h3 className="mb-5 text-lg font-bold">
              Status
            </h3>

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

            <p className="mt-3 text-sm text-stone-500">
              {status ? "Active" : "Inactive"}
            </p>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-stone-300 px-6 py-3 font-semibold hover:bg-stone-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700"
        >
          {staff ? "Update Staff" : "Save Staff"}
        </button>

      </div>

    </form>
  );
}

export default StaffForm;