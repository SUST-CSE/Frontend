'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Tabs, 
  Tab,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import { 
  LucideUserRound, 
  LucideGraduationCap, 
  LucideCheckCircle2, 
  LucideEye, 
  LucideEyeOff, 
  LucideArrowRight,
  LucideLayoutDashboard
} from 'lucide-react';
import { useRegisterStudentMutation, useRegisterTeacherMutation } from '@/features/auth/authApi';

// Schema for frontend validation (visible fields only)
const studentFormSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address').refine(
    (email) => email.endsWith('@student.sust.edu'),
    'Must be a @student.sust.edu email'
  ),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const teacherSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address').refine(
    (email) => email.endsWith('@sust.edu'),
    'Teachers must use a @sust.edu email address'
  ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
  designation: z.string().min(2, 'Designation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function RegisterPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerStudent, { isLoading: studentLoading, error: studentError, isSuccess: studentSuccess }] = useRegisterStudentMutation();
  const [registerTeacher, { isLoading: teacherLoading, error: teacherError, isSuccess: teacherSuccess }] = useRegisterTeacherMutation();
  
  const router = useRouter();
  const formRef = useRef(null);

  const studentForm = useForm({
    resolver: zodResolver(studentFormSchema),
  });

  const teacherForm = useForm({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    gsap.fromTo(formRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, [role]);

  const onStudentSubmit = async (data: any) => {
    try {
      const email = data.email;
      const studentId = email.split('@')[0];
      const yearStr = studentId.substring(0, 4);
      const enrollmentYear = parseInt(yearStr, 10);
      
      if (isNaN(enrollmentYear) || !studentId.includes('331')) {
         studentForm.setError('email', { 
           type: 'manual', 
           message: 'Invalid Student ID in email. Must be a valid CSE student email (e.g., 2021331xxx).' 
         });
         return;
      }

      const batchNum = enrollmentYear - 1991;
      const batch = getOrdinal(batchNum);
      const session = `${enrollmentYear}-${(enrollmentYear + 1).toString().slice(-2)}`;

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        studentId,
        batch,
        session,
        enrollmentYear
      };

      await registerStudent(payload).unwrap();
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);

    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const onTeacherSubmit = async (data: any) => {
    try {
      const { confirmPassword, ...payload } = data;
      await registerTeacher(payload).unwrap();
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err) {}
  };

  if (studentSuccess || teacherSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <Fade in timeout={1000}>
        <Box>
            <Box sx={{ 
            width: 96, 
            height: 96, 
            bgcolor: '#ecfdf5', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 4,
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05)'
            }}>
            <LucideCheckCircle2 size={48} color="#059669" />
            </Box>
            <Typography variant="h4" fontWeight={800} gutterBottom color="#0f172a">Registration Successful!</Typography>
            <Typography color="text.secondary" variant="body1" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            We've sent a verification link to your email. Please check your inbox to activate your account.
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
        </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f1f5f9',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 6,
      px: 2
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: 56, 
                height: 56, 
                borderRadius: 2, 
                bgcolor: '#0f172a', 
                color: 'white',
                mb: 3,
                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)'
            }}>
                <LucideLayoutDashboard size={28} />
            </Box>
            <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -0.5, mb: 1 }}>
                Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Join the SUST CSE community portal
            </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Tabs 
            value={role} 
            onChange={(_, v) => setRole(v)} 
            variant="fullWidth"
            sx={{ 
              mb: 4,
              borderBottom: '1px solid #e2e8f0',
              '& .MuiTab-root': { py: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
              '& .Mui-selected': { color: '#0f172a' },
              '& .MuiTabs-indicator': { height: 2, bgcolor: '#0f172a' }
            }}
          >
            <Tab icon={<LucideUserRound size={18} />} iconPosition="start" label="Student" value="student" />
            <Tab icon={<LucideGraduationCap size={18} />} iconPosition="start" label="Faculty" value="teacher" />
          </Tabs>

          <Box ref={formRef}>
            {(studentError || teacherError) && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {/* @ts-ignore */}
                {(studentError?.data?.message || teacherError?.data?.message || 'Registration failed. Please check your details.')}
                </Alert>
            )}

            {role === 'student' ? (
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                <Stack spacing={2.5}>
                    <TextField 
                    fullWidth 
                    label="Full Name" 
                    placeholder="e.g. Adnan Al Yumin"
                    {...studentForm.register('name')} 
                    error={!!studentForm.formState.errors.name} 
                    helperText={studentForm.formState.errors.name?.message as string}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    
                    <TextField 
                    fullWidth 
                    label="University Email" 
                    placeholder="2020331xxx@student.sust.edu"
                    helperText={(studentForm.formState.errors.email?.message as string)}
                    {...studentForm.register('email')} 
                    error={!!studentForm.formState.errors.email}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <TextField 
                    fullWidth 
                    label="WhatsApp Number" 
                    placeholder="01712345678" 
                    {...studentForm.register('phone')} 
                    error={!!studentForm.formState.errors.phone} 
                    helperText={studentForm.formState.errors.phone?.message as string} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                        fullWidth 
                        label="Password" 
                        type={showPassword ? 'text' : 'password'}
                        {...studentForm.register('password')} 
                        error={!!studentForm.formState.errors.password} 
                        helperText={studentForm.formState.errors.password?.message as string}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                        fullWidth 
                        label="Confirm Password" 
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...studentForm.register('confirmPassword')} 
                        error={!!studentForm.formState.errors.confirmPassword} 
                        helperText={studentForm.formState.errors.confirmPassword?.message as string}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                {showConfirmPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                    </Grid>
                    
                    <Button 
                    fullWidth 
                    variant="contained" 
                    size="large" 
                    type="submit" 
                    disabled={studentLoading} 
                    sx={{ 
                        py: 1.8, 
                        bgcolor: '#0f172a', 
                        fontWeight: 700, 
                        borderRadius: 2, 
                        mt: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { bgcolor: '#1e293b' } 
                    }}
                    >
                    {studentLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Student Account'}
                    </Button>
                </Stack>
                </form>
            ) : (
                <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                    <Stack spacing={2.5}>
                    <TextField 
                    fullWidth 
                    label="Full Name" 
                    {...teacherForm.register('name')} 
                    error={!!teacherForm.formState.errors.name} 
                    helperText={teacherForm.formState.errors.name?.message as string} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    
                    <TextField 
                    fullWidth 
                    label="Official Email" 
                    placeholder="name@sust.edu"
                    {...teacherForm.register('email')} 
                    error={!!teacherForm.formState.errors.email} 
                    helperText={teacherForm.formState.errors.email?.message as string} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <TextField 
                    fullWidth 
                    label="Phone Number" 
                    {...teacherForm.register('phone')} 
                    error={!!teacherForm.formState.errors.phone} 
                    helperText={teacherForm.formState.errors.phone?.message as string} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <TextField 
                    fullWidth 
                    label="Designation" 
                    placeholder="e.g. Associate Professor"
                    {...teacherForm.register('designation')} 
                    error={!!teacherForm.formState.errors.designation} 
                    helperText={teacherForm.formState.errors.designation?.message as string} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                        fullWidth 
                        label="Password" 
                        type={showPassword ? 'text' : 'password'}
                        {...teacherForm.register('password')} 
                        error={!!teacherForm.formState.errors.password} 
                        helperText={teacherForm.formState.errors.password?.message as string}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                        fullWidth 
                        label="Confirm Password" 
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...teacherForm.register('confirmPassword')} 
                        error={!!teacherForm.formState.errors.confirmPassword} 
                        helperText={teacherForm.formState.errors.confirmPassword?.message as string}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                {showConfirmPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                        />
                    </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ borderRadius: 2, bgcolor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
                        <Typography variant="caption" fontWeight={600}>
                        Faculty accounts require admin approval.
                        </Typography>
                    </Alert>
                    
                    <Button 
                    fullWidth 
                    variant="contained" 
                    size="large" 
                    type="submit" 
                    disabled={teacherLoading} 
                    sx={{ 
                        py: 1.8, 
                        bgcolor: '#0f172a', 
                        fontWeight: 700, 
                        borderRadius: 2, 
                        mt: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { bgcolor: '#1e293b' } 
                    }}
                    >
                    {teacherLoading ? <CircularProgress size={24} color="inherit" /> : 'Request Faculty Access'}
                    </Button>
                    </Stack>
                </form>
            )}
          </Box>

            <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Button 
                    onClick={() => router.push('/login')}
                    sx={{ textTransform: 'none', color: '#0f172a', fontWeight: 800, p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                    >
                    Sign In
                    </Button>
                </Typography>
            </Box>
        </Paper>
      </Container>
    </Box>
  );
}
