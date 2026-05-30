import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi';
import StarRating from '../StarRating/StarRating';
import styles from './TripCard.module.css';

export default function TripCard({ trip }) {
  const defaultImage = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
  
  return (
    <Link to={`/trips/${trip.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img 
          src={trip.image || defaultImage} 
          alt={trip.title} 
          className={styles.image} 
          loading="lazy" 
        />
        {trip.badge && <span className={styles.badge}>{trip.badge}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{trip.title}</h3>
          {trip.rating !== undefined && <StarRating rating={trip.rating || 5} size="sm" />}
        </div>
        <p className={styles.desc}>{trip.shortDescription || trip.description}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}><HiOutlineClock /> {trip.duration || 'Flexible'}</span>
          <span className={styles.metaItem}><HiOutlineUserGroup /> {trip.groupSize || 'Private'}</span>
        </div>
      </div>
    </Link>
  );
}

