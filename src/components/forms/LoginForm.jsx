import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "aarati@example.com", role: "user" });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(form);
    navigate(form.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-800">Account type</span>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="min-h-11 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
        >
          <option value="user">Client</option>
          <option value="admin">Salon admin</option>
        </select>
      </label>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}
