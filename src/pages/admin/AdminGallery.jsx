import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiImage,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { getStatusColor } from "../../utils/getStatusColor";
import Modal from "../../components/common/Modal";
import GalleryForm from "../../components/forms/GalleryForm";

const galleryImages = [
  {
    id: 1,
    title: "Modern Hair Styling",
    category: "Hair",
    status: "Active",
    uploadedAt: "10 Jul 2026",
    image: "https://picsum.photos/600/500?random=1",
  },
  {
    id: 2,
    title: "Luxury Facial Room",
    category: "Facial",
    status: "Active",
    uploadedAt: "09 Jul 2026",
    image: "https://picsum.photos/600/500?random=2",
  },
  {
    id: 3,
    title: "Salon Interior",
    category: "Salon",
    status: "Inactive",
    uploadedAt: "08 Jul 2026",
    image: "https://picsum.photos/600/500?random=3",
  },
  {
    id: 4,
    title: "Professional Makeup",
    category: "Makeup",
    status: "Active",
    uploadedAt: "07 Jul 2026",
    image: "https://picsum.photos/600/500?random=4",
  },
  {
    id: 5,
    title: "Massage Therapy",
    category: "Massage",
    status: "Active",
    uploadedAt: "05 Jul 2026",
    image: "https://picsum.photos/600/500?random=5",
  },
  {
    id: 6,
    title: "Nail Art",
    category: "Nails",
    status: "Inactive",
    uploadedAt: "03 Jul 2026",
    image: "https://picsum.photos/600/500?random=6",
  },
];

export default function AdminGallery() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="space-y-6">
      {/* Header */}
      <Modal
        open={open}
        title={selectedImage ? "Edit Image" : "Add Image"}
        onClose={() => setOpen(false)}
      >
        <GalleryForm image={selectedImage} />
      </Modal>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-black text-stone-900">
            Salon Gallery
          </h1>

          <p className="mt-2 text-stone-500">
            Manage gallery images displayed on your website.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedImage(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          <FiPlus />
          Upload Images
        </button>
      </div>

      {/* Statistics */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Total Images</p>

          <h2 className="mt-2 text-3xl font-black">48</h2>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Active</p>

          <h2 className="mt-2 text-3xl font-black text-green-600">42</h2>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">Hidden</p>

          <h2 className="mt-2 text-3xl font-black text-red-600">6</h2>
        </div>
      </div>

      {/* Search */}

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />

            <input
              type="text"
              placeholder="Search image..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-stone-300 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
            />
          </div>

          <select className="rounded-lg border border-stone-300 px-4 py-3">
            <option>All Categories</option>
            <option>Hair</option>
            <option>Facial</option>
            <option>Massage</option>
            <option>Salon</option>
            <option>Makeup</option>
            <option>Nails</option>
          </select>

          <select className="rounded-lg border border-stone-300 px-4 py-3">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Gallery */}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image */}

            <div className="relative overflow-hidden">
              <img
                src={image.image}
                alt={image.title}
                className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Overlay */}

              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition group-hover:opacity-100">

                <button
                  onClick={() => {
                    setSelectedImage(image);
                    setOpen(true);
                  }}
                  className="rounded-full bg-white p-3 text-stone-700 hover:bg-blue-600 hover:text-white">
                  <FiEdit2 />
                </button>

                <button className="rounded-full bg-white p-3 text-stone-700 hover:bg-red-600 hover:text-white">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            {/* Card Body */}

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {image.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    image.status,
                  )}`}
                >
                  {image.status}
                </span>
              </div>

              <h3 className="line-clamp-1 text-lg font-bold text-stone-900">
                {image.title}
              </h3>

              <p className="text-sm text-stone-500">
                Uploaded: {image.uploadedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
