'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LucideFileText,
  LucideCheckCircle,
  LucideXCircle,
  LucideEye,
  LucideDownload,
  LucideMessageSquare,
} from 'lucide-react';
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from '@/features/application/applicationApi';
import { 
  APPLICATION_STATUS, 
  APP_STATUS_COLORS, 
  APP_TYPE_LABELS 
} from '@/features/application/applicationConstants';
import toast from 'react-hot-toast';

export default function AdminApplicationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState('');

  const statusFilter = activeTab === 0 ? APPLICATION_STATUS.PENDING : undefined;
  const { data: appsData, isLoading } = useGetApplicationsQuery({ status: statusFilter });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();

  const applications = appsData?.data || [];

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({ 
        id: selectedApp._id, 
        status, 
        feedback: adminFeedback 
      }).unwrap();
      toast.success(`Application ${status.toLowerCase()} successfully`);
      setOpenReviewDialog(false);
      setSelectedApp(null);
      setAdminFeedback('');
    } catch (err) {
      toast.error('Failed to update application');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LucideFileText size={32} />
          Application Management
        </Typography>
        <Typography color="text.secondary">
          Review and process student applications for leave, equipment, and more
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, v) => setActiveTab(v)}
          sx={{ px: 3, pt: 2, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <Tab label="Pending Review" sx={{ fontWeight: 700 }} />
          <Tab label="All Applications" sx={{ fontWeight: 700 }} />
        </Tabs>

        <TableContainer>
          {isLoading ? (
            <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date Submitted</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={app.submittedBy?.profileImage} sx={{ width: 32, height: 32 }}>
                          {app.submittedBy?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{app.submittedBy?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{app.submittedBy?.studentId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={APP_TYPE_LABELS[app.type]} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{app.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(app.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.status} 
                        size="small" 
                        color={APP_STATUS_COLORS[app.status]} 
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        startIcon={<LucideEye size={16} />}
                        onClick={() => {
                          setSelectedApp(app);
                          setOpenReviewDialog(true);
                        }}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
                      <Typography color="text.secondary">No applications found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #f1f5f9' }}>
          Review Application
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedApp && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                  Submitted By
                </Typography>
                <Typography variant="h6" fontWeight={700}>{selectedApp.submittedBy?.name} ({selectedApp.submittedBy?.studentId})</Typography>
                <Typography variant="body2" color="text.secondary">{selectedApp.submittedBy?.email}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                  Application Details
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>{selectedApp.title}</Typography>
                <Chip label={APP_TYPE_LABELS[selectedApp.type]} size="small" sx={{ mt: 1, mb: 2 }} />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  {selectedApp.description}
                </Typography>
              </Box>

              {selectedApp.attachments?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                    Attachments
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {selectedApp.attachments.map((url: string, i: number) => (
                      <Button 
                        key={i} 
                        variant="outlined" 
                        size="small" 
                        startIcon={<LucideDownload size={14} />}
                        href={url}
                        target="_blank"
                      >
                        Attachment {i + 1}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LucideMessageSquare size={14} />
                  Admin Feedback
                </Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={3} 
                  placeholder="Provide reasons for approval or rejection..."
                  sx={{ mt: 1 }}
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenReviewDialog(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Box sx={{ flexGrow: 1 }} />
          {selectedApp?.status === APPLICATION_STATUS.PENDING && (
            <>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<LucideXCircle size={18} />}
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(APPLICATION_STATUS.REJECTED)}
                sx={{ fontWeight: 700 }}
              >
                Reject Application
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<LucideCheckCircle size={18} />}
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(APPLICATION_STATUS.APPROVED)}
                sx={{ fontWeight: 700, px: 4 }}
              >
                Approve Application
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
