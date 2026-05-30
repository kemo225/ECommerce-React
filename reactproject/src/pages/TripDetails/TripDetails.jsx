import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useTrip } from '../../hooks/useTrips';
import ImageGallery from '../../components/ImageGallery/ImageGallery';
import StarRating from '../../components/StarRating/StarRating';
import ItineraryTimeline from '../../components/ItineraryTimeline/ItineraryTimeline';
import BookingCard from '../../components/BookingCard/BookingCard';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';
import { TripDetailsSkeleton } from '../../components/ui/Loading';
import ErrorComponent from '../../components/ui/Error';
import styles from './TripDetails.module.css';

export default function TripDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { data, isLoading, isError, error, refetch } = useTrip(id);

  const trip = data?.data ?? data;

  if (isLoading) {
    return <TripDetailsSkeleton />;
  }

  if (isError) {
    return (
      <main className={styles.page}>
        <div className="container py-5">
          <ErrorComponent 
            message={error?.response?.data?.message || error?.message} 
            onRetry={refetch} 
          />
          <div className="text-center mt-3">
            <Link to="/trips" className="btn btn-outline-light rounded-pill">
              {t('backToTrips')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className={styles.page}>
        <div className="container py-5 text-center text-white">
          <p className="fs-5 mb-4">Trip not found.</p>
          <Link to="/trips" className="btn btn-primary rounded-pill px-4">
            {t('backToTrips')}
          </Link>
        </div>
      </main>
    );
  }

  // Gracefully handle potentially missing lists from API
  const gallery = Array.isArray(trip.gallery) && trip.gallery.length > 0 
    ? trip.gallery 
    : [trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'];

  const highlights = Array.isArray(trip.highlights) ? trip.highlights : [];
  const includes = Array.isArray(trip.includes) ? trip.includes : [];
  const excludes = Array.isArray(trip.excludes) ? trip.excludes : [];
  const whatToBring = Array.isArray(trip.whatToBring) ? trip.whatToBring : [];
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  const testimonials = Array.isArray(trip.testimonials) ? trip.testimonials : [];

  return (
    <main className={styles.page}>
      <div className="container">
        <Link to="/trips" className={styles.back}>
          <HiArrowLeft /> {t('backToTrips')}
        </Link>

        {/* Gallery */}
        <ImageGallery images={gallery} />

        {/* Content + Sidebar */}
        <div className={styles.layout}>
          <div className={styles.content}>
            {/* Overview */}
            <div className={styles.overview}>
              <span className={styles.tag}>{trip.badge || 'EXCLUSIVE CURATED TRIP'}</span>
              <h1 className={styles.title}>{trip.title}</h1>
              <div className={styles.ratingRow}>
                <StarRating rating={trip.rating || 5} size="lg" />
                {trip.reviewCount !== undefined && (
                  <span className={styles.reviews}>({trip.reviewCount} reviews)</span>
                )}
              </div>
              <p className={styles.desc}>{trip.description}</p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('highlights')}</h2>
                <ul className={styles.checkList}>
                  {highlights.map((h, i) => (
                    <li key={i} className={styles.checkItem}>
                      <HiCheckCircle className={styles.checkIcon} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes */}
            {includes.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('includes')}</h2>
                <ul className={styles.checkList}>
                  {includes.map((item, i) => (
                    <li key={i} className={styles.checkItem}>
                      <HiCheckCircle className={styles.checkIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Excludes */}
            {excludes.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('excludes')}</h2>
                <ul className={styles.checkList}>
                  {excludes.map((item, i) => (
                    <li key={i} className={styles.checkItem}>
                      <HiCheckCircle className={styles.checkIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to Bring */}
            {whatToBring.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('whatToBring')}</h2>
                <ul className={styles.checkList}>
                  {whatToBring.map((item, i) => (
                    <li key={i} className={styles.checkItem}>
                      <HiCheckCircle className={styles.checkIcon} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>The Itinerary</h2>
                <ItineraryTimeline itinerary={itinerary} />
              </div>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Traveler Perspectives</h2>
                <div className={styles.testimonialGrid}>
                  {testimonials.map((t, i) => (
                    <TestimonialCard key={i} testimonial={t} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <aside className={styles.sidebar}>
            <BookingCard trip={trip} />
          </aside>
        </div>
      </div>
    </main>
  );
}
