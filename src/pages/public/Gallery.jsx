import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GALLERY_IMAGES } from "../../utils/galleryImages";
import Navbar from "../../components/layout/Navbar";
4;

import { fetchRecords as fetchGallery } from "../../store/apps/public/images";
import { useDispatch, useSelector } from "react-redux";

const apiUrl = import.meta.env.VITE_API_URL_PUBLIC;

export default function Gallery() {
  const dispatch = useDispatch();

  const galleryImages = useSelector((state) => state.images.data);

  const [activeImage, setActiveImage] = useState(null);
  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white px-6">
      <Navbar />
      <h1 className="mb-10 text-center text-4xl font-black">Our Gallery</h1>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {galleryImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setActiveImage(img)}
            className="group cursor-pointer overflow-hidden rounded-lg"
          >
            <img
              src={`${apiUrl}/storage/${img.image}`}
              alt={img.title}
              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <h3 className="mt-2 text-4xl font-black text-stone-950">
              {img?.title}
            </h3>
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
