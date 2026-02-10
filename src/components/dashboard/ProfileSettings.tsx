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
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid
} from '@mui/material';
import { LucideCamera, LucideSave, LucideUser, LucidePhone, LucideBriefcase, LucideBell, LucideGlobe, LucideGithub, LucideFacebook, LucideLinkedin, LucideInstagram, LucidePlus, LucideTrash2 } from 'lucide-react';
import { useUpdateMyProfileMutation } from '@/features/user/userApi';
import ChangePassword from './ChangePassword';
import toast from 'react-hot-toast';

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
  
  const [sigPreview, setSigPreview] = useState(user?.signatureUrl || '');
  const [selectedSigFile, setSelectedSigFile] = useState<File | null>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const [selectedNotices, setSelectedNotices] = useState<string[]>(user?.notificationPreferences?.notices || []);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(user?.notificationPreferences?.events || []);
  
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [batch, setBatch] = useState(user?.batch || '');
  const [session, setSession] = useState(user?.session || '');
  const [projects, setProjects] = useState<any[]>(user?.projects || []);
  const [experiences, setExperiences] = useState<any[]>(user?.experiences || []);
  const [researches, setResearches] = useState<any[]>(user?.researches || []);
  
  const [socialLinks, setSocialLinks] = useState({
    facebook: user?.socialLinks?.facebook || '',
    github: user?.socialLinks?.github || '',
    linkedin: user?.socialLinks?.linkedin || '',
    instagram: user?.socialLinks?.instagram || '',
    website: user?.socialLinks?.website || '',
  });

  const [updateProfile, { isLoading }] = useUpdateMyProfileMutation();

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

  const handleSigFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedSigFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSigPreview(reader.result as string);
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

  const addProject = () => {
    setProjects([...projects, { title: '', description: '', githubLink: '', liveLink: '', technologies: [] }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index: number, field: string, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const addExperience = () => {
    setExperiences([...experiences, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };
    setExperiences(newExps);
  };

  const addResearch = () => {
    setResearches([...researches, { title: '', publicationLink: '', journal: '', publicationDate: '', description: '' }]);
  };

  const removeResearch = (index: number) => {
    setResearches(researches.filter((_, i) => i !== index));
  };

  const handleResearchChange = (index: number, field: string, value: any) => {
    const newRes = [...researches];
    newRes[index] = { ...newRes[index], [field]: value };
    setResearches(newRes);
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
    if (selectedSigFile) {
      formData.append('signatureUrl', selectedSigFile);
    }
    
    // Send as JSON string for multipart compatibility
    formData.append('notificationPreferences', JSON.stringify({
      notices: selectedNotices,
      events: selectedEvents
    }));

    formData.append('experiences', JSON.stringify(experiences));
    formData.append('researches', JSON.stringify(researches));

    formData.append('socialLinks', JSON.stringify(socialLinks));
    if (user.role === 'STUDENT') {
      formData.append('studentId', studentId);
      formData.append('batch', batch);
      formData.append('session', session);
      formData.append('projects', JSON.stringify(projects));
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile. Please try again.');
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

        {/* Digital Signature Upload (For L1/L2 Approvers) */}
        {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ position: 'relative' }}>
              <Box 
                sx={{ 
                  width: 200, 
                  height: 100, 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#f8fafc',
                  overflow: 'hidden'
                }}
              >
                {sigPreview ? (
                  <img src={sigPreview} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <Typography variant="caption" color="text.secondary">No Signature Uploaded</Typography>
                )}
              </Box>
              <IconButton 
                onClick={() => sigInputRef.current?.click()}
                sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  right: -10, 
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
                ref={sigInputRef} 
                accept="image/*"
                onChange={handleSigFileChange}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>Digital Signature</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300 }}>
                Upload a transparent signature image (PNG). This will be used to sign official applications (L1/L2).
              </Typography>
            </Box>
          </Box>
        )}

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
                label="GitHub" 
                value={socialLinks.github} 
                onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                InputProps={{ startAdornment: <LucideGithub size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
            </Grid>
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
              <TextField 
                fullWidth 
                label="Student ID" 
                value={studentId} 
                onChange={(e) => setStudentId(e.target.value)}
                InputProps={{ startAdornment: <LucideUser size={18} style={{ marginRight: 12, opacity: 0.5 }} /> }}
              />
              <Stack direction="row" spacing={2}>
                <TextField 
                  fullWidth 
                  label="Batch" 
                  value={batch} 
                  onChange={(e) => setBatch(e.target.value)}
                />
                <TextField 
                  fullWidth 
                  label="Session" 
                  value={session} 
                  onChange={(e) => setSession(e.target.value)}
                />
              </Stack>

              <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LucideBriefcase size={20} color="#002147" />
                Projects
              </Typography>
              
              {/* Dynamic Projects Form */}
              {projects.map((proj, idx) => (
                <Box key={idx} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, position: 'relative' }}>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => removeProject(idx)}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                  >
                    <LucideTrash2 size={16} />
                  </IconButton>
                  <Stack spacing={2}>
                    <TextField 
                      fullWidth 
                      label="Project Title" 
                      value={proj.title} 
                      onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                      size="small"
                    />
                    <TextField 
                      fullWidth 
                      label="Description" 
                      value={proj.description} 
                      onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField 
                        fullWidth 
                        label="GitHub Link" 
                        value={proj.githubLink} 
                        onChange={(e) => handleProjectChange(idx, 'githubLink', e.target.value)}
                        size="small"
                        InputProps={{ startAdornment: <LucideGithub size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }}
                      />
                      <TextField 
                        fullWidth 
                        label="Live Link" 
                        value={proj.liveLink} 
                        onChange={(e) => handleProjectChange(idx, 'liveLink', e.target.value)}
                        size="small"
                        InputProps={{ startAdornment: <LucideGlobe size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }}
                      />
                    </Stack>
                    <TextField 
                      fullWidth 
                      label="Technologies (comma separated)" 
                      value={proj.technologies?.join(', ')} 
                      onChange={(e) => handleProjectChange(idx, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                      size="small"
                      placeholder="React, Node.js, MongoDB"
                    />
                  </Stack>
                </Box>
              ))}
              <Button 
                variant="outlined" 
                startIcon={<LucidePlus size={16} />}
                onClick={addProject}
                sx={{ borderStyle: 'dashed' }}
              >
                Add Another Project
              </Button>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LucideBriefcase size={20} color="#002147" />
            Job Experience / Profile
          </Typography>
          {experiences.map((exp, idx) => (
            <Box key={idx} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, position: 'relative' }}>
              <IconButton size="small" color="error" onClick={() => removeExperience(idx)} sx={{ position: 'absolute', right: 8, top: 8 }}><LucideTrash2 size={16} /></IconButton>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)} size="small" />
                  <TextField fullWidth label="Company/Institute" value={exp.company} onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)} size="small" />
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Location" value={exp.location} onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)} size="small" />
                  <TextField fullWidth label="Start Date" type="date" value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                  <TextField fullWidth label="End Date" type="date" value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} disabled={exp.current} />
                </Stack>
                <FormControlLabel control={<Checkbox checked={exp.current || false} onChange={(e) => handleExperienceChange(idx, 'current', e.target.checked)} />} label="I currently work here" />
                <TextField fullWidth label="Description" value={exp.description} onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)} multiline rows={2} size="small" />
              </Stack>
            </Box>
          ))}
          <Button variant="outlined" startIcon={<LucidePlus size={16} />} onClick={addExperience} sx={{ borderStyle: 'dashed' }}>Add Experience</Button>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LucideBriefcase size={20} color="#002147" />
            Researches & Publications
          </Typography>
          {researches.map((res, idx) => (
            <Box key={idx} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, position: 'relative' }}>
              <IconButton size="small" color="error" onClick={() => removeResearch(idx)} sx={{ position: 'absolute', right: 8, top: 8 }}><LucideTrash2 size={16} /></IconButton>
              <Stack spacing={2}>
                <TextField fullWidth label="Research Title" value={res.title} onChange={(e) => handleResearchChange(idx, 'title', e.target.value)} size="small" />
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField fullWidth label="Journal/Conference" value={res.journal} onChange={(e) => handleResearchChange(idx, 'journal', e.target.value)} size="small" />
                  <TextField fullWidth label="Publication Date" type="date" value={res.publicationDate ? new Date(res.publicationDate).toISOString().split('T')[0] : ''} onChange={(e) => handleResearchChange(idx, 'publicationDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
                </Stack>
                <TextField fullWidth label="Link" value={res.publicationLink} onChange={(e) => handleResearchChange(idx, 'publicationLink', e.target.value)} size="small" InputProps={{ startAdornment: <LucideGlobe size={16} style={{ marginRight: 8, opacity: 0.5 }} /> }} />
                <TextField fullWidth label="Description" value={res.description} onChange={(e) => handleResearchChange(idx, 'description', e.target.value)} multiline rows={2} size="small" />
              </Stack>
            </Box>
          ))}
          <Button variant="outlined" startIcon={<LucidePlus size={16} />} onClick={addResearch} sx={{ borderStyle: 'dashed' }}>Add Research</Button>
          
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
