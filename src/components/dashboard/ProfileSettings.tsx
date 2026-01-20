'use client';

import { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Stack, 
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { LucideCamera, LucideSave, LucideUser, LucidePhone, LucideBriefcase } from 'lucide-react';
import { useUpdateMyProfileMutation } from '@/features/user/userApi';

interface ProfileSettingsProps {
  user: any;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [preview, setPreview] = useState(user?.profileImage || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfile, { isLoading, error, isSuccess }] = useUpdateMyProfileMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (user.role === 'TEACHER') {
      formData.append('designation', designation);
    }
    if (selectedFile) {
      formData.append('profileImage', selectedFile);
    }

    try {
      await updateProfile(formData).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <LucideUser size={24} color="#002147" />
        Profile Information
      </Typography>

      {isSuccess && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Profile updated successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>Failed to update profile. Please try again.</Alert>}

      <Stack spacing={4}>
        {/* Photo Upload */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={preview} 
              sx={{ width: 120, height: 120, border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              {name?.charAt(0)}
            </Avatar>
            <IconButton 
              onClick={() => fileInputRef.current?.click()}
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                bgcolor: '#002147', 
                color: '#fff',
                '&:hover': { bgcolor: '#003366' }
              }}
              size="small"
            >
              <LucideCamera size={16} />
            </IconButton>
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Profile Photo</Typography>
            <Typography variant="caption" color="text.secondary">
              Update your photo. Allowed formats: JPG, PNG. Max size: 2MB.
            </Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <TextField 
            fullWidth 
            label="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            InputProps={{ startAdornment: <LucideUser size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
          />

          <TextField 
            fullWidth 
            label="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="017XXXXXXXX"
            InputProps={{ startAdornment: <LucidePhone size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
          />

          {user.role === 'TEACHER' && (
            <TextField 
              fullWidth 
              label="Designation" 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Associate Professor"
              InputProps={{ startAdornment: <LucideBriefcase size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
            />
          )}

          <Button 
            variant="contained" 
            size="large" 
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LucideSave size={20} />}
            onClick={handleSave}
            disabled={isLoading}
            sx={{ py: 1.5, bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
