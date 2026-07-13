import { useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Lock,
} from "lucide-react";

export default function StaffProfile() {
  const [status, setStatus] = useState(true);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-stone-900">My Profile</h1>

        <p className="mt-2 text-stone-500">Manage your personal information.</p>
      </div>

      <form className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left */}

          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/200"
                  alt=""
                  className="h-36 w-36 rounded-full object-cover"
                />

                <button
                  type="button"
                  className="absolute bottom-1 right-1 rounded-full bg-rose-600 p-2 text-white"
                >
                  <Camera size={18} />
                </button>
              </div>

              <h2 className="mt-5 text-xl font-bold">Ram Sharma</h2>

              <p className="text-stone-500">Senior Hair Stylist</p>

              <span className="mt-3 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                Active
              </span>
            </div>

            <div className="mt-8 space-y-4 text-sm">
              <Info title="Employee ID" value="EMP-001" />

              <Info title="Joined" value="12 Jan 2024" />

              <Info title="Experience" value="5 Years" />

              <Info title="Specialization" value="Hair Cut, Hair Color" />
            </div>
          </div>

          {/* Right */}

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold">Personal Information</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  icon={<User size={18} />}
                  label="Full Name"
                  placeholder="Ram Sharma"
                />

                <Input
                  icon={<Mail size={18} />}
                  label="Email"
                  placeholder="ram@gmail.com"
                />

                <Input
                  icon={<Phone size={18} />}
                  label="Phone"
                  placeholder="9812345678"
                />

                <Input
                  icon={<Briefcase size={18} />}
                  label="Position"
                  placeholder="Senior Hair Stylist"
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold">Address</label>

                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-stone-400"
                      size={18}
                    />

                    <input
                      className="w-full rounded-lg border border-stone-300 py-3 pl-10 pr-4 focus:border-rose-500 outline-none"
                      placeholder="Kathmandu"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold">Bio</label>

                  <textarea
                    rows={5}
                    className="w-full rounded-lg border border-stone-300 p-4 outline-none focus:border-rose-500"
                    placeholder="Write something..."
                  />
                </div>
              </div>
            </div>

            {/* Work */}

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold">Work Information</h2>

              <div className="grid gap-5 md:grid-cols-3">
                <Input
                  icon={<Award size={18} />}
                  label="Experience"
                  placeholder="5 Years"
                />

                <Input
                  icon={<Briefcase size={18} />}
                  label="Specialization"
                  placeholder="Hair Cut"
                />

                <div>
                  <label className="mb-2 block font-semibold">Status</label>

                  <button
                    type="button"
                    onClick={() => setStatus(!status)}
                    className={`relative flex h-7 w-14 items-center rounded-full transition ${
                      status ? "bg-rose-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full bg-white transition ${
                        status ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Password */}

            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold">Change Password</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  icon={<Lock size={18} />}
                  type="password"
                  label="New Password"
                />

                <Input
                  icon={<Lock size={18} />}
                  type="password"
                  label="Confirm Password"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-stone-300 px-6 py-3 hover:bg-stone-100"
          >
            Cancel
          </button>

          <button className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-stone-500">{title}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Input({ label, icon, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-semibold">{label}</label>

      <div className="relative">
        <span className="absolute left-3 top-3 text-stone-400">{icon}</span>

        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-stone-300 py-3 pl-10 pr-4 outline-none focus:border-rose-500"
        />
      </div>
    </div>
  );
}
