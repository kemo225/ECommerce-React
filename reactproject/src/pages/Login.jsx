import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import styles from './AuthPages.module.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const errors = useMemo(() => validateLoginForm(form), [form]);
  const redirectTo = typeof location.state?.from === 'string' ? location.state.from : '/dashboard/admindashboard';

  const loginMutation = useMutation({
    mutationFn: () => authService.login({ email: form.email.trim(), password: form.password }),
    onSuccess: (session) => {
      login({ ...session, rememberMe: form.rememberMe });
      toast.success('Login successful.');
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    loginMutation.mutate();
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to your dashboard."
      footer={
        <p className={styles.mutedText}>
          Need a reset link?{' '}
          <Link to="/forgot-password" className={styles.helperLink}>
            Forgot Password
          </Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <AuthField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ''}
        />

        <AuthField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : ''}
        />

        <div className={styles.inlineRow}>
          <label className={styles.checkboxLabel} htmlFor="rememberMe">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className={styles.checkboxInput}
              checked={form.rememberMe}
              onChange={handleChange}
            />
            Remember Me
          </label>

          <Link to="/forgot-password" className={styles.helperLink}>
            Forgot Password?
          </Link>
        </div>

        {loginMutation.isError ? (
          <p className={styles.errorBanner}>{loginMutation.error.message}</p>
        ) : null}

        <button type="submit" className={styles.submitBtn} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  );
}

