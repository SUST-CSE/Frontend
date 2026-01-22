'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Box, 
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
import { LucideLock, LucideEye, LucideEyeOff, LucideShieldCheck } from 'lucide-react';
import { useChangePasswordMutation } from '@/features/auth/authApi';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [changePassword, { isLoading, isSuccess, error }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }).unwrap();
      reset();
    } catch (err) {
      console.error('Failed to update password:', err);
    }
  };

  const toggleShowPassword = (field: 'old' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 3, textAlign: { xs: 'center', sm: 'left' } }}>
        <Box sx={{ p: 1.5, bgcolor: '#f0f9ff', borderRadius: 2, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 }, color: '#0369a1' }}>
          <LucideShieldCheck size={24} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#0f172a">
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your password to keep your account secure
          </Typography>
        </Box>
      </Box>

      {isSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Password updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {'data' in (error as any) ? (error as any).data.message : 'Failed to update password.'}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} maxWidth="md">
          <TextField
             fullWidth
             label="Current Password"
             type={showPassword.old ? 'text' : 'password'}
             {...register('oldPassword')}
             error={!!errors.oldPassword}
             helperText={errors.oldPassword?.message}
             InputProps={{
               startAdornment: <LucideLock size={20} color="#94a3b8" style={{ marginRight: 8 }} />,
               endAdornment: (
                 <InputAdornment position="end">
                   <IconButton onClick={() => toggleShowPassword('old')} edge="end">
                     {showPassword.old ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                   </IconButton>
                 </InputAdornment>
               ),
             }}
           />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
             <TextField
               fullWidth
               label="New Password"
               type={showPassword.new ? 'text' : 'password'}
               {...register('newPassword')}
               error={!!errors.newPassword}
               helperText={errors.newPassword?.message}
               InputProps={{
                 startAdornment: <LucideLock size={20} color="#94a3b8" style={{ marginRight: 8 }} />,
                 endAdornment: (
                   <InputAdornment position="end">
                     <IconButton onClick={() => toggleShowPassword('new')} edge="end">
                       {showPassword.new ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                     </IconButton>
                   </InputAdornment>
                 ),
               }}
             />

             <TextField
               fullWidth
               label="Confirm New Password"
               type={showPassword.confirm ? 'text' : 'password'}
               {...register('confirmPassword')}
               error={!!errors.confirmPassword}
               helperText={errors.confirmPassword?.message}
               InputProps={{
                 startAdornment: <LucideLock size={20} color="#94a3b8" style={{ marginRight: 8 }} />,
                 endAdornment: (
                   <InputAdornment position="end">
                     <IconButton onClick={() => toggleShowPassword('confirm')} edge="end">
                       {showPassword.confirm ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
                     </IconButton>
                   </InputAdornment>
                 ),
               }}
             />
          </Stack>

          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                px: 4,
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#1e293b' },
                borderRadius: 2,
                fontWeight: 700
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
}
