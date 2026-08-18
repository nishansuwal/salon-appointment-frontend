import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "user123@gmail.com", password: "user123" });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(form);
    // navigate(form.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
      <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}
