import { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Search, CalendarDays, Clock3, User } from "lucide-react";

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-lg bg-stone-100 p-4 text-center">
      <p className="text-sm text-stone-500">{title}</p>

      <h3 className="mt-2 text-2xl font-black text-stone-900">{value}</h3>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${color}`} />

      <span className="text-sm text-stone-700">{label}</span>
    </div>
  );
}

const appointments = [
  {
    id: "1",
    title: "Hair Cut - Ram Sharma",
    customer: "Ram Sharma",
    service: "Hair Cut",
    phone: "9812345678",
    duration: "45 Minutes",
    status: "Confirmed",
    start: "2026-07-18T10:00:00",
    end: "2026-07-18T10:45:00",
    color: "#16a34a",
  },
  {
    id: "2",
    title: "Hair Spa - Sita KC",
    customer: "Sita KC",
    service: "Hair Spa",
    phone: "9801234567",
    duration: "60 Minutes",
    status: "In Progress",
    start: "2026-07-18T11:30:00",
    end: "2026-07-18T12:30:00",
    color: "#2563eb",
  },
  {
    id: "3",
    title: "Hair Coloring - Hari Thapa",
    customer: "Hari Thapa",
    service: "Hair Coloring",
    phone: "9841122334",
    duration: "90 Minutes",
    status: "Pending",
    start: "2026-07-19T09:00:00",
    end: "2026-07-19T10:30:00",
    color: "#eab308",
  },
];

export default function StaffCalendar() {
  const [search, setSearch] = useState("");

  const events = useMemo(() => {
    return appointments
      .filter(
        (item) =>
          item.customer.toLowerCase().includes(search.toLowerCase()) ||
          item.service.toLowerCase().includes(search.toLowerCase()),
      )
      .map((item) => ({
        id: item.id,
        title: item.title,
        start: item.start,
        end: item.end,
        backgroundColor: item.color,
        borderColor: item.color,
        extendedProps: item,
      }));
  }, [search]);

  return (
    <section className="space-y-6">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900">My Schedule</h1>

          <p className="mt-2 text-stone-500">
            Manage your appointments and view your weekly schedule.
          </p>
        </div>

        <button className="rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700">
          Today
        </button>
      </div>

      {/* Search */}

      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
        />

        <input
          type="text"
          placeholder="Search customer or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
        />
      </div>

      {/* Main Layout */}

      <div className="grid gap-6 xl:grid-cols-4">
        {/* Calendar */}

        <div className="xl:col-span-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="78vh"
            nowIndicator
            selectable
            editable={false}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }}
            events={events}
            eventClick={(info) => {
              alert(
                `${info.event.extendedProps.service}\n\nCustomer: ${info.event.extendedProps.customer}`,
              );
            }}
          />

          <div className="rounded-xl border border-stone-200 bg-white shadow-sm pt-5">
            <div className="border-b p-5">
              <h2 className="font-bold">Today's Appointments</h2>
            </div>

            <div className="divide-y">
              {appointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 hover:bg-stone-50"
                >
                  <div>
                    <h3 className="font-semibold">{appointment.customer}</h3>

                    <p className="text-sm text-stone-500">
                      {appointment.service}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {new Date(appointment.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <span
                      className="text-xs"
                      style={{
                        color: appointment.color,
                      }}
                    >
                      ● {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}

        <div className="space-y-5">
          {/* Today's Summary */}

          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CalendarDays className="text-rose-600" size={20} />

              <h2 className="text-lg font-bold">Today's Summary</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SummaryCard title="Appointments" value="8" />

              <SummaryCard title="Completed" value="5" />

              <SummaryCard title="Pending" value="2" />

              <SummaryCard title="Working Hours" value="8 hrs" />
            </div>
          </div>

          {/* Next Appointment */}

          <div className="rounded-xl bg-rose-600 p-5 text-white shadow">
            <p className="text-sm opacity-80">Next Appointment</p>

            <h2 className="mt-2 text-2xl font-bold">Hair Cut</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} />
                Ram Sharma
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                10:00 AM - 10:45 AM
              </div>

              <div>Duration : 45 Minutes</div>

              <div>
                Status :
                <span className="ml-2 rounded bg-white/20 px-2 py-1 text-xs">
                  Confirmed
                </span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg bg-white py-3 font-semibold text-rose-600 transition hover:bg-stone-100">
              View Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
