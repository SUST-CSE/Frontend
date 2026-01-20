'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyEmailMutation, useResendCodeMutation } from '@/features/auth/authApi';
import { Box, Container, Typography, TextField, Button, Alert, Stack, Paper } from '@mui/material';
import { Mail as LucideMail, CheckCircle2 as LucideCheckCircle } from 'lucide-react';
import Cookies from 'js-cookie';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get('email');

  const [email, setEmail] = useState(emailFromParams || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendCode, { isLoading: isResending }] = useResendCodeMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !code) {
      setError('Email and verification code are required');
      return;
    }

    if (code.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

   try {
      const result = await verifyEmail({ email, code }).unwrap();
      
      // Store tokens
      if (result.data.tokens) {
        Cookies.set('accessToken', result.data.tokens.accessToken);
        Cookies.set('refreshToken', result.data.tokens.refreshToken);
      }

      setSuccess('Email verified successfully! Redirecting...');
      
      // Redirect based on role
      setTimeout(() => {
        const role = result.data.user.role;
        if (role === 'STUDENT') {
          router.push('/dashboard/student');
        } else if (role === 'TEACHER') {
          router.push('/dashboard/teacher');
        } else if (role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }, 2000);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess('');

    if (!email) {
      setError('Email is required to resend code');
      return;
    }

    try {
      await resendCode({ email }).unwrap();
      setResendSuccess('Verification code has been resent to your email');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: 6, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', p: 3, borderRadius: '50%', bgcolor: '#f0fdf4', mb: 2 }}>
                <LucideMail size={48} color="#16a34a" />
              </Box>
              <Typography variant="h4" fontWeight={900} color="#0f172a" gutterBottom>
                Verify Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We&apos;ve sent a 6-digit code to your email. Enter it below to verify your account.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" icon={<LucideCheckCircle size={20} />} sx={{ borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            {resendSuccess && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {resendSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handleVerify}>
              <Stack spacing={3}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  disabled={!!emailFromParams}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  label="Verification Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  fullWidth
                  required
                  inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                  helperText="Enter the 6-digit code from your email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.5rem',
                      letterSpacing: '0.5rem',
                      textAlign: 'center',
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isVerifying || success !== ''}
                  sx={{
                    py: 1.5,
                    bgcolor: '#16a34a',
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#15803d',
                    },
                  }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Didn&apos;t receive the code?
                  </Typography>
                  <Button
                    onClick={handleResend}
                    disabled={isResending}
                    sx={{
                      color: '#16a34a',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    {isResending ? 'Resending...' : 'Resend Code'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
