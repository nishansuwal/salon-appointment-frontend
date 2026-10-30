import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiBriefcase,
  FiUser,
  FiCheck,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { fetchMainCategories } from "../../store/apps/public/categories";
import { fetchRecords as fetchUsers } from "../../store/apps/users";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emptyAvailability = () =>
  DAYS.map((day) => ({
    day_of_week: day,
    start_time: "09:00",
    end_time: "17:00",
    enabled: false,
  }));

function StaffForm({
  staff = null,
  onSubmit,
  onClose,
}) {
  const dispatch = useDispatch();

  const isEdit = Boolean(staff);

  const usersResponse = useSelector(
    (state) => state.users?.data
  );

  const categoriesResponse = useSelector(
    (state) => state.categories?.mainCategories
  );

  // Handle different API response structures
  const users = Array.isArray(usersResponse)
    ? usersResponse
    : usersResponse?.data ?? [];

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : categoriesResponse?.data ?? [];

  // ==========================================
  // Form Data
  // ==========================================

  const [formData, setFormData] = useState({
    user_id: "",
    position: "",
    experience: "",
    bio: "",
    category_ids: [],
    is_active: true,
  });

  const [availability, setAvailability] = useState(
    emptyAvailability()
  );

  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMainCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!staff) {
      setFormData({
        user_id: "",
        position: "",
        experience: "",
        bio: "",
        category_ids: [],
        is_active: true,
      });

      setAvailability(emptyAvailability());

      return;
    }

    setFormData({
      user_id: staff.user_id ?? staff.user?.id ?? "",
      position: staff.position ?? "",
      experience: staff.experience ?? "",
      bio: staff.bio ?? "",
      category_ids:
        staff.categories?.map((category) => Number(category.id)) ?? [],
      is_active:
        staff.is_active === true ||
        staff.is_active === 1 ||
        staff.is_active === "1",
    });

    // Load existing availability
    const existingAvailability = staff.availability ?? [];

    const loadedAvailability = DAYS.map((day) => {
      const existing = existingAvailability.find(
        (item) =>
          item.day_of_week?.toLowerCase() === day
      );

      return {
        day_of_week: day,
        start_time:
          existing?.start_time?.slice(0, 5) ?? "09:00",
        end_time:
          existing?.end_time?.slice(0, 5) ?? "17:00",
        enabled: Boolean(existing),
      };
    });

    setAvailability(loadedAvailability);
  }, [staff]);

  // ==========================================
  // Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // Category Change
  // ==========================================

  const handleCategoryChange = (categoryId) => {
    const id = Number(categoryId);

    setFormData((prev) => {
      const exists = prev.category_ids.includes(id);

      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter(
              (category) => category !== id
            )
          : [...prev.category_ids, id],
      };
    });
  };

  // ==========================================
  // Status
  // ==========================================

  const handleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  // ==========================================
  // Availability
  // ==========================================

  const toggleDay = (day) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day_of_week === day
          ? {
              ...item,
              enabled: !item.enabled,
            }
          : item
      )
    );
  };

  const updateAvailability = (
    day,
    field,
    value
  ) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day_of_week === day
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (e) => {    
    e.preventDefault();

    if (!formData.user_id) {
      alert("Please select a user.");
      return;
    }

    if (formData.category_ids.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        user_id: Number(formData.user_id),

        position: formData.position.trim(),

        experience: Number(formData.experience),

        bio: formData.bio.trim(),

        categories: formData.category_ids,

        is_active: formData.is_active,

        availability: availability
          .filter((item) => item.enabled)
          .map((item) => ({
            day_of_week: item.day_of_week,
            start_time: item.start_time,
            end_time: item.end_time,
          })),
      };


      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6"
    >
      {/* ==========================================
          User Selection
      ========================================== */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-stone-900">
            User Information
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Select the existing user account that will be
            assigned as staff.
          </p>
        </div>

        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Select User
        </label>

        <div className="relative">
          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-stone-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-rose-500"
          >
            <option value="">
              Select User
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
                {user.email
                  ? ` - ${user.email}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        {users.length === 0 && (
          <p className="mt-2 text-sm text-red-500">
            No users available.
          </p>
        )}
      </div>

      {/* ==========================================
          Staff Information
      ========================================== */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-stone-900">
            Staff Information
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Enter professional information for this staff
            member.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Position */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Position
            </label>

            <div className="relative">
              <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Senior Hair Stylist"
                className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Experience */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              required
              placeholder="5"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* ==========================================
          Bio
      ========================================== */}

      <div>
        <label className="mb-2 block text-sm font-semibold text-stone-700">
          Bio
        </label>

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          placeholder="Experienced hair stylist with..."
          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500"
        />
      </div>

      {/* ==========================================
          Categories
      ========================================== */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-stone-900">
            Assigned Categories
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Select the categories/services this staff member
            can handle.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-red-500">
            No categories available.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const checked =
                formData.category_ids.includes(
                  Number(category.id)
                );

              return (
                <label
                  key={category.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                    checked
                      ? "border-rose-500 bg-rose-50"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      handleCategoryChange(
                        category.id
                      )
                    }
                    className="h-4 w-4 accent-rose-600"
                  />

                  <span className="flex-1 text-sm font-medium text-stone-700">
                    {category.name}
                  </span>

                  {checked && (
                    <FiCheck className="text-rose-600" />
                  )}
                </label>
              );
            })}
          </div>
        )}

        {formData.category_ids.length > 0 && (
          <p className="mt-3 text-sm text-stone-500">
            {formData.category_ids.length} category
            {formData.category_ids.length > 1
              ? "ies"
              : ""}{" "}
            selected
          </p>
        )}
      </div>

      {/* ==========================================
          Status
      ========================================== */}

      <div>
        <label className="mb-3 block text-sm font-semibold text-stone-700">
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

      {/* ==========================================
          Weekly Availability
      ========================================== */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-stone-900">
            Weekly Availability
          </h2>

          <p className="mt-1 text-sm text-stone-500">
            Configure the days and working hours of this
            staff member.
          </p>
        </div>

        <div className="space-y-3">
          {availability.map((item) => (
            <div
              key={item.day_of_week}
              className={`grid items-center gap-4 rounded-xl border p-4 md:grid-cols-[180px_1fr_1fr] ${
                item.enabled
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-stone-200"
              }`}
            >
              {/* Day */}

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() =>
                    toggleDay(item.day_of_week)
                  }
                  className="h-4 w-4 accent-rose-600"
                />

                <span className="font-semibold capitalize text-stone-800">
                  {item.day_of_week}
                </span>
              </label>

              {/* Start */}

              <div>
                <label className="mb-1 block text-xs text-stone-500">
                  Start Time
                </label>

                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    type="time"
                    value={item.start_time}
                    disabled={!item.enabled}
                    onChange={(e) =>
                      updateAvailability(
                        item.day_of_week,
                        "start_time",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-stone-300 py-2 pl-9 pr-3 outline-none focus:border-rose-500 disabled:bg-stone-100"
                  />
                </div>
              </div>

              {/* End */}

              <div>
                <label className="mb-1 block text-xs text-stone-500">
                  End Time
                </label>

                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />

                  <input
                    type="time"
                    value={item.end_time}
                    disabled={!item.enabled}
                    onChange={(e) =>
                      updateAvailability(
                        item.day_of_week,
                        "end_time",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-stone-300 py-2 pl-9 pr-3 outline-none focus:border-rose-500 disabled:bg-stone-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          Footer
      ========================================== */}

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={onClose}
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
              ? "Update Staff"
              : "Create Staff"}
        </button>
      </div>
    </form>
  );
}

export default StaffForm;
