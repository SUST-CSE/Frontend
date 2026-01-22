'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  Alert,
  CircularProgress
} from '@mui/material';
import { LucideMail, LucideArrowRight, LucideKeyRound } from 'lucide-react';
import { useForgotPasswordMutation } from '@/features/auth/authApi';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading, isSuccess, error }] = useForgotPasswordMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data).unwrap();
      // Redirect to reset password page with email in query param
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      console.error('Failed to send reset code:', err);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            textAlign: 'center'
          }}
        >
          <Box sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: '#f1f5f9', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}>
            <LucideKeyRound size={32} color="#0f172a" />
          </Box>
          
          <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            No worries! Enter your email and we'll send you a reset code.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
              {'data' in (error as any) ? (error as any).data.message : 'Something went wrong.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                placeholder="name@example.com"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <LucideMail size={20} color="#94a3b8" style={{ marginRight: 8 }} />
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <LucideArrowRight size={20} />}
                sx={{
                  py: 1.5,
                  bgcolor: '#0f172a',
                  '&:hover': { bgcolor: '#1e293b' },
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Code'}
              </Button>

              <Button 
                onClick={() => router.push('/login')}
                sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600 }}
              >
                Back to Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
