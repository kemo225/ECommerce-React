import { Link } from 'react-router-dom';
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <h3 className={styles.logo}>Ethereal Voyages</h3>
          <p className={styles.tagline}>
            Curating celestial journeys for the discerning traveler since 2015.
            Every expedition is a masterpiece.
          </p>
          <div className={styles.socials}>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className={styles.socialIcon}><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn" className={styles.socialIcon}><FaLinkedinIn /></a>
          </div>
        </div>

        <div className={` ${styles.quickLinks}`}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.colList}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/trips">Destinations</Link></li>
            <li><Link to="/blog">Journal</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Experiences</h4>
          <ul className={styles.colList}>
            <li><Link to="/trips">Luxury Retreats</Link></li>
            <li><Link to="/trips">Safari Adventures</Link></li>
            <li><Link to="/trips">Cultural Journeys</Link></li>
            <li><Link to="/trips">Private Cruises</Link></li>
          </ul>
        </div>

        <div  className={styles.Padbottom}>
          <h4 className={styles.colTitle}>Contact</h4>
          <ul className={styles.colList}>
            <li className={styles.contactItem}>
              <HiOutlinePhone className={styles.contactIcon} />
              +1 (800) 555-ETHEREAL
            </li>
            <li className={styles.contactItem}>
              <HiOutlineMail className={styles.contactIcon} />
              concierge@etherealvoyages.com
            </li>
            <li className={styles.contactItem}>
              <HiOutlineLocationMarker className={styles.contactIcon} />
              72nd Celestial Way, Suite 400<br />New York, NY 10019
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Ethereal Voyages. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
