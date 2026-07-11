import { createContext, useContext, useMemo, useState } from "react";
import { INITIAL_APPOINTMENTS, SERVICES, STAFF } from "../utils/constants";

const AppointmentContext = createContext(null);

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const createAppointment = (appointment) => {
    const nextAppointment = {
      ...appointment,
      id: `APT-${Date.now().toString().slice(-5)}`,
      status: "Pending",
    };
    setAppointments((current) => [nextAppointment, ...current]);
    return nextAppointment;
  };

  const updateStatus = (appointmentId, status) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status } : appointment,
      ),
    );
  };

  const cancelAppointment = (appointmentId) => {
    updateStatus(appointmentId, "Cancelled");
  };

  const getService = (serviceId) => SERVICES.find((service) => service.id === serviceId);
  const getStaff = (staffId) => STAFF.find((staff) => staff.id === staffId);

  const enrichedAppointments = appointments.map((appointment) => {
    const appointmentServices = appointment.serviceIds?.length
      ? appointment.serviceIds.map(getService).filter(Boolean)
      : [getService(appointment.serviceId)].filter(Boolean);

    return {
      ...appointment,
      service: appointmentServices[0],
      services: appointmentServices,
      totalDuration:
        appointment.totalDuration ||
        appointmentServices.reduce((total, service) => total + service.duration, 0),
      totalPrice:
        appointment.totalPrice ||
        appointmentServices.reduce((total, service) => total + service.price, 0),
      staff: getStaff(appointment.staffId),
    };
  });

  const value = useMemo(
    () => ({
      appointments,
      enrichedAppointments,
      services: SERVICES,
      staff: STAFF,
      createAppointment,
      updateStatus,
      cancelAppointment,
      getService,
      getStaff,
    }),
    [appointments, enrichedAppointments],
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointmentContext() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointmentContext must be used within AppointmentProvider");
  }
  return context;
}
