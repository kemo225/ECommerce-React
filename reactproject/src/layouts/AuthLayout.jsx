import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f11' }}>
      <Outlet />
    </div>
  );
}
