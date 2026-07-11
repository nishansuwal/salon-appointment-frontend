import { Link } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";

export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-rose-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-black text-stone-950">Login to your salon account</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-5 text-sm text-stone-600">
          New here?{" "}
          <Link to="/register" className="font-bold text-rose-700">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
