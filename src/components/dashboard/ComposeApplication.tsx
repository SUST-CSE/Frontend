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
import { useGetApproversQuery } from '@/features/user/userApi';
import { APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import { LucideFileUp, LucideSend, LucideFileText, LucideUser } from 'lucide-react';
import toast from 'react-hot-toast';

interface ComposeApplicationProps {
  onSuccess?: () => void;
}

export default function ComposeApplication({ onSuccess }: ComposeApplicationProps) {
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const { data: approversData } = useGetApproversQuery({ limit: 100 });
  // The API returns { success: true, data: { users: [...] } }
  // So we need to access approversData?.data?.users
  const approvers = approversData?.data?.users || approversData?.users || [];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'GENERAL',
    medium: '',
    to: '',
  });
  const [submissionMode, setSubmissionMode] = useState<'PDF' | 'TEXT'>('TEXT');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.description || !formData.to) {
        toast.error('Title, Description, and Recipient (To) are required');
        return;
      }

      if (submissionMode === 'PDF' && !file) {
        toast.error('Please upload a PDF document');
        return;
      }

      const body = new FormData();
      body.append('title', formData.title);
      body.append('description', formData.description.substring(0, 100) + '...'); // Summary
      body.append('textContent', formData.description); // Full text for PDF generation
      body.append('type', formData.type);
      body.append('to', formData.to);
      body.append('submissionMode', submissionMode);

      if (formData.medium) {
        body.append('medium', formData.medium);
      }
      if (file) {
        body.append('file', file);
      }

      await submitApplication(body).unwrap();
      toast.success('Application submitted successfully!');
      setFormData({ title: '', description: '', type: 'GENERAL', medium: '', to: '' });
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
        <Typography variant="h5" fontWeight={800} color="#002147">Compose Application</Typography>
        <Typography variant="body2" color="text.secondary">Submit a new request to the department</Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Submission Mode Toggle */}
          <Stack direction="row" spacing={2} sx={{ mb: 4, p: 1, bgcolor: '#f8fafc', borderRadius: 3, width: 'fit-content' }}>
            <Button
              variant={submissionMode === 'TEXT' ? 'contained' : 'text'}
              onClick={() => setSubmissionMode('TEXT')}
              startIcon={<LucideFileText size={18} />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Write Application
            </Button>
            <Button
              variant={submissionMode === 'PDF' ? 'contained' : 'text'}
              onClick={() => setSubmissionMode('PDF')}
              startIcon={<LucideFileUp size={18} />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Upload PDF
            </Button>
          </Stack>

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

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <TextField
                    select
                    fullWidth
                    label="Through / Medium (Optional)"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    InputProps={{ 
                      sx: { borderRadius: 2 },
                      startAdornment: <LucideUser size={18} style={{ marginRight: 8, opacity: 0.5 }} />
                    }}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {approvers.map((user: any) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.designation || user.role})
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    required
                    label="To (Final Recipient)"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    InputProps={{ 
                      sx: { borderRadius: 2 },
                      startAdornment: <LucideUser size={18} style={{ marginRight: 8, opacity: 0.5 }} />
                    }}
                  >
                    {approvers.map((user: any) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} ({user.designation || user.role})
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                  fullWidth
                  multiline
                  rows={submissionMode === 'TEXT' ? 12 : 4}
                  label={submissionMode === 'TEXT' ? "Application Body (Full Content)" : "Brief Description / Summary"}
                  placeholder={submissionMode === 'TEXT' ? "Write your full application here. It will be converted to an official PDF." : "Provide a brief summary of your uploaded document..."}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: '#f8fafc', 
                  border: '1px solid #f1f5f9',
                  opacity: submissionMode === 'PDF' || file ? 1 : 0.6,
                  transition: '0.3s'
                }}>
                  <Typography variant="subtitle2" fontWeight={800} color="#002147" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LucideFileUp size={18} /> {submissionMode === 'PDF' ? 'Upload Main Document' : 'Supporting Document'}
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
