import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  Chip, 
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { useGetMyApplicationsQuery, useSubmitApplicationMutation } from '@/features/application/applicationApi';
import { APP_STATUS_COLORS, APPLICATION_TYPE, APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import { LucideFileText, LucideClock, LucideAlertCircle, LucidePlus, LucideFileUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyApplicationsSection() {
  const { data: response, isLoading, error } = useGetMyApplicationsQuery(undefined);
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const applications = response?.data || [];

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'GENERAL',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
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
      setOpenDialog(false);
      setFormData({ title: '', description: '', type: 'GENERAL' });
      setFile(null);
    } catch (err) {
      toast.error('Failed to submit application');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <LucideAlertCircle size={48} style={{ marginBottom: 16 }} />
        <Typography>Failed to load applications</Typography>
      </Box>
    );
  }

  if (applications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <LucideFileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
        <Typography variant="h6">No applications submitted</Typography>
        <Typography variant="body2">You haven&apos;t submitted any applications yet.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Your Applications</Typography>
          <Typography variant="body2" color="text.secondary">Track and manage your departmental requests</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<LucidePlus size={20} />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: '#002147', fontWeight: 700, borderRadius: 2 }}
        >
          New Application
        </Button>
      </Box>

      {applications.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary', bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
          <LucideFileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <Typography variant="h6">No applications submitted</Typography>
          <Typography variant="body2">Click &apos;New Application&apos; to get started.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application: any) => (
            <Grid size={{ xs: 12 }} key={application._id}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" gap={2}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                      <Typography variant="h6" fontWeight={700}>{application.title}</Typography>
                      <Chip 
                        label={application.status} 
                        size="small" 
                        color={APP_STATUS_COLORS[application.status] as any}
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </Stack>
                    
                    <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                      {APP_TYPE_LABELS[application.type] || application.type.replace(/_/g, ' ')}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {application.description}
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={3}>
                      <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
                        <LucideClock size={16} />
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(application.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </Typography>
                      </Stack>

                      {application.attachments && application.attachments.length > 0 && (
                        <Button 
                          size="small" 
                          startIcon={<LucideFileText size={16} />}
                          href={application.attachments[0]}
                          target="_blank"
                          sx={{ textTransform: 'none', fontWeight: 700, p: 0 }}
                        >
                          View Attachment
                        </Button>
                      )}
                    </Stack>

                    {application.feedback && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">ADMIN FEEDBACK</Typography>
                        <Typography variant="body2">{application.feedback}</Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Submission Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Submit New Application</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              placeholder="e.g., Application for Semester Leave"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              select
              fullWidth
              label="Application Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {Object.entries(APP_TYPE_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              placeholder="Provide detailed reasons for your application..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" gutterBottom display="block">
                ATTACHMENT (PDF Recommended)
              </Typography>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<LucideFileUp size={20} />}
                sx={{ borderStyle: 'dashed', py: 2, borderRadius: 2 }}
              >
                {file ? file.name : 'Upload Document'}
                <input
                  type="file"
                  hidden
                  accept="application/pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={isSubmitting}
            onClick={handleSubmit}
            sx={{ bgcolor: '#002147', px: 4, fontWeight: 700, borderRadius: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
