import { HiStar } from 'react-icons/hi';
import styles from './StarRating.module.css';

export default function StarRating({ rating = 5, showValue = true, size = 'md' }) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      <div className={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <HiStar key={i} className={i < Math.round(rating) ? styles.filled : styles.empty} />
        ))}
      </div>
      {showValue && <span className={styles.value}>{rating}</span>}
    </div>
  );
}
