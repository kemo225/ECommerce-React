import { HiCheckCircle } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './BookingCard.module.css';

export default function BookingCard({ trip }) {
  const priceDisplay = trip?.price !== undefined ? `$${trip.price.toLocaleString()}` : 'Flexible Price';
  const includesList = Array.isArray(trip?.includes) ? trip.includes : [];

  return (
    <div className={styles.card}>
      <div className={styles.priceRow}>
        <span className={styles.price}>{priceDisplay}</span>
        {trip?.price !== undefined && <span className={styles.per}> / per person</span>}
      </div>

      <div className={styles.includesList}>
        {includesList.map((item, i) => (
          <div key={i} className={styles.includeItem}>
            <HiCheckCircle className={styles.checkIcon} />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <button className={styles.whatsappBtn}>
        <FaWhatsapp className={styles.waIcon} />
        Book via WhatsApp
      </button>

      <p className={styles.note}>No immediate payment required for inquiry.</p>
    </div>
  );
}

