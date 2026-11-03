import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Plus, Trash2, LoaderCircle } from "lucide-react";

import {
  addRecord,
  updateRecord,
  fetchRecordById,
} from "../../store/apps/admin/adminAppointment";

const emptyForm = {
  user_id: "",
  appointment_date: "",
  start_time: "",
  notes: "",
  appointment_services: [],
};

export default function AppointmentModal({
  isOpen,
  mode = "view",
  appointmentId = null,
  onClose,
  customers = [],
  serviceOptions = [],
  staffOptions = [],
}) {
  const dispatch = useDispatch();

  const { selectedRecord } = useSelector((state) => state.adminAppointment);

  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  // Fetch existing appointment
  useEffect(() => {
    if (!isOpen || isCreate || !appointmentId) return;

    let active = true;

    const loadAppointment = async () => {
      setFetching(true);

      try {
        const result = await dispatch(fetchRecordById(appointmentId)).unwrap();

        if (!active) return;

        const appointment = result.data;

        setFormData({
          user_id: appointment.user_id ?? "",
          appointment_date: appointment.appointment_date ?? "",
          start_time: appointment.start_time?.slice(0, 5) ?? "",
          notes: appointment.notes ?? "",
          appointment_services: (
            appointment.appointment_services ??
            appointment.services ??
            []
          ).map((item) => ({
            service_id: item.service_id ?? item.service?.id ?? "",
            staff_id: item.staff_id ?? item.staff?.id ?? "",
            price: item.price ?? item.service?.price ?? "",
            notes: item.notes ?? "",
          })),
        });
      } catch (error) {
        console.error("Failed to load appointment:", error);
      } finally {
        if (active) setFetching(false);
      }
    };

    loadAppointment();

    return () => {
      active = false;
    };
  }, [isOpen, appointmentId, isCreate, dispatch]);

  // Reset when opening create mode
  useEffect(() => {
    if (isOpen && isCreate) {
      setFormData(emptyForm);
    }
  }, [isOpen, isCreate]);

  if (!isOpen) return null;

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      appointment_services: [
        ...prev.appointment_services,
        {
          service_id: "",
          staff_id: "",
          price: "",
          notes: "",
        },
      ],
    }));
  };

  const updateService = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      appointment_services: prev.appointment_services.map((service, i) => {
        if (i !== index) return service;

        const updated = {
          ...service,
          [field]: value,
        };

        if (field === "service_id") {
          const selected = serviceOptions.find(
            (item) => String(item.id) === String(value),
          );

          updated.price = selected?.price ?? "";
          updated.staff_id = "";
        }

        return updated;
      }),
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      appointment_services: prev.appointment_services.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isView || submitting) return;

    if (!formData.appointment_services.length) {
      return;
    }

    const payload = {
      user_id: Number(formData.user_id),
      appointment_date: formData.appointment_date,
      start_time: formData.start_time,
      notes: formData.notes || null,
      appointment_services: formData.appointment_services.map((service) => ({
        service_id: Number(service.service_id),
        staff_id: Number(service.staff_id),
        notes: service.notes || null,
      })),
    };

    setSubmitting(true);

    try {
      if (isEdit) {
        await dispatch(
          updateRecord({
            id: appointmentId,
            ...payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addRecord(payload)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Appointment submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const title = isCreate
    ? "Create Appointment"
    : isEdit
      ? "Edit Appointment"
      : "Appointment Details";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-black text-stone-900">{title}</h2>

            <p className="mt-1 text-sm text-stone-500">
              {isView
                ? "Review appointment information."
                : "Enter appointment information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-stone-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        {fetching ? (
          <div className="flex flex-1 items-center justify-center p-16">
            <LoaderCircle className="animate-spin" size={32} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              {/* CUSTOMER */}
              <section>
                <h3 className="mb-3 font-bold">Customer Information</h3>

                {isView ? (
                  <Info label="Customer" value={selectedRecord?.user?.name} />
                ) : (
                  <Field label="Select Customer">
                    <select
                      required
                      value={formData.user_id}
                      onChange={(e) => updateField("user_id", e.target.value)}
                      className="field"
                    >
                      <option value="">Select customer</option>

                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </section>

              {/* DATE AND TIME */}
              <section>
                <h3 className="mb-3 font-bold">Appointment Schedule</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Appointment Date">
                    <input
                      type="date"
                      required
                      disabled={isView}
                      value={formData.appointment_date}
                      onChange={(e) =>
                        updateField("appointment_date", e.target.value)
                      }
                      className="field"
                    />
                  </Field>

                  <Field label="Start Time">
                    <input
                      type="time"
                      required
                      disabled={isView}
                      value={formData.start_time}
                      onChange={(e) =>
                        updateField("start_time", e.target.value)
                      }
                      className="field"
                    />
                  </Field>
                </div>
              </section>

              {/* SERVICES */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold">Appointment Services</h3>

                  {!isView && (
                    <button
                      type="button"
                      onClick={addService}
                      className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
                    >
                      <Plus size={16} />
                      Add Service
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {formData.appointment_services.map((service, index) => (
                    <div key={index} className="rounded-xl border p-4">
                      <div className="mb-3 flex justify-between">
                        <h4 className="font-semibold">Service {index + 1}</h4>

                        {!isView && (
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Service">
                          {isView ? (
                            <p className="text-sm">
                              {selectedRecord?.appointment_services?.[index]
                                ?.service?.name ??
                                serviceOptions.find(
                                  (item) =>
                                    String(item.id) ===
                                    String(service.service_id),
                                )?.name ??
                                "-"}
                            </p>
                          ) : (
                            <select
                              required
                              value={service.service_id}
                              onChange={(e) =>
                                updateService(
                                  index,
                                  "service_id",
                                  e.target.value,
                                )
                              }
                              className="field"
                            >
                              <option value="">Select Service</option>

                              {serviceOptions.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name} - Rs. {item.price}
                                </option>
                              ))}
                            </select>
                          )}
                        </Field>

                        <Field label="Assigned Staff">
                          {isView ? (
                            <p className="text-sm">
                              {selectedRecord?.appointment_services?.[index]
                                ?.staff?.user?.name ??
                                selectedRecord?.appointment_services?.[index]
                                  ?.staff?.name ??
                                "-"}
                            </p>
                          ) : (
                            <select
                              required
                              value={service.staff_id}
                              onChange={(e) =>
                                updateService(index, "staff_id", e.target.value)
                              }
                              className="field"
                            >
                              <option value="">Select Staff</option>

                              {staffOptions.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.user?.name ??
                                    staff.name ??
                                    staff.position}
                                </option>
                              ))}
                            </select>
                          )}
                        </Field>
                      </div>

                      <div className="mt-4">
                        <Field label="Service Notes">
                          <textarea
                            disabled={isView}
                            rows={2}
                            value={service.notes}
                            onChange={(e) =>
                              updateService(index, "notes", e.target.value)
                            }
                            placeholder="Instructions for this service..."
                            className="field"
                          />
                        </Field>
                      </div>

                      <p className="mt-3 text-sm font-semibold">
                        Price: Rs. {Number(service.price || 0).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  {formData.appointment_services.length === 0 && (
                    <p className="rounded-lg bg-stone-50 p-5 text-center text-sm text-stone-500">
                      No services added yet.
                    </p>
                  )}
                </div>
              </section>

              {/* OVERALL NOTES */}
              <section>
                <h3 className="mb-3 font-bold">Overall Appointment Notes</h3>

                <textarea
                  disabled={isView}
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Additional appointment instructions..."
                  className="field"
                />
              </section>

              {/* TOTAL */}
              <div className="rounded-xl bg-stone-50 p-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Services Subtotal</span>

                  <span className="font-black">
                    Rs.{" "}
                    {formData.appointment_services
                      .reduce((sum, item) => sum + Number(item.price || 0), 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t bg-white p-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-5 py-2.5 font-semibold"
              >
                {isView ? "Close" : "Cancel"}
              </button>

              {!isView && (
                <button
                  type="submit"
                  disabled={submitting || !formData.appointment_services.length}
                  className="rounded-lg bg-rose-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEdit
                      ? "Update Appointment"
                      : "Create Appointment"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-stone-700">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 font-semibold">{value || "-"}</p>
    </div>
  );
}
