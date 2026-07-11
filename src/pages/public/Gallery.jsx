import { useState } from "react";
import { X } from "lucide-react";
import { GALLERY_IMAGES } from "../../utils/galleryImages";
import Navbar from "../../components/layout/Navbar";

export default function Gallery() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <Navbar />
      <h1 className="mb-10 text-center text-4xl font-black">
        Our Gallery
      </h1>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {GALLERY_IMAGES.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveImage(img)}
            className="group cursor-pointer overflow-hidden rounded-lg"
          >
            <img
              src={img.src}
              alt={img.title}
              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Preview */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute right-6 top-6 text-white"
          >
            <X size={30} />
          </button>

          <img
            src={activeImage.src}
            alt={activeImage.title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}