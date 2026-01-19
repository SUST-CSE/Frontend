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
  Grid
} from '@mui/material';
import { LucideUserRound, LucideGraduationCap, LucideCheckCircle2 } from 'lucide-react';
import { useRegisterStudentMutation, useRegisterTeacherMutation } from '@/features/auth/authApi';

const studentSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
  studentId: z.string().min(5, 'Student ID is required'),
  batch: z.string().min(1, 'Batch is required'),
  session: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid session format (e.g., 2020-21)'),
  enrollmentYear: z.number({ invalid_type_error: 'Must be a number' }).int().min(2000),
});

const teacherSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address').refine(
    (email) => email.endsWith('@gmail.com'),
    'Teachers must use a Gmail address'
  ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, 'Invalid Bangladesh phone number'),
  designation: z.string().min(2, 'Designation is required'),
});

export default function RegisterPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [registerStudent, { isLoading: studentLoading, error: studentError, isSuccess: studentSuccess }] = useRegisterStudentMutation();
  const [registerTeacher, { isLoading: teacherLoading, error: teacherError, isSuccess: teacherSuccess }] = useRegisterTeacherMutation();
  
  const router = useRouter();
  const formRef = useRef(null);

  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      enrollmentYear: new Date().getFullYear(),
    }
  });

  const teacherForm = useForm({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    gsap.fromTo(formRef.current, { x: role === 'student' ? -20 : 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
  }, [role]);

  const onStudentSubmit = async (data: any) => {
    try {
      await registerStudent(data).unwrap();
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {}
  };

  const onTeacherSubmit = async (data: any) => {
    try {
      await registerTeacher(data).unwrap();
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {}
  };

  if (studentSuccess || teacherSuccess) {
    return (
      <Container maxWidth="sm" sx={{ py: 20, textAlign: 'center' }}>
        <LucideCheckCircle2 size={80} color="#10b981" style={{ marginBottom: 24 }} />
        <Typography variant="h4" fontWeight={800} gutterBottom>Registration Successful!</Typography>
        <Typography color="text.secondary">Redirecting to login portal...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={900} color="#002147" gutterBottom>Join SUST CSE</Typography>
          <Typography variant="h6" color="text.secondary">Create an account to access the department portal</Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Tabs 
            value={role} 
            onChange={(_, v) => setRole(v)} 
            variant="fullWidth"
            sx={{ 
              bgcolor: '#f1f5f9',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              '& .MuiTab-root': { py: 3, fontWeight: 700, fontSize: '1rem' }
            }}
          >
            <Tab icon={<LucideUserRound size={20} />} iconPosition="start" label="Student" value="student" />
            <Tab icon={<LucideGraduationCap size={20} />} iconPosition="start" label="Teacher" value="teacher" />
          </Tabs>

          <Box sx={{ p: { xs: 4, md: 6 } }} ref={formRef}>
            {(studentError || teacherError) && (
              <Alert severity="error" sx={{ mb: 4 }}>
                <Typography variant="body2">
                   Registration failed. Please check your inputs. 
                   {/* @ts-ignore */}
                   {(studentError?.data?.message || teacherError?.data?.message || '')}
                </Typography>
              </Alert>
            )}

            {role === 'student' ? (
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}><TextField fullWidth label="Full Name" {...studentForm.register('name')} error={!!studentForm.formState.errors.name} helperText={studentForm.formState.errors.name?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Email" {...studentForm.register('email')} error={!!studentForm.formState.errors.email} helperText={studentForm.formState.errors.email?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Phone" placeholder="01712345678" {...studentForm.register('phone')} error={!!studentForm.formState.errors.phone} helperText={studentForm.formState.errors.phone?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Password" type="password" {...studentForm.register('password')} error={!!studentForm.formState.errors.password} helperText={studentForm.formState.errors.password?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Student ID" {...studentForm.register('studentId')} error={!!studentForm.formState.errors.studentId} helperText={studentForm.formState.errors.studentId?.message as string} /></Grid>
                  <Grid item xs={12} md={4}><TextField fullWidth label="Batch" placeholder="e.g., 2019" {...studentForm.register('batch')} error={!!studentForm.formState.errors.batch} helperText={studentForm.formState.errors.batch?.message as string} /></Grid>
                  <Grid item xs={12} md={4}><TextField fullWidth label="Session" placeholder="2020-21" {...studentForm.register('session')} error={!!studentForm.formState.errors.session} helperText={studentForm.formState.errors.session?.message as string} /></Grid>
                  {/* @ts-ignore */}
                  <Grid item xs={12} md={4}><TextField fullWidth label="Enrollment Year" type="number" {...studentForm.register('enrollmentYear', { valueAsNumber: true })} error={!!studentForm.formState.errors.enrollmentYear} helperText={studentForm.formState.errors.enrollmentYear?.message as string} /></Grid>
                  
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" size="large" type="submit" disabled={studentLoading} sx={{ py: 2, bgcolor: '#002147', fontWeight: 700 }}>
                      {studentLoading ? <CircularProgress size={24} /> : 'Complete Registration'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}><TextField fullWidth label="Full Name" {...teacherForm.register('name')} error={!!teacherForm.formState.errors.name} helperText={teacherForm.formState.errors.name?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Email" {...teacherForm.register('email')} error={!!teacherForm.formState.errors.email} helperText={teacherForm.formState.errors.email?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Phone" placeholder="01712345678" {...teacherForm.register('phone')} error={!!teacherForm.formState.errors.phone} helperText={teacherForm.formState.errors.phone?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Password" type="password" {...teacherForm.register('password')} error={!!teacherForm.formState.errors.password} helperText={teacherForm.formState.errors.password?.message as string} /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Designation" placeholder="e.g. Professor" {...teacherForm.register('designation')} error={!!teacherForm.formState.errors.designation} helperText={teacherForm.formState.errors.designation?.message as string}/></Grid>
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                       Your registration will require **Admin Approval** before you can log in.
                    </Alert>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="contained" size="large" type="submit" disabled={teacherLoading} sx={{ py: 2, bgcolor: '#002147', fontWeight: 700 }}>
                      {teacherLoading ? <CircularProgress size={24} /> : 'Complete Registration'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
