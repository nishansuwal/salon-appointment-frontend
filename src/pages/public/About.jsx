import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { SALON, STAFF } from "../../utils/constants";
import StaffCard from "../../components/StaffCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { fetchRecords as fetchSetting } from "../../store/apps/public/settings";
import { fetchRecords as fetchStaff } from "../../store/apps/public/staffs";

export default function About() {
  const dispatch = useDispatch();
  const staffs = useSelector((state) => state.staffs.data?.data);

  const settings = useSelector((state) => state.settings.data);

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchSetting());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
              About
            </p>
            <h1 className="mt-2 text-4xl font-black text-stone-950">
              {settings?.title}
            </h1>
            <p className="mt-4 leading-7 text-stone-600">
              {settings?.description}
            </p>
          </div>
          <div className="grid gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-bold text-stone-950">Location</p>
              <p className="text-stone-600">{settings?.address}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">Opening hours</p>
              <p className="text-stone-600">
                {settings?.opening_time}-{settings?.closing_time}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-950">Contact</p>
              <p className="text-stone-600">{settings?.phone}</p>
              <p className="text-stone-600">{settings?.email}</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black text-stone-950">Salon staff</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {staffs?.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
