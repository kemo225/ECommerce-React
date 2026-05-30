import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <h2 className={styles.title}>Subscribe to the Ethereal Ledger</h2>
          <p className={styles.subtitle}>
            Curated stories and priority access to limited expedition releases, delivered monthly to your inbox.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.btn}>Join</button>
        </form>
      </div>
    </section>
  );
}
