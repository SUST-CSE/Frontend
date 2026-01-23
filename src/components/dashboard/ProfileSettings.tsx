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
  Alert,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid
} from '@mui/material';
import { LucideCamera, LucideSave, LucideUser, LucidePhone, LucideBriefcase, LucideBell, LucideGlobe, LucideGithub, LucideFacebook, LucideLinkedin, LucideInstagram } from 'lucide-react';
import { useUpdateMyProfileMutation } from '@/features/user/userApi';
import ChangePassword from './ChangePassword';

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
  const [selectedNotices, setSelectedNotices] = useState<string[]>(user?.notificationPreferences?.notices || []);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(user?.notificationPreferences?.events || []);
  
  const [socialLinks, setSocialLinks] = useState({
    facebook: user?.socialLinks?.facebook || '',
    linkedin: user?.socialLinks?.linkedin || '',
    instagram: user?.socialLinks?.instagram || '',
    website: user?.socialLinks?.website || '',
  });

  const [projectLinks, setProjectLinks] = useState({
    github: user?.projectLinks?.github || '',
    liveLink: user?.projectLinks?.liveLink || '',
  });

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

  const handleNoticeChange = (category: string) => {
    setSelectedNotices(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleEventChange = (category: string) => {
    setSelectedEvents(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
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
    
    // Send as JSON string for multipart compatibility
    formData.append('notificationPreferences', JSON.stringify({
      notices: selectedNotices,
      events: selectedEvents
    }));

    formData.append('socialLinks', JSON.stringify(socialLinks));
    if (user.role === 'STUDENT') {
      formData.append('projectLinks', JSON.stringify(projectLinks));
    }

    try {
      await updateProfile(formData).unwrap();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const NOTICE_CATEGORIES = ['ACADEMIC', 'ADMINISTRATIVE', 'EVENT', 'GENERAL'];
  const EVENT_CATEGORIES = ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'SOCIAL', 'TECHNICAL'];

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
        {/* Photo Upload */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, textAlign: { xs: 'center', sm: 'left' } }}>
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
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300 }}>
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

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LucideGlobe size={20} color="#002147" />
            Social Profiles
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField 
                fullWidth 
                label="LinkedIn" 
                value={socialLinks.linkedin} 
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                InputProps={{ startAdornment: <LucideLinkedin size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField 
                fullWidth 
                label="Facebook" 
                value={socialLinks.facebook} 
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                InputProps={{ startAdornment: <LucideFacebook size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField 
                fullWidth 
                label="Instagram" 
                value={socialLinks.instagram} 
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                InputProps={{ startAdornment: <LucideInstagram size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField 
                fullWidth 
                label="Personal Website" 
                value={socialLinks.website} 
                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                InputProps={{ startAdornment: <LucideGlobe size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
            </Grid>
          </Grid>

          {user.role === 'STUDENT' && (
            <>
              <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LucideBriefcase size={20} color="#002147" />
                Project Showcases
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="GitHub Profile/Link" 
                    value={projectLinks.github} 
                    onChange={(e) => setProjectLinks({ ...projectLinks, github: e.target.value })}
                    InputProps={{ startAdornment: <LucideGithub size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Live Portfolio/Link" 
                    value={projectLinks.liveLink} 
                    onChange={(e) => setProjectLinks({ ...projectLinks, liveLink: e.target.value })}
                    InputProps={{ startAdornment: <LucideGlobe size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LucideBell size={20} color="#002147" />
              Get Notification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the categories you want to receive email notifications for.
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#64748b" sx={{ mb: 1, letterSpacing: 1 }}>NOTICES</Typography>
                <FormGroup>
                  {NOTICE_CATEGORIES.map((cat) => (
                    <FormControlLabel
                      key={cat}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={selectedNotices.includes(cat)}
                          onChange={() => handleNoticeChange(cat)}
                          sx={{ '&.Mui-checked': { color: '#002147' } }}
                        />
                      }
                      label={<Typography variant="body2" fontWeight={500}>{cat}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" fontWeight={700} color="#64748b" sx={{ mb: 1, letterSpacing: 1 }}>EVENTS</Typography>
                <FormGroup>
                  {EVENT_CATEGORIES.map((cat) => (
                    <FormControlLabel
                      key={cat}
                      control={
                        <Checkbox 
                          size="small" 
                          checked={selectedEvents.includes(cat)}
                          onChange={() => handleEventChange(cat)}
                          sx={{ '&.Mui-checked': { color: '#002147' } }}
                        />
                      }
                      label={<Typography variant="body2" fontWeight={500}>{cat}</Typography>}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

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

      <Divider sx={{ my: 6 }} />
      <ChangePassword />
    </Box>
  );
}
