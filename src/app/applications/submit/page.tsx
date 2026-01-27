'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LucideSend,
  LucideArrowLeft,
  LucideFileUp,
  LucideInfo,
} from 'lucide-react';
import { useSubmitApplicationMutation } from '@/features/application/applicationApi';
import { APPLICATION_TYPE, APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import toast from 'react-hot-toast';

export default function SubmitApplicationPage() {
  const router = useRouter();
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const [formData, setFormData] = useState({
    title: '',
    type: APPLICATION_TYPE.GENERAL,
    description: '',
    attachments: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }
      await submitApplication(formData).unwrap();
      toast.success('Application submitted successfully!');
      router.push('/dashboard/student'); // Redirect to student dashboard
    } catch (err) {
      toast.error('Failed to submit application');
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<LucideArrowLeft size={18} />} 
          onClick={() => router.back()}
          sx={{ mb: 4, textTransform: 'none', color: '#64748b' }}
        >
          Back
        </Button>

        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" fontWeight={900} color="#002147" gutterBottom>
              Submit Application
            </Typography>
            <Typography color="text.secondary">
              Fill out the form below to submit a formal request to the department.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  Application Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {Object.values(APPLICATION_TYPE).map((type) => (
                      <MenuItem key={type} value={type}>
                        {APP_TYPE_LABELS[type]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  Subject / Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Request for leave (2 days), Equipment booking for project"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                    Detailed Description
                  </Typography>
                  <Tooltip title="Provide all necessary details, dates, and reasons.">
                    <LucideInfo size={14} color="#94a3b8" />
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Write your application content here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  Attachments (Optional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<LucideFileUp size={18} />}
                  sx={{ textTransform: 'none', borderStyle: 'dashed', py: 2, bgcolor: '#f1f5f9' }}
                  fullWidth
                  disabled
                >
                  Upload Files (Coming Soon)
                  <input type="file" hidden />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supported formats: PDF, JPG, PNG. Max size: 5MB.
                </Typography>
              </Box>

              <Box sx={{ pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  startIcon={!isLoading && <LucideSend size={20} />}
                  sx={{ 
                    bgcolor: '#002147', 
                    py: 1.5, 
                    fontWeight: 800, 
                    borderRadius: 2,
                    boxShadow: '0 10px 15px -3px rgba(0, 33, 71, 0.2)',
                    '&:hover': { bgcolor: '#003366' }
                  }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
