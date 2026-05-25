import StarRating from '../StarRating/StarRating';
import styles from './TestimonialCard.module.css';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className={styles.card}>
      <StarRating rating={testimonial.rating} showValue={false} size="md" />
      <p className={styles.text}>"{testimonial.text}"</p>
      <p className={styles.author}>{testimonial.name}</p>
    </div>
  );
}
