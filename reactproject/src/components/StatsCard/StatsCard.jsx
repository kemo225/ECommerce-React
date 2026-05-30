import styles from './StatsCard.module.css';

export default function StatsCard({ icon, value, label, trend }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}>{icon}</div>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
        {trend && <p className={`${styles.trend} ${trend > 0 ? styles.up : styles.down}`}>{trend > 0 ? '+' : ''}{trend}% from last month</p>}
      </div>
    </div>
  );
}
