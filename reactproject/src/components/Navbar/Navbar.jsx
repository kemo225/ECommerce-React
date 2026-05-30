import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  HiOutlineGlobeAlt,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('navHome') },
    { to: '/trips', label: t('navTrips') },
    { to: '/blog', label: t('navBlog') },
    { to: '/contact', label: t('navContact') },
    ...(isAuthenticated ? [{ to: '/dashboard', label: t('navDashboard') }] : []),
  ];

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>Ethereal Voyages</Link>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''} mt-3`}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''} `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className={styles.mobileOnly}>
            {isAuthenticated ? (
              <button type="button" className={`${styles.bookBtnMobile} ${styles.logoutMobile}`} onClick={handleLogout}>
                {t('navLogout')}
              </button>
            ) : (
              <Link to="/login" className={styles.bookBtnMobile} onClick={() => setMenuOpen(false)}>{t('navLogin')}</Link>
            )}
          </li>
        </ul>

        <div className={styles.actions}>
          {/* Custom Language Selector */}
          <div className="d-flex align-items-center gap-1">
            <HiOutlineGlobeAlt className="text-white fs-5" />
            <select
              className="form-select form-select-sm bg-transparent text-white border-0 py-0"
              style={{ width: '70px', cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en" className="bg-dark text-white">EN</option>
              <option value="fr" className="bg-dark text-white">FR</option>
              <option value="ru" className="bg-dark text-white">RU</option>
              <option value="de" className="bg-dark text-white">DE</option>
            </select>
          </div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.bookBtn} aria-label="Dashboard">
                {t('navDashboard')}
              </Link>
              <button type="button" className={`${styles.bookBtn} ${styles.logoutBtn}`} onClick={handleLogout}>
                <HiOutlineLogout />
                {t('navLogout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.bookBtn}>
                {t('navLogin')}
              </Link>
              <Link to="/contact" className={styles.bookBtn}>{t('bookNow')}</Link>
            </>
          )}
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </nav>

      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}
    </header>
  );
}

