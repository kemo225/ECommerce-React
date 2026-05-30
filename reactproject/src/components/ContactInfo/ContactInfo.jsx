import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import styles from './ContactInfo.module.css';

export default function ContactInfo() {
  const info = [
    { icon: <HiOutlinePhone />, label: 'Phone', value: '+1 (800) 555-ETHEREAL' },
    { icon: <HiOutlineMail />, label: 'Email', value: 'concierge@etherealvoyages.com' },
    { icon: <HiOutlineLocationMarker />, label: 'Office', value: '72nd Celestial Way, Suite 400\nNew York, NY 10019' },
  ];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Contact Information</h2>
      <div className={styles.items}>
        {info.map((item, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.iconCircle}>{item.icon}</div>
            <div>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.whatsappCard}>
        <div className={styles.waInfo}>
          <FaWhatsapp className={styles.waIcon} />
          <div>
            <h4 className={styles.waTitle}>Instant Concierge</h4>
            <p className={styles.waDesc}>Chat with us on WhatsApp for immediate support.</p>
          </div>
        </div>
        <button className={styles.waBtn}>Open WhatsApp</button>
      </div>
    </div>
  );
}
