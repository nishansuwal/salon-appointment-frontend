import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { BookingCartProvider } from "./context/BookingCartContext";

export default function App() {
  return (
    <BrowserRouter>  
      <AuthProvider>
        <AppointmentProvider>
          <BookingCartProvider>
            <AppRoutes />
          </BookingCartProvider>
        </AppointmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
