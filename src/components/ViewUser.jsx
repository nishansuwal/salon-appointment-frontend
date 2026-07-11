import React from "react";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { getStatusColor } from "../utils/getStatusColor";

function ViewUser({ selectedUser }) {
  return (
    <div className="space-y-6">
      {/* User Profile Summary */}
      <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm">
        <img
          src={selectedUser.image}
          alt={selectedUser.name}
          className="h-20 w-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">
                {selectedUser.name}
              </h3>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                selectedUser.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedUser.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-stone-500">Email</p>
              <p className="font-medium text-stone-700">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Phone</p>
              <p className="font-medium text-stone-700">{selectedUser.phone}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Gender</p>
              <p className="font-medium text-stone-700">
                {selectedUser.gender}
              </p>
            </div>
            <div>
              <p className="text-xs text-stone-500">Total Appointments</p>
              <p className="font-medium text-stone-700">
                {selectedUser.appointments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment History */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <FiCalendar className="text-rose-600" />
          <h4 className="text-lg font-bold text-stone-900">
            Appointment History
          </h4>
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-stone-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-stone-700">
                    Appointment ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-stone-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-stone-700">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-stone-700">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-stone-700">
                    Service
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase text-stone-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.appointmentHistory &&
                selectedUser.appointmentHistory.length > 0 ? (
                  selectedUser.appointmentHistory.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-stone-200 hover:bg-stone-50"
                    >
                      <td className="px-4 py-3 font-medium text-stone-700">
                        #{appointment.id}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {appointment.date}
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        <div className="flex items-center gap-1">
                          <FiClock size={14} className="text-stone-400" />
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        <div className="flex items-center gap-1">
                          <FiUser size={14} className="text-stone-400" />
                          {appointment.staff}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-600">
                        {appointment.service}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-stone-500"
                    >
                      No appointment history found for this user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUser;
