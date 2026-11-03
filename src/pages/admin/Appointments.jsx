
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, RefreshCw } from "lucide-react";

import AppointmentCard from "../../components/appointment/AppointmentCard";
import AppointmentModal from "../../components/appointment/AppointmentModal";

import {
  fetchAllRecords as fetchAllAppointments,
  updateRecordStatus,
  deleteRecord,
} from "../../store/apps/admin/adminAppointment";

import { fetchDropdownData } from "../../store/apps/public/dropdownSlice";

import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../../utils/alertUtils";

export default function AdminAppointments() {
  const dispatch = useDispatch();

  // --------------------------------------
  // REDUX DATA
  // --------------------------------------

  const appointments = useSelector(
    (state) => state.adminAppointment.data
  );

  const customersData = useSelector(
    (state) => state.dropdown.dataByKey?.bookingCustomers
  );

  const servicesData = useSelector(
    (state) => state.dropdown.dataByKey?.bookingServices
  );

  const staffData = useSelector(
    (state) => state.dropdown.dataByKey?.bookingStaff
  );

  const loading = useSelector(
    (state) => state.adminAppointment.loading
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

  const customers = Array.isArray(customersData)
    ? customersData
    : customersData?.data ?? [];

  const services = Array.isArray(servicesData)
    ? servicesData
    : servicesData?.data ?? [];

  const staff = Array.isArray(staffData)
    ? staffData
    : staffData?.data ?? [];

  // --------------------------------------
  // FETCH DATA
  // --------------------------------------

  const loadAppointments = () => {
    dispatch(fetchAllAppointments());
  };

  useEffect(() => {
    loadAppointments();

    dispatch(
      fetchDropdownData({
        key: "bookingCustomers",
        module: "users",
        field: ["id", "name", "email"],
        filter: { role: "user" },
      })
    );

    dispatch(
      fetchDropdownData({
        key: "bookingServices",
        module: "services",
        field: [
          "id",
          "name",
          "price",
          "duration_minutes",
          "status",
        ],
        filter: { status: "active" },
      })
    );

    dispatch(
      fetchDropdownData({
        key: "bookingStaff",
        module: "staff",
        field: ["id", "user_id", "position", "is_active"],
        filter: { is_active: true },
      })
    );
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
        updateRecordStatus({
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
  // DELETE APPOINTMENT
  // --------------------------------------

  const handleDelete = (id) => {
    showConfirmAlert(
      "Delete Appointment?",
      "Are you sure you want to delete this appointment? This action cannot be undone.",
      "Yes, Delete",
      async () => {
        try {
          await dispatch(deleteRecord(id)).unwrap();

          showSuccessAlert(
            "Deleted",
            "Appointment deleted successfully."
          );

          loadAppointments();
        } catch (error) {
          showErrorAlert(
            "Delete Failed",
            error?.message || "Unable to delete appointment."
          );
        }
      }
    );
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

        const email =
          appointment.user?.email ??
          appointment.customer?.email ??
          "";

        const code =
          appointment.appointment_code ?? "";

        const serviceNames = (
          appointment.appointment_services ??
          appointment.services ??
          []
        )
          .map((item) =>
            item.service?.name ?? item.name ?? ""
          )
          .join(" ");

        return (
          customer.toLowerCase().includes(keyword) ||
          email.toLowerCase().includes(keyword) ||
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
        return (
          (a.user?.name ?? "").localeCompare(
            b.user?.name ?? ""
          )
        );
      }

      if (sortBy === "name_desc") {
        return (
          (b.user?.name ?? "").localeCompare(
            a.user?.name ?? ""
          )
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
        customers={customers}
        serviceOptions={services}
        staffOptions={staff}
      />

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-stone-950">
            Manage Appointments
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Manage customer appointments, services and status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openModal("create")}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700"
        >
          <Plus size={18} />
          Add Appointment
        </button>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row md:items-center">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, email, code or service..."
            className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-rose-500"
          />
        </div>

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
              onEdit={(item) =>
                openModal("edit", item.id)
              }
              onDelete={(item) =>
                handleDelete(item.id)
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
