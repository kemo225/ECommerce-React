import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  PenTool, 
  HelpCircle, 
  Tag, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeContext } from '../../context/themeContext';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/dashboard/admindashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/trips', label: 'Trips', icon: ClipboardList },
  { to: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { to: '/dashboard/blogs', label: 'Blogs', icon: PenTool },
  { to: '/dashboard/questions', label: 'FAQs', icon: HelpCircle },
  { to: '/dashboard/promo-codes', label: 'Promo Codes', icon: Tag },
  { to: '/dashboard/users', label: 'Users', icon: Users },
  { to: '/dashboard/images', label: 'Images', icon: ImageIcon },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ color: 'var(--light-grey)', fontSize: 13 }}>Admin</span>
      {parts.map((p, idx) => (
        <span key={p} style={{ color: idx === parts.length - 1 ? 'var(--charcoal)' : 'var(--light-grey)', fontWeight: idx === parts.length - 1 ? 600 : 500 }}>
          {p.replace(/-/g, ' ')}
          {idx === parts.length - 1 ? '' : ' / '}
        </span>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const themeCtx = ThemeContext._currentValue; // fallback if context not wired (should be via provider)
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const activeItem = useMemo(() => {
    const path = location.pathname;
    return navItems.find((i) => path === i.to || path.startsWith(i.to + '/')) ?? null;
  }, [location.pathname]);

  const theme = themeCtx?.theme ?? 'light';
  const toggleTheme = themeCtx?.toggleTheme ?? (() => {});

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.layout}>
      <div className={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className={styles.mobileOnly}
              type="button"
              aria-label="Open sidebar"
              onClick={() => setMobileOpen(true)}
              style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)' }}
            >
              <Menu />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <strong style={{ fontSize: 14, color: 'var(--charcoal)' }}>{activeItem?.label ?? 'Dashboard'}</strong>
              <span style={{ fontSize: 12, color: 'var(--light-grey)' }}>
                {user?.fullName || user?.name || user?.email || 'Admin'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border-light)', background: 'var(--bg-card)', color: 'var(--charcoal)' }}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: 'none',
                background: 'var(--gold-primary)',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className={styles.shell}>
        <aside className={mobileOpen ? `${styles.sidebar} ${styles.sidebarCollapsed}` : styles.sidebar} style={{ transform: mobileOpen ? 'translateX(0)' : undefined }}>
          <nav style={{ padding: 16 }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 12px',
                        borderRadius: 12,
                        border: '1px solid transparent',
                        background: isActive ? 'var(--gold-surface)' : 'transparent',
                        color: isActive ? 'var(--charcoal)' : 'var(--body-text)',
                        fontWeight: isActive ? 700 : 500,
                      })}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className={styles.content}>
          <Breadcrumbs />
          <Outlet />
        </main>

        {mobileOpen ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--bg-overlay)',
              zIndex: 40,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
