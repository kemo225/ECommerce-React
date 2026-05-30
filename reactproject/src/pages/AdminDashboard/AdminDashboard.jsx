import { HiOutlineGlobe, HiOutlineClipboardList, HiOutlineStar, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import StatsCard from '../../components/StatsCard/StatsCard';
import { trips } from '../../data/trips';
import { useAuth } from '../../hooks/useAuth';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const displayName =
    user?.fullName || user?.name || user?.userName || user?.email || 'Administrator';

  const stats = [
    { icon: <HiOutlineGlobe />, value: trips.length, label: 'Total Trips', trend: 12 },
    { icon: <HiOutlineClipboardList />, value: '284', label: 'Total Bookings', trend: 8 },
    { icon: <HiOutlineStar />, value: '4.8', label: 'Avg Rating', trend: 2 },
  ];

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {displayName}. Manage your voyages and monitor performance.</p>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>

        {/* Trips Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Existing Voyages</h2>
            <button className={styles.addBtn}>+ Add New Trip</button>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trip Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td>
                      <div className={styles.tripCell}>
                        <img src={trip.image} alt={trip.title} className={styles.tripThumb} />
                        <span className={styles.tripName}>{trip.title}</span>
                      </div>
                    </td>
                    <td>{trip.duration}</td>
                    <td>${trip.price.toLocaleString()}</td>
                    <td>{trip.rating}</td>
                    <td>
                      <span className={`${styles.badge} ${trip.badge ? styles.badgeDraft : styles.badgeActive}`}>
                        {trip.badge ? 'Featured' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} title="View"><HiOutlineEye /></button>
                        <button className={styles.actionBtn} title="Edit"><HiOutlinePencil /></button>
                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete"><HiOutlineTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
