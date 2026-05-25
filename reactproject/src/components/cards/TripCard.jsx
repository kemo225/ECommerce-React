import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineMapPin, HiOutlineCalendar, HiOutlineTag } from 'react-icons/hi2';
import { useLanguage } from '../../context/LanguageContext';

const TripCard = React.memo(({ trip }) => {
  const { language, t } = useLanguage();

  // Find the primary image or use the first available, or fallback to a placeholder
  const primaryImage = trip.images?.find(img => img.isPrimary)?.imageUrl 
    || trip.images?.[0]?.imageUrl 
    || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

  // Support localizations if fields are translation objects, else display as string
  const getName = () => {
    if (typeof trip.name === 'object' && trip.name !== null) {
      return trip.name[language] || trip.name.en || '';
    }
    return trip.name || '';
  };

  const getDestination = () => {
    if (typeof trip.destination === 'object' && trip.destination !== null) {
      return trip.destination[language] || trip.destination.en || '';
    }
    return trip.destination || '';
  };

  const getDescription = () => {
    let desc = '';
    if (typeof trip.description === 'object' && trip.description !== null) {
      desc = trip.description[language] || trip.description.en || '';
    } else {
      desc = trip.description || '';
    }
    return desc.length > 90 ? desc.substring(0, 90) + '...' : desc;
  };

  const getDaysBadge = (dayIndex) => {
    const daysMap = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    };
    return daysMap[dayIndex] || dayIndex;
  };

  return (
    <div className="card h-100 border-0 shadow-lg overflow-hidden trip-card position-relative" style={{
      borderRadius: '16px',
      background: 'rgba(30, 30, 38, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      {/* Badge for Trip Type */}
      <span className="badge bg-primary bg-opacity-75 position-absolute top-0 start-0 m-3 px-3 py-2 z-3 rounded-pill" style={{ fontSize: '0.75rem', backdropFilter: 'blur(5px)' }}>
        <HiOutlineTag className="me-1" />
        {trip.tripTypeName || 'General'}
      </span>

      {/* Image Wrap */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img 
          src={primaryImage} 
          alt={getName()} 
          className="w-100 h-100 object-fit-cover trip-card-img" 
          loading="lazy"
          style={{ transition: 'transform 0.5s ease' }}
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t" style={{
          background: 'linear-gradient(to top, rgba(15, 15, 20, 0.9), transparent)',
        }}>
          <div className="d-flex align-items-center text-white-50 small">
            <HiOutlineMapPin className="text-primary me-1" />
            <span className="fw-semibold text-light">{getDestination()}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-4 d-flex flex-column text-white">
        <h5 className="card-title fw-bold mb-2 text-truncate-2" style={{ fontSize: '1.2rem', lineHeight: '1.4' }}>
          {getName()}
        </h5>
        
        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.85rem' }}>
          {getDescription()}
        </p>

        {/* Available Days and Time */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-1 mb-2">
            {trip.availableDays && trip.availableDays.length > 0 ? (
              trip.availableDays.map((day, idx) => (
                <span key={idx} className="badge bg-secondary bg-opacity-25 text-white-50 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  {getDaysBadge(day)}
                </span>
              ))
            ) : (
              <span className="badge bg-secondary bg-opacity-25 text-white-50 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                Daily
              </span>
            )}
          </div>
          {trip.timeFrom && (
            <div className="text-white-50 small d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
              <HiOutlineCalendar className="me-1 text-primary" />
              <span>{t('timeFrom')}: {trip.timeFrom}</span>
            </div>
          )}
        </div>

        {/* Meta Info: Duration / Time */}
        <div className="d-flex align-items-center justify-content-between mb-4 border-top border-secondary border-opacity-25 pt-3">
          <div className="d-flex align-items-center text-white-50 small">
            <HiOutlineClock className="text-primary me-1" />
            <span>{trip.durationValue} {trip.durationTypeName || 'Days'}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <div>
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{t('adultPrice')}</div>
            <div className="fw-bold text-success" style={{ fontSize: '1.25rem' }}>
              ${trip.adultPrice ?? 0}
            </div>
          </div>
          <div className="text-end">
            <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{t('childPrice')}</div>
            <div className="fw-bold text-info" style={{ fontSize: '1.1rem' }}>
              ${trip.childPrice ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Button link */}
      <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
        <Link 
          to={`/trips/${trip.id}`} 
          className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center py-2"
          style={{ 
            fontWeight: '600', 
            transition: 'background 0.3s, transform 0.2s',
            boxShadow: '0 4px 15px rgba(10, 110, 255, 0.3)'
          }}
        >
          {t('bookNow')}
        </Link>
      </div>
    </div>
  );
});

export default TripCard;
