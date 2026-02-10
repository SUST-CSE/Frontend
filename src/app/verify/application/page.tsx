'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LucideSearch, LucideCheckCircle, LucideShieldCheck } from 'lucide-react';
import { useGetApplicationByIdQuery } from '@/features/application/applicationApi';
import { APP_TYPE_LABELS, APP_STATUS_COLORS } from '@/features/application/applicationConstants';

export default function ApplicationVerificationPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { data: appData, isLoading, error } = useGetApplicationByIdQuery(verificationCode, {
    skip: !searchTriggered || !verificationCode,
  });

  const application = appData?.data;

  const handleSearch = () => {
    if (verificationCode.trim()) {
      setSearchTriggered(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 8 }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #e2e8f0' }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
              <LucideShieldCheck size={48} color="#002147" style={{ marginBottom: 16 }} />
              <Typography variant="h4" fontWeight={900} color="#002147" gutterBottom>
                Application Verification
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter the unique application code to verify authenticity
              </Typography>
            </Box>

            {/* Search Input */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                placeholder="Enter Application Code (e.g., APP-20260206-0001)"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.toUpperCase());
                  setSearchTriggered(false);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  sx: { borderRadius: 2, fontSize: '1rem', fontWeight: 600 },
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={!verificationCode.trim() || isLoading}
                startIcon={<LucideSearch size={20} />}
                sx={{
                  bgcolor: '#002147',
                  px: 4,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#003366' },
                }}
              >
                Verify
              </Button>
            </Stack>

            <Divider />

            {/* Loading State */}
            {isLoading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={32} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Verifying application...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {searchTriggered && error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Application Not Found
                </Typography>
                <Typography variant="caption">
                  The code you entered does not match any approved application. Please verify and try again.
                </Typography>
              </Alert>
            )}

            {/* Application Found */}
            {searchTriggered && !isLoading && application && (
              <Stack spacing={3}>
                {/* Verification Badge */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: '#f0fdf4',
                    border: '2px solid #86efac',
                    textAlign: 'center',
                  }}
                >
                  <LucideCheckCircle size={40} color="#16a34a" style={{ marginBottom: 8 }} />
                  <Typography variant="h6" fontWeight={800} color="#16a34a">
                    Application Verified
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    This is an authentic approved application
                  </Typography>
                </Box>

                {/* Application Details */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                    Application Details
                  </Typography>
                  <Typography variant="h6" fontWeight={800} color="#002147" sx={{ mt: 1 }}>
                    {application.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      label={APP_TYPE_LABELS[application.type]}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                    <Chip
                      label={application.status}
                      size="small"
                      color={APP_STATUS_COLORS[application.status]}
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {application.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Submitter Info */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                    Submitted By
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>
                    {application.submittedBy?.name}
                  </Typography>
                  {application.submittedBy?.studentId && (
                    <Typography variant="caption" color="text.secondary">
                      ID: {application.submittedBy.studentId}
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Approval Trail */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, mb: 2, display: 'block' }}>
                    Approval Trail
                  </Typography>
                  <Stack spacing={2}>
                    {/* L0 */}
                    {application.approvalTrail?.l0 && (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Typography variant="caption" fontWeight={800} color="#16a34a" display="block">
                          ✓ STAGE L0: REVIEW
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          Reviewed by {application.approvalTrail.l0.reviewer?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(application.approvalTrail.l0.date).toLocaleString()}
                        </Typography>
                      </Box>
                    )}

                    {/* L1 */}
                    {application.approvalTrail?.l1 && (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Typography variant="caption" fontWeight={800} color="#16a34a" display="block">
                          ✓ STAGE L1: {application.medium?.name || 'MEDIUM'}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Signed by {application.approvalTrail.l1.reviewer?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(application.approvalTrail.l1.date).toLocaleString()}
                            </Typography>
                          </Box>
                          {application.approvalTrail.l1.signatureUrl && (
                            <Box sx={{ textAlign: 'center' }}>
                              <img
                                src={application.approvalTrail.l1.signatureUrl}
                                alt="L1 Signature"
                                style={{ height: 40, display: 'block' }}
                              />
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>
                                Digital Signature
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* L2 */}
                    {application.approvalTrail?.l2 && (
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid #86efac' }}>
                        <Typography variant="caption" fontWeight={800} color="#16a34a" display="block">
                          ✓ STAGE L2: {application.to?.name}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Final approved by {application.approvalTrail.l2.reviewer?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(application.approvalTrail.l2.date).toLocaleString()}
                            </Typography>
                          </Box>
                          {application.approvalTrail.l2.signatureUrl && (
                            <Box sx={{ textAlign: 'center' }}>
                              <img
                                src={application.approvalTrail.l2.signatureUrl}
                                alt="L2 Signature"
                                style={{ height: 40, display: 'block' }}
                              />
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>
                                Digital Signature
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                </Box>

                {/* Unique Code */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" fontWeight={800} color="#1d4ed8" display="block">
                    VERIFICATION CODE
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#1e40af" sx={{ letterSpacing: 3, mt: 1 }}>
                    {application.uniqueCode}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* Footer */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
          © 2026 Department of CSE, SUST. All applications are securely verified.
        </Typography>
      </Container>
    </Box>
  );
}
