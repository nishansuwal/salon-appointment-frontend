import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { login, loginLoading } = useAuth();
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "user123@gmail.com",
    password: "user123",
  });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loginLoading) return;

    await login(form, (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password.";

      setError(message);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Email */}
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        disabled={loginLoading}
      />

      {/* Password */}
      <div className="relative">
        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          disabled={loginLoading}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          disabled={loginLoading}
          className="absolute right-3 top-[38px] text-stone-500 hover:text-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={loginLoading}>
        {loginLoading ? "Signing in..." : "Continue"}
      </Button>
    </form>
  );
}
