import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import { authService } from '../services/auth.service';
import styles from './AuthPages.module.css';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateResetPasswordForm = ({ email, token, newPassword, confirmPassword }) => {
  const errors = {};


  if (!token.trim()) {
    errors.token = 'Reset token is required.';
  }
  if( token.length !==6) {
    {errors.token = 'Reset token must be 6 characters long.'}
  }
  if (!newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'New password must be at least 8 characters.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    token: searchParams.get('token') ?? '',
    newPassword: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    token: false,
    newPassword: false,
    confirmPassword: false,
  });

  const errors = useMemo(() => validateResetPasswordForm(form), [form]);

  const resetPasswordMutation = useMutation({
    mutationFn: () =>
      authService.resetPassword({
        token: form.token.trim(),
        newPassword: form.newPassword
      }),
    onSuccess: (response) => {
      const successMessage =
        typeof response?.message === 'string' && response.message.trim()
          ? response.message
          : 'Password reset successfully. Please login with your new password.';
      toast.success(successMessage);
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({
      token: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }

    resetPasswordMutation.mutate();
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Submit your reset token and choose a new password."
      footer={
        <p className={styles.mutedText}>
          Back to account access?{' '}
          <Link to="/login" className={styles.helperLink}>
            Login
          </Link>
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
  
        <AuthField
          id="token"
          name="token"
          type="text"
          label="Reset Token"
          placeholder="Paste the reset token"
          value={form.token}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.token ? errors.token : ''}
        />

        <AuthField
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.newPassword ? errors.newPassword : ''}
        />

        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
        />

        {resetPasswordMutation.isError ? (
          <p className={styles.errorBanner}>{resetPasswordMutation.error.message}</p>
        ) : null}

        <button type="submit" className={styles.submitBtn} disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}

