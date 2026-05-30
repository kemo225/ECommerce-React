import styles from './AuthLayout.module.css';

const highlights = [
  'JWT access + refresh token workflow',
  'Automatic token refresh with interceptor queue',
  'Protected routes with secure redirect handling',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className={styles.page}>
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.content}>
        <aside className={styles.brandPanel}>
          <span className={styles.badge}>Secure Access</span>
          <h2 className={styles.brandTitle}>Ethereal Voyages</h2>
          <p className={styles.brandSubtitle}>
            Production-ready authentication experience for your admin workflows.
          </p>

         
        </aside>

        <div className={styles.card}>
          <header className={styles.cardHeader}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </header>

          {children}
          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

