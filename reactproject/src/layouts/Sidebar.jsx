import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Tags, 
  PenTool, 
  HelpCircle, 
  Calendar, 
  Percent, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  
  { path: '/dashboard/admindashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/trips', label: 'Trips', icon: Map },
  { path: '/dashboard/trip-types', label: 'Trip Types', icon: Tags },
  { path: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { path: '/dashboard/blogs', label: 'Blogs', icon: PenTool },
  { path: '/dashboard/questions', label: 'FAQs', icon: HelpCircle },
  { path: '/dashboard/promo-codes', label: 'Promo Codes', icon: Percent },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <aside 
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.header}>
          {!collapsed && <span className={styles.logo}>Admin Panel</span>}
          <button className={styles.toggleBtn} onClick={toggleSidebar}>
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    isActive 
                      ? `${styles.navItem} ${styles.navItemActive}` 
                      : styles.navItem
                  }
                  end={item.path === '/dashboard'}
                >
                  <item.icon className={styles.icon} />
                  <span className={styles.label}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      <button className={styles.mobileToggle} onClick={toggleMobile}>
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${mobileOpen ? styles.overlayActive : ''}`}
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}
