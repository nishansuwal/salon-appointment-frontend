import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Button from "../../components/common/Button";
import ServiceCard from "../../components/ServiceCard";
import { Filter, X, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchActiveServices } from "../../store/apps/user/userServices";
import { fetchMainCategories } from "../../store/apps/public/categories";
import { fetchRecords as fetchStaff } from "../../store/apps/public/staffs";

export default function Services() {
  const dispatch = useDispatch();

  // =========================================================
  // Filters
  // =========================================================
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [searchParams] = useSearchParams();

  // =========================================================
  // Pagination
  // =========================================================
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categorySlug = searchParams.get("category");
  const staffIdFromUrl = searchParams.get("staff");

  // =========================================================
  // Mobile Filter
  // =========================================================
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // =========================================================
  // Redux
  // =========================================================
  const serviceStore = useSelector((state) => state.userServices);

  const staffs = useSelector((state) => state.staffs.data?.data);

  const mainCategories = useSelector(
    (state) => state.categories.mainCategories,
  );

  const services = Array.isArray(serviceStore?.activeServices)
    ? serviceStore?.activeServices
    : [];

  const categories = Array.isArray(mainCategories)
    ? mainCategories
    : Array.isArray(mainCategories)
      ? mainCategories
      : [];

  const pagination = {
    currentPage: Number(serviceStore?.currentPage ?? 1),
    lastPage: Number(serviceStore?.lastPage ?? 1),
    total: Number(serviceStore?.total ?? 0),
    perPage: Number(serviceStore?.perPage ?? pageSize),
    from: Number(serviceStore?.from ?? 0),
    to: Number(serviceStore?.to ?? 0),
  };

  const categoryId = categorySlug
    ? (categories.find((cat) => cat.slug === categorySlug)?.id ?? null)
    : selectedCategoryId;

  const staffId = staffIdFromUrl ? Number(staffIdFromUrl) : selectedStaffId;

  // =========================================================
  // Fetch Services
  // =========================================================
  useEffect(() => {
    const params = {
      page,
      pageSize,
      searchValue: searchValue || undefined,
      categoryId: categoryId || undefined,
      staffId: staffId || undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      sortBy,
    };
    dispatch(fetchStaff());
    dispatch(fetchActiveServices(params));
  }, [
    dispatch,
    page,
    pageSize,
    searchValue,
    categoryId,
    staffId,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  useEffect(() => {
    dispatch(fetchMainCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setPage(1);
  };

  const handleCategory = (id) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const handleStaff = (id) => {
    setSelectedStaffId(id);
    setPage(1);
  };

  const handleMinPrice = (value) => {
    setMinPrice(value);
    setPage(1);
  };

  const handleMaxPrice = (value) => {
    setMaxPrice(value);
    setPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageSize = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const goToPage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > pagination.lastPage ||
      pageNumber === pagination.currentPage
    ) {
      return;
    }

    setPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // Previous Page
  // =========================================================
  const handlePrevious = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  };

  // =========================================================
  // Next Page
  // =========================================================
  const handleNext = () => {
    if (pagination.currentPage < pagination.lastPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setSelectedCategoryId(null);
    setSelectedStaffId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy("latest");
    setPage(1);
  };

  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileFilterOpen]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 sm:py-10">
        {/* =====================================================
            Header
        ===================================================== */}
        <div className="mb-6 max-w-3xl sm:mb-8">
          <p className="text-sm font-bold uppercase tracking-wide text-rose-600">
            Services
          </p>

          <h1 className="mt-1 text-2xl font-black text-stone-950 sm:mt-2 sm:text-3xl lg:text-4xl">
            Choose a service, then pick your specialist
          </h1>

          <p className="mt-2 text-sm text-stone-600 sm:mt-3 sm:text-base">
            Each salon service is connected to the staff trained to provide it.
          </p>
        </div>

        {/* =====================================================
            Search + Sort
        ===================================================== */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              type="text"
              placeholder="Search services..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 focus:border-stone-500 focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
            <option value="discount_high">Discount: High to Low</option>
            <option value="discount_low">Discount: Low to High</option>
          </select>
        </div>

        {/* =====================================================
            Mobile Filter Button
        ===================================================== */}
        <div className="mb-4 lg:hidden">
          <Button
            onClick={() => setMobileFilterOpen(true)}
            className="flex w-full items-center justify-center gap-2"
          >
            <Filter size={18} />
            Filter Services
            {pagination.total > 0 && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {pagination.total}
              </span>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* ===================================================
              Desktop Filters
          =================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-lg border border-stone-200 bg-white p-5">
              <FilterContent
                categories={categories}
                categoryId={categoryId}
                setCategoryId={handleCategory}
                staffs={staffs}
                staffId={staffId}
                setStaffId={handleStaff}
                minPrice={minPrice}
                setMinPrice={handleMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={handleMaxPrice}
              />
            </div>
          </aside>

          {/* ===================================================
              Mobile Filter Overlay
          =================================================== */}
          {mobileFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                onClick={() => setMobileFilterOpen(false)}
              />

              <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-2xl bg-white shadow-2xl lg:hidden">
                <div className="flex items-center justify-between border-b border-stone-200 p-4">
                  <h2 className="text-lg font-black text-stone-900">Filters</h2>

                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="rounded-full p-2 transition hover:bg-stone-100"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 pb-6">
                  <FilterContent
                    categories={categories}
                    categoryId={categoryId}
                    setCategoryId={handleCategory}
                    staffs={staffs}
                    staffId={staffId}
                    setStaffId={handleStaff}
                    minPrice={minPrice}
                    setMinPrice={handleMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={handleMaxPrice}
                    onApply={() => setMobileFilterOpen(false)}
                    isMobile
                  />
                </div>
              </div>
            </>
          )}

          {/* ===================================================
              Services
          =================================================== */}
          <div>
            {/* Results Information */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stone-500">
                {pagination.total === 0 ? (
                  "No services found"
                ) : (
                  <>
                    <span className="font-semibold text-stone-700">
                      {pagination.total}
                    </span>{" "}
                    services
                  </>
                )}
              </p>

              {/* Page Size */}
              {pagination.total > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">Show</span>

                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSize(e.target.value)}
                    className="rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-sm font-medium text-stone-700 focus:border-stone-500 focus:outline-none"
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>

                  <span className="text-sm text-stone-500">per page</span>
                </div>
              )}
            </div>

            {/* No Services */}
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-white p-12 text-center">
                <p className="text-lg font-semibold text-stone-700">
                  No services found
                </p>

                <p className="mt-2 text-sm text-stone-500">
                  Try adjusting your filters
                </p>

                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {/* =================================================
                    Service Grid
                ================================================= */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      staff={service.staff ?? []}
                    />
                  ))}
                </div>

                {/* =================================================
                    Pagination
                ================================================= */}
                {pagination.lastPage > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                    onPageChange={goToPage}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// =============================================================
// Filter Content
// =============================================================

function FilterContent({
  categories = [],
  categoryId,
  setCategoryId,
  staffs = [],
  staffId,
  setStaffId,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApply,
  isMobile = false,
}) {
  console.log(staffs, categories);
  return (
    <div>
      {/* =======================================================
          Category
      ======================================================= */}
      <div>
        <h3 className="mb-3 font-black text-stone-900">Categories</h3>

        <div className="space-y-2">
          {/* All */}
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={categoryId === null}
              onChange={() => setCategoryId(null)}
              className="h-4 w-4 cursor-pointer accent-stone-900"
            />

            <span
              className={`text-sm font-semibold ${
                categoryId === null
                  ? "text-stone-900"
                  : "text-stone-600 group-hover:text-stone-900"
              }`}
            >
              All
            </span>
          </label>

          {/* Main Categories */}
          {categories.map((item) => (
            <label
              key={item.id}
              className="group flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="category"
                checked={categoryId === item.id}
                onChange={() => setCategoryId(item.id)}
                className="h-4 w-4 cursor-pointer accent-stone-900"
              />

              <span
                className={`text-sm font-semibold ${
                  categoryId === item.id
                    ? "text-stone-900"
                    : "text-stone-600 group-hover:text-stone-900"
                }`}
              >
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-black text-stone-900">Staff Specialists</h3>

        <div className="space-y-2">
          {/* All Staff */}
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="staff"
              checked={staffId === null}
              onChange={() => setStaffId(null)}
              className="h-4 w-4 cursor-pointer accent-stone-900"
            />

            <span
              className={`text-sm font-semibold ${
                staffId === null
                  ? "text-stone-900"
                  : "text-stone-600 group-hover:text-stone-900"
              }`}
            >
              All Staff
            </span>
          </label>

          {/* Staff List */}
          {staffs.map((staffMember) => (
            <label
              key={staffMember.id}
              className="group flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="staff"
                checked={staffId === staffMember.id}
                onChange={() => setStaffId(staffMember.id)}
                className="h-4 w-4 cursor-pointer accent-stone-900"
              />

              <span
                className={`text-sm font-semibold ${
                  staffId === staffMember.id
                    ? "text-stone-900"
                    : "text-stone-600 group-hover:text-stone-900"
                }`}
              >
                {staffMember.user.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* =======================================================
          Price Range
      ======================================================= */}
      <div className="mt-6">
        <h3 className="mb-3 font-black text-stone-900">Price Range</h3>

        <div className="flex gap-3">
          {/* Min */}
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500">Min</label>

            <input
              type="number"
              placeholder="0"
              min="0"
              value={minPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                setMinPrice(value === "" ? null : Number(value));
              }}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          {/* Max */}
          <div className="flex-1">
            <label className="text-xs font-medium text-stone-500">Max</label>

            <input
              type="number"
              placeholder="Any"
              min="0"
              value={maxPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                setMaxPrice(value === "" ? null : Number(value));
              }}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>
        </div>
      </div>

      {/* =======================================================
          Mobile Apply
      ======================================================= */}
      {isMobile && onApply && (
        <div className="mt-6">
          <Button onClick={onApply} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================
// Pagination Component
// =============================================================

function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  onPrevious,
  onNext,
}) {
  const getPageNumbers = () => {
    // Small number of pages
    if (lastPage <= 7) {
      return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = [];

    // Near beginning
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", lastPage];
    }

    // Near end
    if (currentPage >= lastPage - 3) {
      return [
        1,
        "...",
        lastPage - 4,
        lastPage - 3,
        lastPage - 2,
        lastPage - 1,
        lastPage,
      ];
    }

    // Middle
    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      lastPage,
    );

    return pages;
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Results */}
      <p className="text-sm text-stone-500">
        Page <span className="font-semibold text-stone-700">{currentPage}</span>{" "}
        of <span className="font-semibold text-stone-700">{lastPage}</span>
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={onPrevious}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-sm text-stone-400"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`h-9 min-w-9 rounded-md px-2.5 text-sm font-semibold transition ${
                  currentPage === pageNumber
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <Button
          variant="secondary"
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
