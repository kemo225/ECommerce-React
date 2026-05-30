import styles from './ItineraryTimeline.module.css';

export default function ItineraryTimeline({ itinerary }) {
  return (
    <div className={styles.timeline}>
      {itinerary.map((item, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.marker}>
            <span className={styles.dot} />
            {i < itinerary.length - 1 && <span className={styles.line} />}
          </div>
          <div className={styles.content}>
            <span className={styles.day}>DAY {String(item.day).padStart(2, '0')}</span>
            <h4 className={styles.title}>{item.title}</h4>
            <p className={styles.desc}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
