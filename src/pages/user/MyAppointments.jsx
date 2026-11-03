
import AppointmentCard from "../../components/appointment/AppointmentCard";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import {
  fetchRecords,
  cancelAppointment,
} from "../../store/apps/public/appointment";

import {
  showConfirmAlert,
  showErrorAlert,
  showWarningAlert,
  showSuccessAlert,
} from "../../utils/alertUtils";

export default function MyAppointments() {
  const dispatch = useDispatch();

  const appointments = useSelector(
    (state) => state.appointment.data
  );

  const loading = useSelector(
    (state) => state.appointment.loading
  );

  const appointmentRecords = Array.isArray(appointments?.data)
    ? appointments.data
    : Array.isArray(appointments)
      ? appointments
      : [];

  // Fetch appointments
  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  // Cancel appointment
  const handleCancelAppointment = (appointment) => {
    if (appointment.status !== "pending") {
      showWarningAlert(
        "Cancellation Not Allowed",
        "Only pending appointments can be cancelled."
      );
      return;
    }

    showConfirmAlert(
      "Cancel Appointment?",
      `Are you sure you want to cancel appointment ${
        appointment.appointment_code || `#${appointment.id}`
      }?`,
      "Yes, Cancel",
      async () => {
        try {
          const response = await dispatch(
            cancelAppointment(appointment.id)
          ).unwrap();

          showSuccessAlert(
            response?.message ||
              "Appointment cancelled successfully."
          );

          dispatch(fetchRecords());
        } catch (error) {
          showErrorAlert(
            error?.message ||
              error?.errors?.status?.[0] ||
              "Failed to cancel appointment."
          );
        }
      }
    );
  };

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
          Appointments
        </p>

        <h1 className="mt-2 text-3xl font-black text-stone-950">
          My appointments
        </h1>
      </div>

      {loading ? (
        <p className="py-8 text-center text-stone-500">
          Loading appointments...
        </p>
      ) : appointmentRecords.length === 0 ? (
        <div className="rounded-xl border border-stone-200 p-8 text-center">
          <p className="font-medium text-stone-600">
            You don't have any appointments yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointmentRecords.map((appointment) => (
            <div
              key={appointment.id}
              className="grid gap-3"
            >
              <AppointmentCard appointment={appointment} />

              {appointment.status === "pending" && (
                <button
                  type="button"
                  onClick={() =>
                    handleCancelAppointment(appointment)
                  }
                  className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
