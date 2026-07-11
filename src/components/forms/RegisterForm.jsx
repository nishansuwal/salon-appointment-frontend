import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ ...form, role: "user" });
    navigate("/book");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
      <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
      <Button type="submit" className="w-full">
        Create account
      </Button>
    </form>
  );
}
