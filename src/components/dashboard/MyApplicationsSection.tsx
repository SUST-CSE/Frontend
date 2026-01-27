import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  Chip, 
  CircularProgress,
  Grid
} from '@mui/material';
import { useGetMyApplicationsQuery } from '@/features/application/applicationApi';
import { APP_STATUS_COLORS } from '@/features/application/applicationConstants';
import { LucideFileText, LucideClock, LucideAlertCircle } from 'lucide-react';

export default function MyApplicationsSection() {
  const { data: response, isLoading, error } = useGetMyApplicationsQuery(undefined);
  const applications = response?.data || [];

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
      <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Your Applications</Typography>
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
                    {application.type.replace(/_/g, ' ')}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {application.description}
                  </Typography>

                  <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
                    <LucideClock size={16} />
                    <Typography variant="body2" fontWeight={500}>
                      Submitted: {new Date(application.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                  </Stack>

                  {application.feedback && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary">FEEDBACK</Typography>
                      <Typography variant="body2">{application.feedback}</Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
