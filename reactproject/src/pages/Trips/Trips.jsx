import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTrips } from '../../hooks/useTrips';
import TripCard from '../../components/TripCard/TripCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import { TripCardSkeleton } from '../../components/ui/Loading';
import ErrorComponent from '../../components/ui/Error';
import Pagination from '../../components/pagination/Pagination';
import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';
import styles from './Trips.module.css';

export default function Trips() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 6,
    search: '',
    typeId: '',
    minPrice: '',
    maxPrice: '',
    includeInactive: false,
    sortBy: 'newest',
  });

  const { data, isLoading, isError, error, refetch } = useTrips(filters);

  // Safely extract trips list & totalPages supporting both paginated and flat-array layouts
  const rawData = data?.data ?? [];
  const tripsList = Array.isArray(rawData) ? rawData : (rawData?.items || []);
  const totalPages = Array.isArray(rawData) ? 1 : (rawData?.totalPages || 1);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setFilters((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{t('navTrips')}</h1>
          <p className={styles.subtitle}>
            Discover exclusive destinations designed for the discerning traveler.
          </p>
        </div>

        <div className={styles.layout}>
          <FilterSidebar filters={filters} onFilterChange={setFilters} />

          <div className="flex-grow-1">
            {/* Sorting Controls */}
            <div className={`d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 ${styles.controls}`}>
              <div className="text-muted small">
                {tripsList.length > 0 && `Showing ${tripsList.length} trips`}
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm ${filters.sortBy === 'price-asc' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('price-asc')}
                  title="Price: Low to High"
                >
                  Price <HiOutlineArrowUp size={14} />
                </button>
                <button
                  className={`btn btn-sm ${filters.sortBy === 'price-desc' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('price-desc')}
                  title="Price: High to Low"
                >
                  Price <HiOutlineArrowDown size={14} />
                </button>
                <button
                  className={`btn btn-sm ${filters.sortBy === 'newest' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleSortChange('newest')}
                  title="Newest First"
                >
                  Newest
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="col">
                    <TripCardSkeleton />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <ErrorComponent 
                message={error?.response?.data?.message || error?.message} 
                onRetry={refetch} 
              />
            ) : tripsList.length === 0 ? (
              <div className={styles.empty}>
                <p className="text-muted fs-5">{t('noTrips')}</p>
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {tripsList.map((trip) => (
                    <div key={trip.id} className="col">
                      <TripCard trip={trip} />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  pageSize={filters.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
