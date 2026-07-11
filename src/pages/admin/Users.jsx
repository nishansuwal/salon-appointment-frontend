import {
  FiPlus,
  FiSearch,
  FiEye,
  FiToggleRight,
  FiToggleLeft,
  FiUsers,
  FiCalendar,
  FiClock,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import { showConfirmAlert } from "../../utils/alertUtils";
import LargeModal from "../../components/common/LargeModal";
import ViewUser from "../../components/ViewUser";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ram Sharma",
      email: "ram@gmail.com",
      phone: "9800000001",
      gender: "Male",
      appointments: 12,
      lastVisit: "10 Jul 2026",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=11",
      appointmentHistory: [
        {
          id: 1,
          date: "10 Jul 2026",
          time: "10:00 AM",
          doctor: "Dr. Smith",
          service: "General Checkup",
          status: "Completed",
        },
        {
          id: 2,
          date: "05 Jul 2026",
          time: "02:30 PM",
          doctor: "Dr. Johnson",
          service: "Dental Cleaning",
          status: "Completed",
        },
        {
          id: 3,
          date: "28 Jun 2026",
          time: "11:15 AM",
          doctor: "Dr. Williams",
          service: "Eye Examination",
          status: "Cancelled",
        },
      ],
    },
    {
      id: 2,
      name: "Sita Rai",
      email: "sita@gmail.com",
      phone: "9800000002",
      gender: "Female",
      appointments: 8,
      lastVisit: "08 Jul 2026",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=32",
      appointmentHistory: [
        {
          id: 4,
          date: "08 Jul 2026",
          time: "09:00 AM",
          staff: "Dr. Brown",
          service: "Blood Test",
          status: "Completed",
        },
        {
          id: 5,
          date: "01 Jul 2026",
          time: "03:45 PM",
          staff: "Dr. Smith",
          service: "Consultation",
          status: "Completed",
        },
      ],
    },
    {
      id: 3,
      name: "Hari KC",
      email: "hari@gmail.com",
      phone: "9800000003",
      gender: "Male",
      appointments: 2,
      lastVisit: "25 Jun 2026",
      status: "Inactive",
      image: "https://i.pravatar.cc/150?img=15",
      appointmentHistory: [
        {
          id: 6,
          date: "25 Jun 2026",
          time: "01:00 PM",
          staff: "Johnson",
          service: "X-Ray",
          status: "Completed",
        },
      ],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const actionText = currentStatus === "Active" ? "disable" : "enable";
    const confirmText =
      currentStatus === "Active" ? "Yes, Disable!" : "Yes, Enable!";

    showConfirmAlert(
      `Are you sure?`,
      `You are about to ${actionText} this user. This action can be reversed.`,
      confirmText,
      () => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user,
          ),
        );
      },
    );
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getToggleState = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.status === "Active";
  };

  return (
    <section className="space-y-6">
      {/* View User Modal */}
      <LargeModal
        open={isModalOpen}
        title={`User Details - ${selectedUser?.name || ""}`}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <ViewUser
            selectedUser={selectedUser}
          />
        )}
      </LargeModal>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            Users
          </p>

          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Manage Users
          </h1>

          <p className="mt-2 text-stone-500">
            View and manage all registered users.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search user..."
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select className="rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-rose-500">
            <option>Newest</option>
            <option>Oldest</option>
            <option>Name A-Z</option>
            <option>Most Appointments</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-stone-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  User
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Gender
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Appointments
                </th>

                <th className="px-6 py-4 text-left text-sm font-bold text-stone-700">
                  Last Visit
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-bold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isEnabled = user.status === "Active";
                return (
                  <tr
                    key={user.id}
                    className="border-t border-stone-200 hover:bg-stone-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        <div>
                          <p className="font-semibold text-stone-900">
                            {user.name}
                          </p>

                          <p className="text-sm text-stone-500">#{user.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-700">{user.email}</p>

                      <p className="text-sm text-stone-500">{user.phone}</p>
                    </td>

                    <td className="px-6 py-4">{user.gender}</td>

                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                        {user.appointments}
                      </span>
                    </td>

                    <td className="px-6 py-4">{user.lastVisit}</td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <FiEye />
                        </button>

                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className={`rounded-lg p-2 transition ${
                            isEnabled
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {isEnabled ? (
                            <FiToggleRight size={24} />
                          ) : (
                            <FiToggleLeft size={24} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-stone-500">
          Showing <strong>1–{users.length}</strong> of{" "}
          <strong>{users.length}</strong> users
        </p>

        <div className="flex gap-2">
          <button className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-100">
            Previous
          </button>

          <button className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white">
            1
          </button>

          <button className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-100">
            2
          </button>

          <button className="rounded-lg border border-stone-300 px-4 py-2 hover:bg-stone-100">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
