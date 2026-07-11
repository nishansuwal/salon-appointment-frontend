import { SERVICES, STAFF } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatDate";
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiUsers } from "react-icons/fi";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminServices() {
  const [services, setServices] = useState(SERVICES);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/admin/services/create");
  };

  const handleEdit = (service) => {
    if (!service) return;
      navigate(`/admin/services/edit/${service.slug}`);
  };

  const handleDelete = (service) => {
    const confirmDelete = window.confirm(`Delete "${service.name}"?`);

    if (confirmDelete) {
      console.log("Delete", service);
    }
  };

  return (
    <section className="grid gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">Manage all salon services</p>

          <h1 className="mt-1 text-3xl font-black text-stone-900">Services</h1>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700 active:scale-95"
        >
          <FiPlus size={18} />
          Add Service
        </button>
      </div>

      {/* Services */}
      <div className="grid gap-5">
        {services.map((service) => {
          const assigned = STAFF.filter((member) =>
            service.staffIds.includes(member.id),
          );

          return (
            <article
              key={service.id}
              className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top */}
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex-1">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-700">
                    {service.category}
                  </span>

                  <h2 className="mt-3 text-2xl font-black text-stone-900">
                    {service.name}
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
                    {service.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {assigned.map((member) => (
                      <span
                        key={member.id}
                        className="flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700"
                      >
                        <FiUsers size={12} />
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black text-stone-900">
                    {formatCurrency(service.price)}
                  </p>

                  {service.duration && (
                    <div className="mt-2 flex items-center justify-end gap-1 text-sm text-stone-500">
                      <FiClock />
                      {service.duration} min
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 border-t border-stone-200"></div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  <FiEdit2 />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(service)}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
