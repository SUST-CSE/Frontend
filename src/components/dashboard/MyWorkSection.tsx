import { 
  Box, 
  Paper, 
  Typography, 
  Stack, 
  Chip, 
  Button, 
  CircularProgress,
  Grid
} from '@mui/material';
import { useGetMyWorkQuery, useUpdateWorkStatusMutation } from '@/features/work-assignment/workAssignmentApi';
import { STATUS_COLORS } from '@/features/work-assignment/workAssignmentConstants';
import { LucideBriefcase, LucideClock, LucideCheckCircle2, LucideAlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyWorkSection() {
  const { data: response, isLoading, error } = useGetMyWorkQuery(undefined);
  const [updateStatus] = useUpdateWorkStatusMutation();
  const assignments = response?.data || [];

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
        <Typography>Failed to load assignments</Typography>
      </Box>
    );
  }

  if (assignments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
        <LucideBriefcase size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
        <Typography variant="h6">No work assigned yet</Typography>
        <Typography variant="body2">You&apos;re all caught up!</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Your Assignments</Typography>
      <Grid container spacing={3}>
        {assignments.map((assignment: any) => (
          <Grid item xs={12} key={assignment._id}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" gap={2}>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>{assignment.title}</Typography>
                    <Chip 
                      label={assignment.status} 
                      size="small" 
                      color={STATUS_COLORS[assignment.status] as any}
                      sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                    />
                  </Stack>
                  
                  <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                    {assignment.society?.name} • Assigned by {assignment.assignedBy?.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {assignment.description}
                  </Typography>

                  <Stack direction="row" alignItems="center" gap={1} color={new Date(assignment.deadline) < new Date() && assignment.status !== 'COMPLETED' ? 'error.main' : 'text.secondary'}>
                    <LucideClock size={16} />
                    <Typography variant="body2" fontWeight={500}>
                      Due: {new Date(assignment.deadline).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                  </Stack>
                </Box>

                {assignment.status !== 'COMPLETED' && (
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<LucideCheckCircle2 size={18} />}
                    onClick={async () => {
                      try {
                        await updateStatus({ id: assignment._id, status: 'COMPLETED' }).unwrap();
                        toast.success('Nice work! Marked as completed.');
                      } catch (err) {
                        toast.error('Failed to update status');
                      }
                    }}
                    sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', whiteSpace: 'nowrap' }}
                  >
                    Mark Complete
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
