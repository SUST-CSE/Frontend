'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  IconButton, 
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import { LucideEye, LucideEyeOff, LucideLock, LucideMail, LucideArrowRight } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const cardRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.1 }
    );
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ 
        user: result.data.user, 
        accessToken: result.data.tokens.accessToken 
      }));
      router.push('/');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // Still feels professional
        py: 8 
      }}
    >
      <Container maxWidth="sm">
        <Paper
          ref={cardRef}
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: '#2563eb', 
                borderRadius: 2, 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#ffffff',
                mb: 3
              }}
            >
              <LucideLock size={32} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              Portal Login
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Access your academic record, courses, and more.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {'data' in error ? (error.data as any).message : 'Login failed. Please check your credentials.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                placeholder="email@sust.edu"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LucideMail size={20} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LucideLock size={20} color="#94a3b8" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Button sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600 }}>
                  Forgot password?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <LucideArrowRight size={20} />}
                sx={{
                  py: 1.8,
                  bgcolor: '#002147',
                  '&:hover': { bgcolor: '#001a35' },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: 'none'
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Don&apos;t have an account?{' '}
                  <Button sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 700, p: 0 }}>
                    Register now
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
