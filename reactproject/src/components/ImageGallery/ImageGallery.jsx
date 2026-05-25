import styles from './ImageGallery.module.css';

export default function ImageGallery({ images, showButton = true }) {
  if (!images || images.length === 0) return null;
  const display = images.slice(0, 4);

  return (
    <div className={styles.gallery}>
      {display.map((img, i) => (
        <div key={i} className={`${styles.cell} ${styles[`cell${i + 1}`]}`}>
          <img src={img} alt={`Gallery ${i + 1}`} className={styles.img} loading="lazy" />
        </div>
      ))}
      {showButton && (
        <button className={styles.viewAll}>View All Photos</button>
      )}
    </div>
  );
}
