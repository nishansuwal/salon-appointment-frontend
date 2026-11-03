
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, RefreshCw } from "lucide-react";

import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentModal from "../../components/appointment/AppointmentModal";

import {
  fetchRecords,
  updateAppointmentStatus,
} from "../../store/apps/staff/staffAppointments";

import {
  showSuccessAlert,
  showErrorAlert,
} from "../../utils/alertUtils";

export default function StaffAppointments() {
  const dispatch = useDispatch();

  // --------------------------------------
  // REDUX DATA
  // --------------------------------------

  const appointments = useSelector(
    (state) => state.staffAppointments.data
  );

  const loading = useSelector(
    (state) => state.staffAppointments.loading
  );

  // --------------------------------------
  // LOCAL STATE
  // --------------------------------------

  const [modal, setModal] = useState({
    open: false,
    mode: "view",
    appointmentId: null,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // --------------------------------------
  // NORMALIZE DATA
  // --------------------------------------

  const appointmentRecords = Array.isArray(appointments?.data)
    ? appointments.data
    : Array.isArray(appointments)
      ? appointments
      : [];

  // --------------------------------------
  // FETCH DATA
  // --------------------------------------

  const loadAppointments = () => {
    dispatch(fetchRecords());
  };

  useEffect(() => {
    loadAppointments();
  }, [dispatch]);

  // --------------------------------------
  // MODAL
  // --------------------------------------

  const openModal = (mode, appointmentId = null) => {
    setModal({
      open: true,
      mode,
      appointmentId,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      mode: "view",
      appointmentId: null,
    });

    loadAppointments();
  };

  // --------------------------------------
  // UPDATE STATUS
  // --------------------------------------

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(
        updateAppointmentStatus({
          id,
          status,
        })
      ).unwrap();

      showSuccessAlert(
        "Status Updated",
        "Appointment status updated successfully."
      );

      loadAppointments();
    } catch (error) {
      showErrorAlert(
        "Update Failed",
        error?.message || "Unable to update appointment status."
      );
    }
  };

  // --------------------------------------
  // SEARCH, FILTER AND SORT
  // --------------------------------------

  const filteredAppointments = useMemo(() => {
    let result = [...appointmentRecords];

    // SEARCH
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((appointment) => {
        const customer =
          appointment.user?.name ??
          appointment.customer?.name ??
          "";

        const phone =
          appointment.user?.phone ??
          appointment.user?.phone_number ??
          "";

        const code = appointment.appointment_code ?? "";

        const serviceNames = (
          appointment.appointment_services ??
          appointment.appointmentServices ??
          appointment.services ??
          []
        )
          .map((item) =>
            item.service?.name ?? item.name ?? ""
          )
          .join(" ");

        return (
          customer.toLowerCase().includes(keyword) ||
          phone.toLowerCase().includes(keyword) ||
          code.toLowerCase().includes(keyword) ||
          serviceNames.toLowerCase().includes(keyword)
        );
      });
    }

    // STATUS FILTER
    if (statusFilter !== "all") {
      result = result.filter(
        (appointment) =>
          appointment.status?.toLowerCase() === statusFilter
      );
    }

    // SORT
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return b.id - a.id;
      }

      if (sortBy === "oldest") {
        return a.id - b.id;
      }

      if (sortBy === "name_asc") {
        return (a.user?.name ?? "").localeCompare(
          b.user?.name ?? ""
        );
      }

      if (sortBy === "name_desc") {
        return (b.user?.name ?? "").localeCompare(
          a.user?.name ?? ""
        );
      }

      return 0;
    });

    return result;
  }, [
    appointmentRecords,
    search,
    statusFilter,
    sortBy,
  ]);

  // --------------------------------------
  // RENDER
  // --------------------------------------

  return (
    <section className="grid gap-6">

      {/* MODAL */}

      <AppointmentModal
        isOpen={modal.open}
        mode={modal.mode}
        appointmentId={modal.appointmentId}
        onClose={closeModal}
      />

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Staff
          </p>

          <h1 className="mt-2 text-3xl font-black text-stone-950">
            My Appointments
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            View your assigned appointments and manage service status.
          </p>
        </div>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row md:items-center">

        {/* SEARCH */}

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, code or service..."
            className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-rose-500"
          />
        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-3 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>

        {/* SORT */}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border px-4 py-3 outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
        </select>

        {/* REFRESH */}

        <button
          type="button"
          onClick={loadAppointments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 hover:bg-stone-50 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* RESULTS COUNT */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          Showing{" "}
          <span className="font-bold text-stone-900">
            {filteredAppointments.length}
          </span>{" "}
          appointments
        </p>
      </div>

      {/* APPOINTMENT LIST */}

      {loading && appointmentRecords.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center text-stone-500">
          Loading appointments...
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onView={(item) =>
                openModal("view", item.id)
              }
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h3 className="text-lg font-bold text-stone-900">
            No appointments found
          </h3>

          <p className="mt-2 text-sm text-stone-500">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </section>
  );
}
