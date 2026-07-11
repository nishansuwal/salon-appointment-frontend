import { Link } from "react-router-dom";
import RegisterForm from "../../components/forms/RegisterForm";

export default function Register() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Create account</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Start booking salon appointments</h1>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-5 text-sm text-stone-600">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-rose-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
