import { SALON } from "../../utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-stone-600 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-black text-stone-950">{SALON.name}</p>
          <p className="mt-2 max-w-sm">{SALON.tagline}</p>
        </div>
        <div>
          <p className="font-bold text-stone-950">Visit</p>
          <p className="mt-2">{SALON.address}</p>
          <p>{SALON.hours}</p>
        </div>
        <div>
          <p className="font-bold text-stone-950">Contact</p>
          <p className="mt-2">{SALON.phone}</p>
          <p>{SALON.email}</p>
        </div>
      </div>
    </footer>
  );
}
