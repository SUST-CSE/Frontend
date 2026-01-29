'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  TextField, 
  MenuItem, 
  Button, 
  CircularProgress,
  Grid
} from '@mui/material';
import { useSubmitApplicationMutation } from '@/features/application/applicationApi';
import { APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import { LucideFileUp, LucideSend, LucideFileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface ComposeApplicationProps {
  onSuccess?: () => void;
}

export default function ComposeApplication({ onSuccess }: ComposeApplicationProps) {
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'GENERAL',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.description) {
        toast.error('Title and Description are required');
        return;
      }

      const body = new FormData();
      body.append('title', formData.title);
      body.append('description', formData.description);
      body.append('type', formData.type);
      if (file) {
        body.append('file', file);
      }

      await submitApplication(body).unwrap();
      toast.success('Application submitted successfully!');
      setFormData({ title: '', description: '', type: 'GENERAL' });
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to submit application');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={800} color="#002147">Write Application</Typography>
        <Typography variant="body2" color="text.secondary">Submit a new request to the department</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={4}>
                <TextField
                  fullWidth
                  label="Application Title"
                  placeholder="e.g., Request for Transcript, Semester Leave..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />

                <TextField
                  select
                  fullWidth
                  label="Application Category"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                >
                  {Object.entries(APP_TYPE_LABELS).map(([key, label]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="Detailed Description"
                  placeholder="Clearly explain your request and provide any necessary context..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#002147" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LucideFileUp size={18} /> Supporting Document
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Upload a PDF or image (Max 5MB)
                  </Typography>
                  
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      py: 3, 
                      borderRadius: 2, 
                      borderStyle: 'dashed',
                      bgcolor: file ? '#f0fdf4' : 'transparent',
                      borderColor: file ? '#16a34a' : '#cbd5e1'
                    }}
                  >
                    <Stack alignItems="center" spacing={1}>
                      {file ? <LucideFileText size={24} color="#16a34a" /> : <LucideFileUp size={24} color="#94a3b8" />}
                      <Typography variant="caption" fontWeight={700} color={file ? '#16a34a' : 'inherit'}>
                        {file ? file.name : 'Choose File'}
                      </Typography>
                    </Stack>
                    <input
                      type="file"
                      hidden
                      accept="application/pdf,image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                  {file && (
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => setFile(null)}
                      sx={{ mt: 1, fontWeight: 700 }}
                    >
                      Remove File
                    </Button>
                  )}
                </Paper>

                <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fff9ed', border: '1px solid #fdf2f2' }}>
                  <Typography variant="caption" fontWeight={800} color="#92400e" display="block" gutterBottom>NOTE</Typography>
                  <Typography variant="caption" color="#92400e">
                    Applications will be reviewed by the department administration. You can track the status in the &quot;Applications&quot; section.
                  </Typography>
                </Box>

                <Button 
                  type="submit"
                  variant="contained" 
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={!isSubmitting && <LucideSend size={20} />}
                  sx={{ 
                    py: 2, 
                    borderRadius: 2, 
                    bgcolor: '#002147', 
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(0,33,71,0.2)'
                  }}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
