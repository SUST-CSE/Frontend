'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { LucideCheckCircle2, LucideEye, LucideEyeOff, LucideLock } from 'lucide-react';
import { useResetPasswordMutation } from '@/features/auth/authApi';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailParam
    }
  });

  useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword
      }).unwrap();
    } catch (err) {
      console.error('Failed to reset password:', err);
    }
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <Box sx={{ 
          width: 96, 
          height: 96, 
          bgcolor: '#ecfdf5', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mx: 'auto',
          mb: 4
        }}>
          <LucideCheckCircle2 size={48} color="#059669" />
        </Box>
        <Typography variant="h4" fontWeight={900} gutterBottom color="#0f172a">Password Reset!</Typography>
        <Typography color="text.secondary" variant="body1" sx={{ mb: 4 }}>
          Your password has been updated successfully. You can now login with your new password.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/login')} 
          sx={{ 
            fontWeight: 700, 
            borderRadius: 2, 
            px: 4, 
            py: 1.5,
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' }
          }}
        >
          Back to Login
        </Button>
      </Container>
    );
  }

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
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" fontWeight={800} color="#0f172a" gutterBottom>
              Set New Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the code sent to your email and your new password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {'data' in (error as any) ? (error as any).data.message : 'Failed to reset password.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  readOnly: !!emailParam,
                }}
              />

              <TextField
                fullWidth
                label="Verification Code"
                placeholder="123456"
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
                inputProps={{ maxLength: 6, style: { letterSpacing: 4, fontWeight: 'bold', textAlign: 'center' } }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                {...register('newPassword')}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: <LucideLock size={20} color="#94a3b8" style={{ marginRight: 8 }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: <LucideLock size={20} color="#94a3b8" style={{ marginRight: 8 }} />,
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  bgcolor: '#0f172a',
                  '&:hover': { bgcolor: '#1e293b' },
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
