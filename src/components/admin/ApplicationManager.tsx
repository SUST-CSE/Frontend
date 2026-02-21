'use client';

import { useState } from 'react';
import {
  Box,
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
  MenuItem,
  Alert,
} from '@mui/material';
import {
  LucideFileText,
  LucideCheckCircle,
  LucideXCircle,
  LucideEye,
  LucideDownload,
  LucideMessageSquare,
  LucideUser,
  LucidePrinter,
} from 'lucide-react';
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useApproveApplicationStageMutation,
} from '@/features/application/applicationApi';
import { useGetApproversQuery, useGetUserByIdQuery } from '@/features/user/userApi';
import {
  APPLICATION_STATUS,
  APP_STATUS_COLORS,
  APP_TYPE_LABELS
} from '@/features/application/applicationConstants';
import toast from 'react-hot-toast';
import { Divider } from '@mui/material';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function ApplicationManager() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { data: currentUserData } = useGetUserByIdQuery(user?.id, { skip: !user?.id });
  const currentUser = currentUserData?.data || currentUserData; // Handle potential wrapper

  const permissions = user?.permissions || [];
  const isAdmin = user?.role === 'ADMIN';

  const hasSignature = !!currentUser?.signatureUrl;

  // Check if user is assigned reviewer for the selected app
  const isAssignedL0 = selectedApp?.l0Reviewer?._id === user?.id || selectedApp?.l0Reviewer === user?.id;
  const isAssignedL1 = selectedApp?.medium?._id === user?.id || selectedApp?.medium === user?.id;
  const isAssignedL2 = selectedApp?.to?._id === user?.id || selectedApp?.to === user?.id;

  const canApproveL0 = isAdmin || permissions?.includes('APPROVE_APPLICATION_L0') || isAssignedL0;
  const canApproveL1 = isAdmin || permissions?.includes('APPROVE_APPLICATION_L1') || isAssignedL1;
  const canApproveL2 = isAdmin || permissions?.includes('APPROVE_APPLICATION_L2') || isAssignedL2;

  // Show warning only if relevant to current stage and user can approve
  const showSignatureWarning = selectedApp && !hasSignature && (
    (selectedApp.status === APPLICATION_STATUS.PENDING_L1 && canApproveL1) ||
    (selectedApp.status === APPLICATION_STATUS.PENDING_L2 && canApproveL2)
  );

  const { data: approversData } = useGetApproversQuery({ limit: 100 });
  const approvers = approversData?.data?.users || approversData?.users || [];

  const statusFilter = activeTab === 0
    ? { status: [APPLICATION_STATUS.PENDING_L0, APPLICATION_STATUS.PENDING_L1, APPLICATION_STATUS.PENDING_L2].join(',') }
    : undefined;

  const { data: appsData, isLoading } = useGetApplicationsQuery(statusFilter);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [approveStage, { isLoading: isApprovingStage }] = useApproveApplicationStageMutation();

  const applications = appsData?.data || [];

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateStatus({
        id: selectedApp._id,
        status,
        feedback: adminFeedback
      }).unwrap();
      toast.success(`Application status updated successfully`);
      setOpenReviewDialog(false);
      setSelectedApp(null);
      setAdminFeedback('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update application');
    }
  };

  const handleStageApproval = async (stage: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await approveStage({
        id: selectedApp._id,
        stage,
        status,
        feedback: adminFeedback
      }).unwrap();
      toast.success(`Stage ${stage.toUpperCase()} ${status.toLowerCase()} successfully`);
      setOpenReviewDialog(false);
      setSelectedApp(null);
      setAdminFeedback('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to process stage approval');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LucideFileText size={28} />
          Application Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and process student applications for leave, equipment, and more
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ px: 2, pt: 1, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <Tab label="Pending Review" sx={{ fontWeight: 700, fontSize: '0.8rem' }} />
          <Tab label="All Applications" sx={{ fontWeight: 700, fontSize: '0.8rem' }} />
        </Tabs>

        <TableContainer>
          {isLoading ? (
            <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress size={24} /></Box>
          ) : (
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={app.submittedBy?.profileImage} sx={{ width: 28, height: 28 }}>
                          {app.submittedBy?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>{app.submittedBy?.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{app.submittedBy?.studentId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={APP_TYPE_LABELS[app.type]} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.75rem' }} noWrap>{app.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(app.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        size="small"
                        color={APP_STATUS_COLORS[app.status]}
                        sx={{ fontWeight: 800, fontSize: '0.6rem', height: 18 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<LucideEye size={14} />}
                        onClick={() => {
                          setSelectedApp(app);
                          setOpenReviewDialog(true);
                        }}
                        sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem' }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 5, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No applications found</Typography>
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
        <DialogContent sx={{ py: 2 }}>
          {selectedApp && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  Submitted By
                </Typography>
                <Typography variant="subtitle1" fontWeight={700}>{selectedApp.submittedBy?.name} ({selectedApp.submittedBy?.studentId})</Typography>
                <Typography variant="body2" color="text.secondary">{selectedApp.submittedBy?.email}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  Application Details
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mt: 0.5 }}>{selectedApp.title}</Typography>
                <Chip label={APP_TYPE_LABELS[selectedApp.type]} size="small" sx={{ mt: 0.5, mb: 1.5 }} />
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  {selectedApp.description}
                </Typography>
              </Box>

              {/* Official Signed Document with Inline PDF Viewer */}
              {selectedApp.signedPdfUrl && (
                <Box sx={{ borderRadius: 3, bgcolor: '#f0f9ff', border: '1px solid #bae6fd', overflow: 'hidden' }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <LucideFileText size={24} color="#0369a1" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={800} color="#0369a1">Official Signed Document</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedApp.status === 'APPROVED' ? 'Finalized document with all signatures' : 'Evolutionary document with current signatures'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<LucideEye size={16} />}
                      onClick={() => setShowPdfViewer(!showPdfViewer)}
                      sx={{ borderRadius: 2, bgcolor: showPdfViewer ? '#475569' : '#0369a1', fontWeight: 700 }}
                    >
                      {showPdfViewer ? 'Hide PDF' : 'View PDF'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<LucideDownload size={16} />}
                      href={selectedApp.signedPdfUrl}
                      target="_blank"
                      download
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      Download
                    </Button>
                  </Stack>
                  {showPdfViewer && (
                    <Box sx={{ borderTop: '1px solid #bae6fd', bgcolor: '#e2e8f0', minHeight: 500 }}>
                      <object
                        data={`${selectedApp.signedPdfUrl}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        style={{ width: '100%', height: 600, display: 'block' }}
                      >
                        <iframe
                          src={`${selectedApp.signedPdfUrl}#toolbar=1&navpanes=0`}
                          style={{ width: '100%', height: 600, border: 'none', display: 'block' }}
                          title="Application PDF"
                        >
                          <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Your browser doesn't support PDF viewing.
                            </Typography>
                            <Button
                              variant="contained"
                              href={selectedApp.signedPdfUrl}
                              target="_blank"
                              startIcon={<LucideDownload size={16} />}
                            >
                              Download PDF to View
                            </Button>
                          </Box>
                        </iframe>
                      </object>
                      <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" color="text.secondary">
                          Can't see the document?{' '}
                          <a href={selectedApp.signedPdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', fontWeight: 700 }}>
                            Open in new tab
                          </a>
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Signature Warning */}
              {showSignatureWarning && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Missing Digital Signature</Typography>
                  <Typography variant="body2">
                    You need to upload a digital signature in your <strong>Account Settings</strong> before you can sign and approve applications.
                  </Typography>
                </Alert>
              )}

              {selectedApp.attachments?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                    Attachments
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 0.5 }}>
                    {selectedApp.attachments.map((url: string, i: number) => {
                      const isPDF = url.toLowerCase().endsWith('.pdf') || url.includes('/upload/') && url.includes('.pdf');
                      return (
                        <Box key={i} sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          bgcolor: '#f8fafc',
                          borderRadius: 2,
                          border: '1px solid #e2e8f0'
                        }}>
                          <LucideFileText size={20} color="#475569" />
                          <Typography variant="body2" sx={{ flex: 1, fontSize: '0.75rem' }}>
                            {isPDF ? 'Document' : 'Attachment'} {i + 1}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LucideEye size={14} />}
                            onClick={() => window.open(url, '_blank')}
                            sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1.5 }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LucideDownload size={14} />}
                            href={url}
                            download
                            target="_blank"
                            sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1.5 }}
                          >
                            Download
                          </Button>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              )}

              <Divider />

              <Divider />

              {/* Reviewer Assignment (Admin only) */}
              <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: 2, border: '1px solid #fef3c7' }}>
                <Typography variant="caption" fontWeight={800} color="#92400e" display="block" gutterBottom>REVIEWER CHAIN CONFIGURATION</Typography>
                <Stack spacing={2}>
                  {/* L0 Reviewer */}
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="L0 Reviewer (Initial Review)"
                    value={selectedApp.l0Reviewer?._id || selectedApp.l0Reviewer || ''}
                    onChange={async (e) => {
                      try {
                        await updateStatus({
                          id: selectedApp._id,
                          l0Reviewer: e.target.value
                        }).unwrap();
                        toast.success('L0 Reviewer assigned');
                        // Optimistically update or refetch handled by tag invalidation
                      } catch (err) {
                        toast.error('Failed to assign L0 reviewer');
                      }
                    }}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {approvers.map((user: any) => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                  </TextField>

                  {/* L1 Medium */}
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="L1 / Medium (Intermediate)"
                    value={selectedApp.medium?._id || selectedApp.medium || ''}
                    onChange={async (e) => {
                      try {
                        await updateStatus({
                          id: selectedApp._id,
                          medium: e.target.value
                        }).unwrap();
                        toast.success('L1 Reviewer assigned');
                      } catch (err) {
                        toast.error('Failed to assign L1 reviewer');
                      }
                    }}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {approvers.map((user: any) => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                  </TextField>

                  {/* L2 Final */}
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="L2 / To (Final Approver)"
                    value={selectedApp.to?._id || selectedApp.to || ''}
                    onChange={async (e) => {
                      try {
                        await updateStatus({
                          id: selectedApp._id,
                          to: e.target.value
                        }).unwrap();
                        toast.success('L2 Reviewer assigned');
                      } catch (err) {
                        toast.error('Failed to assign L2 reviewer');
                      }
                    }}
                  >
                    {approvers.map((user: any) => (
                      <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, mb: 1, display: 'block' }}>
                  Approval Trail
                </Typography>
                <Stack spacing={2}>
                  {/* L0 Trail */}
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: selectedApp.approvalTrail?.l0 ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" fontWeight={800} color="#64748b">STAGE L0: REVIEW</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{selectedApp.approvalTrail?.l0 ? `Reviewed by ${selectedApp.approvalTrail.l0.reviewer?.name || 'Authorized Reviewer'}` : 'Awaiting Review'}</Typography>
                      {selectedApp.approvalTrail?.l0 && <Chip label="PASSED" size="small" color="success" sx={{ height: 16, fontSize: '0.6rem' }} />}
                    </Stack>
                  </Box>

                  {/* L1 Trail */}
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: selectedApp.approvalTrail?.l1 ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" fontWeight={800} color="#64748b">STAGE L1: MEDIUM ({selectedApp.medium?.name || 'N/A'})</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body2">{selectedApp.approvalTrail?.l1 ? `Signed by ${selectedApp.approvalTrail.l1.reviewer?.name || 'Authorized Reviewer'}` : 'Awaiting Signature'}</Typography>
                        {selectedApp.approvalTrail?.l1?.date && <Typography variant="caption" color="text.secondary">{new Date(selectedApp.approvalTrail.l1.date).toLocaleDateString()}</Typography>}
                      </Box>
                      {selectedApp.approvalTrail?.l1?.signatureUrl && (
                        <Box sx={{ textAlign: 'center' }}>
                          <img src={selectedApp.approvalTrail.l1.signatureUrl} alt="L1 Sign" style={{ height: 30, display: 'block' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.5rem' }}>Digital Signature</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {/* L2 Trail */}
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: selectedApp.approvalTrail?.l2 ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Typography variant="caption" fontWeight={800} color="#64748b">STAGE L2: TO ({selectedApp.to?.name})</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body2">{selectedApp.approvalTrail?.l2 ? `Signed by ${selectedApp.approvalTrail.l2.reviewer?.name || 'Authorized Reviewer'}` : 'Awaiting Final Signature'}</Typography>
                        {selectedApp.approvalTrail?.l2?.date && <Typography variant="caption" color="text.secondary">{new Date(selectedApp.approvalTrail.l2.date).toLocaleDateString()}</Typography>}
                      </Box>
                      {selectedApp.approvalTrail?.l2?.signatureUrl && (
                        <Box sx={{ textAlign: 'center' }}>
                          <img src={selectedApp.approvalTrail.l2.signatureUrl} alt="L2 Sign" style={{ height: 30, display: 'block' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.5rem' }}>Digital Signature</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {selectedApp.uniqueCode && (
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={800} color="#1d4ed8" display="block">AUTHENTICATION CODE</Typography>
                      <Typography variant="h6" fontWeight={900} color="#1e40af" sx={{ letterSpacing: 2 }}>{selectedApp.uniqueCode}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LucideMessageSquare size={14} />
                  Admin Feedback
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Provide reasons for approval or rejection..."
                  sx={{ mt: 0.5 }}
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
          <Button
            startIcon={<LucidePrinter size={16} />}
            onClick={() => window.print()}
            size="small"
            sx={{ mr: 1, color: '#475569' }}
          >
            Print
          </Button>
          <Button onClick={() => setOpenReviewDialog(false)} size="small" sx={{ color: '#64748b' }}>Cancel</Button>
          <Box sx={{ flexGrow: 1 }} />

          {selectedApp && (
            <>
              {/* L0 Review Stage */}
              {selectedApp.status === APPLICATION_STATUS.PENDING_L0 && canApproveL0 && (
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleStageApproval('l0', 'REJECTED')}>Reject L0</Button>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleStageApproval('l0', 'APPROVED')}>Approve L0</Button>
                </Stack>
              )}

              {/* L1 Medium Stage */}
              {selectedApp.status === APPLICATION_STATUS.PENDING_L1 && canApproveL1 && (
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleStageApproval('l1', 'REJECTED')}>Reject L1</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleStageApproval('l1', 'APPROVED')}
                    startIcon={<LucideCheckCircle size={16} />}
                    disabled={showSignatureWarning}
                  >
                    Sign & Approve L1
                  </Button>
                </Stack>
              )}

              {/* L2 Final Stage */}
              {selectedApp.status === APPLICATION_STATUS.PENDING_L2 && canApproveL2 && (
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleStageApproval('l2', 'REJECTED')}>Reject L2</Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleStageApproval('l2', 'APPROVED')}
                    startIcon={<LucideCheckCircle size={16} />}
                    disabled={showSignatureWarning}
                  >
                    Final Sign & Approve
                  </Button>
                </Stack>
              )}
            </>
          )}

          {/* Legacy single-stage or admin override if needed (Optional) */}
          {selectedApp?.status === 'PENDING' && (
            <>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<LucideXCircle size={16} />}
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(APPLICATION_STATUS.REJECTED)}
                sx={{ fontWeight: 700 }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<LucideCheckCircle size={16} />}
                disabled={isUpdating}
                onClick={() => handleStatusUpdate(APPLICATION_STATUS.APPROVED)}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Official Print Layout (Hidden on Screen) */}
      <Box id="official-print-layout" sx={{ display: 'none', '@media print': { display: 'block', p: 4, bgcolor: '#fff', color: '#000' } }}>
        <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #002147', pb: 2 }}>
          <Typography variant="h4" fontWeight={900} color="#002147" sx={{ textTransform: 'uppercase' }}>
            Department of Computer Science and Engineering
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color="#002147">
            Shahjalal University of Science and Technology, Sylhet
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Official Application Record • {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        {selectedApp && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" fontWeight={800} color="text.secondary">REF CODE</Typography>
                <Typography variant="h6" fontWeight={800} color="primary">{selectedApp.uniqueCode || 'PENDING'}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary">SUBMISSION DATE</Typography>
                <Typography variant="body1" fontWeight={700}>{new Date(selectedApp.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={800} gutterBottom sx={{ borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                {selectedApp.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {selectedApp.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                Applicant Information
              </Typography>
              <Typography variant="body1"><strong>Name:</strong> {selectedApp.submittedBy?.name}</Typography>
              <Typography variant="body1"><strong>Student ID:</strong> {selectedApp.submittedBy?.studentId}</Typography>
              <Typography variant="body1"><strong>Email:</strong> {selectedApp.submittedBy?.email}</Typography>
            </Box>

            <Box sx={{ mt: 8 }}>
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                Approval & Endorsement
              </Typography>

              <Stack direction="row" spacing={4} justifyContent="space-between" sx={{ mt: 4 }}>
                {/* L1 Signature */}
                <Box sx={{ flex: 1, textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" display="block" sx={{ mb: 2 }}>
                    RECOMMENDED BY (L1)
                  </Typography>
                  {selectedApp.approvalTrail?.l1?.signatureUrl ? (
                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={selectedApp.approvalTrail.l1.signatureUrl} alt="L1 Signature" style={{ maxHeight: '100%', maxWidth: '150px' }} />
                    </Box>
                  ) : (
                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Awaiting Signature</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {selectedApp.approvalTrail?.l1?.reviewer?.name || selectedApp.medium?.name || 'Authorized Reviewer'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedApp.approvalTrail?.l1?.date ? new Date(selectedApp.approvalTrail.l1.date).toLocaleDateString() : 'Date Pending'}
                  </Typography>
                </Box>

                {/* L2 Signature */}
                <Box sx={{ flex: 1, textAlign: 'center', p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" display="block" sx={{ mb: 2 }}>
                    APPROVED BY (L2)
                  </Typography>
                  {selectedApp.approvalTrail?.l2?.signatureUrl ? (
                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={selectedApp.approvalTrail.l2.signatureUrl} alt="L2 Signature" style={{ maxHeight: '100%', maxWidth: '150px' }} />
                    </Box>
                  ) : (
                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Awaiting Signature</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {selectedApp.approvalTrail?.l2?.reviewer?.name || selectedApp.to?.name || 'Authorized Reviewer'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedApp.approvalTrail?.l2?.date ? new Date(selectedApp.approvalTrail.l2.date).toLocaleDateString() : 'Date Pending'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ mt: 10, pt: 2, borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                This is a digitally verified document from the SUST CSE Application Management System.
                <br />
                Verify authenticity at: <strong>{window.location.origin}/verify/application</strong> using code: <strong>{selectedApp.uniqueCode}</strong>
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
