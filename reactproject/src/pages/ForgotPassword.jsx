import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField from '../components/auth/AuthField';
import { authService } from '../services/auth.service';
import styles from './AuthPages.module.css';
import { useNavigate } from 'react-router-dom';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForgotPasswordForm = ({ email }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
};

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: '' });
  const [touched, setTouched] = useState({ email: false });
  const [submitted, setSubmitted] = useState(false);

      const navigate = useNavigate();

  const errors = useMemo(() => validateForgotPasswordForm(form), [form]);

  const forgotPasswordMutation = useMutation({
    mutationFn: () => authService.forgotPassword({ email: form.email.trim() }),
    onSuccess: (response) => {
      setSubmitted(true);
      const successMessage =
        typeof response?.message === 'string' && response.message.trim()
          ? response.message
          : 'If this email exists, reset instructions were sent successfully.';
      toast.success(successMessage);
      navigate('/reset-password');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (event) => {
    setForm({ email: event.target.value });
  };

  const handleBlur = () => {
    setTouched({ email: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({ email: true });

    if (Object.keys(errors).length > 0) {
      return;
    }

    forgotPasswordMutation.mutate();
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we will send reset instructions."
      footer={
        <p className={styles.mutedText}>
          Remembered your password?{' '}
          <Link to="/login" className={styles.helperLink}>
            Back to Login
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

        {submitted ? (
          <p className={styles.successBox}>
            If an account matches this email, check your inbox for reset instructions.
          </p>
        ) : null}

        {forgotPasswordMutation.isError ? (
          <p className={styles.errorBanner}>{forgotPasswordMutation.error.message}</p>
        ) : null}

        <button type="submit" className={styles.submitBtn} disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>


    </AuthLayout>
  );
}

