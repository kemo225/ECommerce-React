import { useState } from 'react';
import ContactInfo from '../../components/ContactInfo/ContactInfo';
import Button from '../../components/Button/Button';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', destination: 'The Maldives', message: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Our concierge team will reach out within 24 hours.');
  };

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Connect With Us</h1>
          <p className={styles.heroSubtitle}>
            Your celestial journey begins with a single conversation. Our concierge team is
            ready to curate your next escape.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.formWrap}>
              <h2 className={styles.formTitle}>Send a Message</h2>
              <p className={styles.formSubtitle}>
                Fill out the form below and our travel specialists will reach out within 24 hours.
              </p>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Interested Destination</label>
                  <select name="destination" value={form.destination} onChange={handleChange}>
                    <option>The Maldives</option>
                    <option>Santorini, Greece</option>
                    <option>Tanzania Safari</option>
                    <option>Vietnam</option>
                    <option>Patagonia</option>
                    <option>Kyoto, Japan</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell us about your dream journey..." />
                </div>
                <Button type="submit" variant="primary" size="lg">Send Message</Button>
              </form>
            </div>

            <div className={styles.infoWrap}>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
