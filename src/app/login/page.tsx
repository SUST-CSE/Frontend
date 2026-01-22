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
  CircularProgress,
  Grid
} from '@mui/material';
import { LucideEye, LucideEyeOff, LucideLock, LucideMail, LucideArrowRight, LucideLayoutDashboard } from 'lucide-react';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
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
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ 
        user: result.data.user, 
        accessToken: result.data.tokens.accessToken 
      }));

      // Role-based redirection
      const role = result.data.user.role;
      switch (role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'STUDENT':
          router.push('/dashboard/student');
          break;
        case 'TEACHER':
          router.push('/dashboard/teacher');
          break;
        default:
          router.push('/');
      }
    } catch (err: any) {
      console.error('Failed to login:', err);
      if (err?.status === 403 || err?.data?.message?.includes('verify your email')) {
        const emailFromForm = data.email;
        router.push(`/verify?email=${encodeURIComponent(emailFromForm)}`);
      }
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top left, #f1f5f9 0%, #cbd5e1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
          
          {/* Left Side: Visual / Brand (Desktop Only) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' }, pr: 8 }}>
             <Box sx={{ mb: 4 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 1.5, 
                  bgcolor: 'rgba(15, 23, 42, 0.1)', 
                  borderRadius: 3, 
                  mb: 3,
                  color: '#0f172a' 
                }}>
                   <LucideLayoutDashboard size={32} />
                </Box>
                <Typography variant="h2" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -1, lineHeight: 1.1 }}>
                  Welcome back <br/> to SUST CSE.
                </Typography>
             </Box>
             <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 450, fontWeight: 400, lineHeight: 1.6 }}>
               Access your personalized dashboard to manage courses, view results, and stay updated with department activities.
             </Typography>
          </Grid>

          {/* Right Side: Login Form */}
          <Grid item xs={12} md={5}>
            <Paper
              ref={cardRef}
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 5,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Box sx={{ display: { md: 'none' }, mb: 4, textAlign: 'center' }}>
                 <Typography variant="h4" fontWeight={800} color="#0f172a">SUST CSE</Typography>
                 <Typography color="text.secondary">Portal Access</Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Sign In</Typography>
                <Typography variant="body2" color="text.secondary">Enter your credentials to continue</Typography>
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      onClick={() => router.push('/forgot-password')}
                      sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}
                    >
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
                      py: 2,
                      bgcolor: '#0f172a',
                      '&:hover': { bgcolor: '#1e293b' },
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)'
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Don&apos;t have an account?{' '}
                      <Button 
                        onClick={() => router.push('/register')}
                        sx={{ textTransform: 'none', color: '#0f172a', fontWeight: 800, p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                      >
                        Register
                      </Button>
                    </Typography>
                  </Box>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
