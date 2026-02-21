'use client';

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
  MenuItem,
  Alert,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useGetMyApplicationsQuery, useSubmitApplicationMutation } from '@/features/application/applicationApi';
import { APP_STATUS_COLORS, APPLICATION_TYPE, APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import {
  LucideFileText,
  LucideClock,
  LucideAlertCircle,
  LucidePlus,
  LucideFileUp,
  LucideEye,
  LucideDownload,
  LucideX,
  LucideCheckCircle2,
  LucideHourglass,
  LucideXCircle,
  LucideShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_INFO: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  PENDING_L0: { label: 'Awaiting Initial Review', icon: <LucideHourglass size={14} />, color: '#92400e', bg: '#fffbeb' },
  PENDING_L1: { label: 'Awaiting Medium Signature', icon: <LucideHourglass size={14} />, color: '#1d4ed8', bg: '#eff6ff' },
  PENDING_L2: { label: 'Awaiting Final Approval', icon: <LucideHourglass size={14} />, color: '#9333ea', bg: '#faf5ff' },
  APPROVED: { label: 'Approved & Signed', icon: <LucideCheckCircle2 size={14} />, color: '#15803d', bg: '#f0fdf4' },
  REJECTED: { label: 'Rejected', icon: <LucideXCircle size={14} />, color: '#dc2626', bg: '#fef2f2' },
};

export default function MyApplicationsSection() {
  const { data: response, isLoading, error } = useGetMyApplicationsQuery(undefined);
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const applications = response?.data || [];

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'GENERAL' });
  const [file, setFile] = useState<File | null>(null);
  const [submissionMode, setSubmissionMode] = useState<'TEXT' | 'PDF'>('TEXT');

  // PDF Viewer state
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

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
      body.append('submissionMode', submissionMode);

      if (submissionMode === 'PDF' && file) {
        body.append('file', file);
      } else if (submissionMode === 'TEXT') {
        body.append('textContent', formData.description);
      }

      await submitApplication(body).unwrap();
      toast.success('Application submitted successfully!');
      setOpenDialog(false);
      setFormData({ title: '', description: '', type: 'GENERAL' });
      setFile(null);
      setSubmissionMode('TEXT');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit application');
    }
  };

  const openPdfView = (app: any) => {
    setViewingApp(app);
    setShowPdfViewer(true);
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
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary', bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
          <LucideFileText size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <Typography variant="h6">No applications submitted</Typography>
          <Typography variant="body2">Click &apos;New Application&apos; to get started.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application: any) => {
            const statusInfo = STATUS_INFO[application.status];
            const hasPdf = !!(application.signedPdfUrl || (application.attachments?.length > 0));
            const pdfUrl = application.signedPdfUrl || application.attachments?.[0];

            return (
              <Grid size={{ xs: 12 }} key={application._id}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.06)' } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" gap={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Title & type */}
                      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }} flexWrap="wrap">
                        <Typography variant="h6" fontWeight={700} noWrap>{application.title}</Typography>
                        <Chip
                          label={application.status?.replace(/_/g, ' ')}
                          size="small"
                          color={APP_STATUS_COLORS[application.status] as any}
                          sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                        />
                      </Stack>

                      <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                        {APP_TYPE_LABELS[application.type] || application.type?.replace(/_/g, ' ')}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {application.description}
                      </Typography>

                      {/* Status Progress Banner */}
                      {statusInfo && (
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, borderRadius: 2, bgcolor: statusInfo.bg, color: statusInfo.color, mb: 2 }}>
                          {statusInfo.icon}
                          <Typography variant="caption" fontWeight={700}>{statusInfo.label}</Typography>
                        </Box>
                      )}

                      {/* Approval Trail Summary */}
                      {(application.approvalTrail?.l0 || application.approvalTrail?.l1 || application.approvalTrail?.l2) && (
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                          {application.approvalTrail?.l0 && (
                            <Chip icon={<LucideCheckCircle2 size={12} />} label="L0 Reviewed" size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                          )}
                          {application.approvalTrail?.l1 && (
                            <Chip icon={<LucideShieldCheck size={12} />} label="L1 Signed" size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                          )}
                          {application.approvalTrail?.l2 && (
                            <Chip icon={<LucideShieldCheck size={12} />} label="L2 Approved" size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                          )}
                        </Stack>
                      )}

                      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
                        <Stack direction="row" alignItems="center" gap={1} color="text.secondary">
                          <LucideClock size={14} />
                          <Typography variant="body2" fontWeight={500}>
                            {new Date(application.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </Typography>
                        </Stack>

                        {/* Signed PDF Badge (when available) */}
                        {application.signedPdfUrl && (
                          <Chip
                            icon={<LucideShieldCheck size={12} />}
                            label="Signed Document Available"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                          />
                        )}
                      </Stack>

                      {/* Feedback from admin */}
                      {application.feedback && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#fef9c3', borderRadius: 2, border: '1px solid #fde68a' }}>
                          <Typography variant="caption" fontWeight={700} color="#92400e">ADMIN FEEDBACK</Typography>
                          <Typography variant="body2" color="#78350f">{application.feedback}</Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Actions */}
                    {hasPdf && (
                      <Stack spacing={1} sx={{ minWidth: 130 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<LucideEye size={14} />}
                          onClick={() => openPdfView(application)}
                          sx={{ bgcolor: '#002147', fontWeight: 700, borderRadius: 2, fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          View PDF
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<LucideDownload size={14} />}
                          href={pdfUrl}
                          target="_blank"
                          download
                          sx={{ fontWeight: 700, borderRadius: 2, fontSize: '0.75rem', textTransform: 'none' }}
                        >
                          Download
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Inline PDF Viewer Dialog */}
      <Dialog open={showPdfViewer} onClose={() => setShowPdfViewer(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LucideFileText size={20} color="#002147" />
            <Box>
              <Typography variant="subtitle1" fontWeight={800}>{viewingApp?.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {viewingApp?.signedPdfUrl ? 'Official Signed Document' : 'Submitted Attachment'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            {(viewingApp?.signedPdfUrl || viewingApp?.attachments?.[0]) && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<LucideDownload size={14} />}
                href={viewingApp?.signedPdfUrl || viewingApp?.attachments?.[0]}
                target="_blank"
                download
                sx={{ fontWeight: 700, borderRadius: 2, fontSize: '0.75rem', textTransform: 'none' }}
              >
                Download
              </Button>
            )}
            <IconButton size="small" onClick={() => setShowPdfViewer(false)}>
              <LucideX size={18} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0, bgcolor: '#e2e8f0', minHeight: 600 }}>
          {viewingApp && (
            <>
              {/* Signature trail quick view */}
              {(viewingApp.approvalTrail?.l1?.signatureUrl || viewingApp.approvalTrail?.l2?.signatureUrl) && (
                <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                  <Typography variant="caption" fontWeight={800} color="#15803d" display="block" sx={{ mb: 1 }}>DIGITAL SIGNATURES</Typography>
                  <Stack direction="row" spacing={3}>
                    {viewingApp.approvalTrail?.l1?.signatureUrl && (
                      <Box sx={{ textAlign: 'center' }}>
                        <img src={viewingApp.approvalTrail.l1.signatureUrl} alt="L1 Signature" style={{ height: 40, display: 'block', marginBottom: 4 }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {viewingApp.approvalTrail.l1.reviewer?.name || viewingApp.medium?.name || 'L1 Reviewer'}
                        </Typography>
                      </Box>
                    )}
                    {viewingApp.approvalTrail?.l2?.signatureUrl && (
                      <Box sx={{ textAlign: 'center' }}>
                        <img src={viewingApp.approvalTrail.l2.signatureUrl} alt="L2 Signature" style={{ height: 40, display: 'block', marginBottom: 4 }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {viewingApp.approvalTrail.l2.reviewer?.name || viewingApp.to?.name || 'L2 Reviewer'}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              )}

              {/* PDF Embed */}
              <object
                data={`${viewingApp.signedPdfUrl || viewingApp.attachments?.[0]}#toolbar=1&navpanes=0`}
                type="application/pdf"
                style={{ width: '100%', height: 650, display: 'block' }}
              >
                <iframe
                  src={`${viewingApp.signedPdfUrl || viewingApp.attachments?.[0]}#toolbar=1&navpanes=0`}
                  style={{ width: '100%', height: 650, border: 'none', display: 'block' }}
                  title="Application PDF"
                >
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', height: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <LucideFileText size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
                    <Typography variant="body1" fontWeight={700} gutterBottom>Cannot display PDF inline</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Your browser doesn&apos;t support inline PDF viewing.
                    </Typography>
                    <Button
                      variant="contained"
                      href={viewingApp.signedPdfUrl || viewingApp.attachments?.[0]}
                      target="_blank"
                      startIcon={<LucideDownload size={16} />}
                      sx={{ bgcolor: '#002147' }}
                    >
                      Download PDF to View
                    </Button>
                  </Box>
                </iframe>
              </object>

              {/* Open in new tab fallback */}
              <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Typography variant="caption" color="text.secondary">
                  Can&apos;t see the document?{' '}
                  <a
                    href={viewingApp.signedPdfUrl || viewingApp.attachments?.[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#002147', fontWeight: 700 }}
                  >
                    Open in new tab
                  </a>
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Submission Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #f1f5f9' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LucideFileText size={20} color="#002147" />
            <span>Submit New Application</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
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
                <MenuItem key={key} value={key}>{label as string}</MenuItem>
              ))}
            </TextField>

            {/* Submission Mode Toggle */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" gutterBottom display="block">
                SUBMISSION METHOD
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={submissionMode === 'TEXT' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSubmissionMode('TEXT')}
                  sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', bgcolor: submissionMode === 'TEXT' ? '#002147' : undefined }}
                >
                  Write Text
                </Button>
                <Button
                  variant={submissionMode === 'PDF' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setSubmissionMode('PDF')}
                  sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', bgcolor: submissionMode === 'PDF' ? '#002147' : undefined }}
                >
                  Upload PDF
                </Button>
              </Stack>
            </Box>

            {submissionMode === 'TEXT' ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Application Content"
                  placeholder="Write your full application here. A PDF will be automatically generated with your digital signature area..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Your application will be automatically formatted into an official PDF document and sent to the department for review.
                </Alert>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Brief Description"
                  placeholder="Briefly describe the purpose of this application..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<LucideFileUp size={20} />}
                    sx={{ borderStyle: 'dashed', py: 2, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                  >
                    {file ? file.name : 'Upload PDF Document'}
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </Button>
                  {file && (
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1, p: 1, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                      <Typography variant="caption" fontWeight={700} color="#15803d">{file.name}</Typography>
                      <IconButton size="small" onClick={() => setFile(null)}><LucideX size={14} /></IconButton>
                    </Stack>
                  )}
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={isSubmitting || (submissionMode === 'PDF' && !file)}
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
