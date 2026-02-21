'use client';

import { useState, use } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Stack,
    Button,
    Divider,
    Avatar,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
} from '@mui/material';
import {
    LucideArrowLeft,
    LucideFileText,
    LucideDownload,
    LucideEye,
    LucideCheckCircle,
    LucideClock,
    LucideXCircle,
    LucideShieldCheck,
    LucideUser,
    LucidePenTool,
} from 'lucide-react';
import { useGetApplicationByIdQuery } from '@/features/application/applicationApi';
import { APP_STATUS_COLORS, APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import Link from 'next/link';

const STEPS_WITH_MEDIUM = ['Submitted', 'L0 Review', 'L1 Endorsement', 'L2 Final Approval'];
const STEPS_NO_MEDIUM = ['Submitted', 'L0 Review', 'L2 Final Approval'];

function getActiveStep(status: string, hasMedium: boolean) {
    if (!hasMedium) {
        switch (status) {
            case 'PENDING_L0': return 1;
            case 'PENDING_L2': return 2;
            case 'APPROVED': return 3;
            case 'REJECTED': return -1;
            default: return 0;
        }
    }
    switch (status) {
        case 'PENDING_L0': return 1;
        case 'PENDING_L1': return 2;
        case 'PENDING_L2': return 3;
        case 'APPROVED': return 4;
        case 'REJECTED': return -1;
        default: return 0;
    }
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: appData, isLoading } = useGetApplicationByIdQuery(id);
    const application = appData?.data;

    const [showPdfViewer, setShowPdfViewer] = useState(false);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!application) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h5" color="error">Application not found</Typography>
            </Container>
        );
    }

    const hasMedium = !!application.medium;
    const steps = hasMedium ? STEPS_WITH_MEDIUM : STEPS_NO_MEDIUM;
    const activeStep = getActiveStep(application.status, hasMedium);
    const isRejected = application.status === 'REJECTED';

    return (
        <Box sx={{ py: 6, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Container maxWidth="md">
                <Button
                    component={Link}
                    href="/applications"
                    startIcon={<LucideArrowLeft size={18} />}
                    sx={{ mb: 4, textTransform: 'none', color: '#64748b' }}
                >
                    Back to Applications
                </Button>

                {/* Header */}
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Chip label={APP_TYPE_LABELS[application.type] || application.type} size="small" variant="outlined" />
                                <Chip
                                    label={application.status}
                                    size="small"
                                    color={APP_STATUS_COLORS[application.status]}
                                    sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                                />
                            </Stack>
                            <Typography variant="h4" fontWeight={900} color="#002147">
                                {application.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Submitted on {new Date(application.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </Typography>
                        </Box>
                        {application.uniqueCode && (
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                                <Typography variant="caption" fontWeight={800} color="#1d4ed8" display="block">VERIFICATION CODE</Typography>
                                <Typography variant="h6" fontWeight={900} color="#1e40af" sx={{ letterSpacing: 2 }}>
                                    {application.uniqueCode}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Paper>

                {/* Progress Stepper */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Approval Progress
                    </Typography>
                    <Stepper activeStep={isRejected ? -1 : activeStep} alternativeLabel>
                        {steps.map((label, idx) => (
                            <Step key={label} completed={!isRejected && idx < activeStep}>
                                <StepLabel
                                    error={isRejected && idx === activeStep}
                                    StepIconProps={{
                                        sx: {
                                            '&.Mui-completed': { color: '#16a34a' },
                                            '&.Mui-active': { color: '#002147' },
                                        }
                                    }}
                                >
                                    <Typography variant="caption" fontWeight={700}>{label}</Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {isRejected && (
                        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: '#fef2f2', border: '1px solid #fecaca', textAlign: 'center' }}>
                            <Typography variant="body2" color="error" fontWeight={700}>
                                <LucideXCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                This application was rejected.
                                {application.feedback && ` Reason: ${application.feedback}`}
                            </Typography>
                        </Box>
                    )}
                </Paper>

                {/* Student Info */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Applicant Information
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={application.submittedBy?.profileImage} sx={{ width: 48, height: 48, bgcolor: '#002147' }}>
                            {application.submittedBy?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={700}>{application.submittedBy?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {application.submittedBy?.studentId} • {application.submittedBy?.email}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Application Content */}
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Application Content
                    </Typography>
                    <Typography variant="body1" sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8,
                        p: 3,
                        bgcolor: '#fefce8',
                        borderRadius: 2,
                        border: '1px solid #fef3c7',
                        fontFamily: 'serif',
                        fontSize: '1rem',
                    }}>
                        {application.textContent || application.description}
                    </Typography>

                    {/* Signed PDF with Inline Viewer */}
                    {application.signedPdfUrl && (
                        <Box sx={{ mt: 3, borderRadius: 3, bgcolor: '#f0f9ff', border: '1px solid #bae6fd', overflow: 'hidden' }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <LucideFileText size={24} color="#0369a1" />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={800} color="#0369a1">Official Signed Document</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {application.status === 'APPROVED' ? 'Finalized with all signatures' : 'Current version with available signatures'}
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
                                    href={application.signedPdfUrl}
                                    target="_blank"
                                    download
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    Download
                                </Button>
                            </Stack>

                            {showPdfViewer && (
                                <Box sx={{ borderTop: '1px solid #bae6fd', bgcolor: '#e2e8f0', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                                    {application.signedPdfUrl ? (
                                        <Box sx={{ flex: 1, position: 'relative', minHeight: 600 }}>
                                            <object
                                                data={application.signedPdfUrl}
                                                type="application/pdf"
                                                style={{ width: '100%', height: '600px', display: 'block' }}
                                            >
                                                <iframe
                                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(application.signedPdfUrl)}&embedded=true`}
                                                    style={{ width: '100%', height: '600px', border: 'none' }}
                                                    title="Application PDF Fallback"
                                                >
                                                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#fff' }}>
                                                        <Typography variant="body1" fontWeight={700} gutterBottom>
                                                            Unable to display PDF inline.
                                                        </Typography>
                                                        <Button
                                                            variant="contained"
                                                            href={application.signedPdfUrl}
                                                            target="_blank"
                                                            startIcon={<LucideDownload size={16} />}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Download PDF to View
                                                        </Button>
                                                    </Box>
                                                </iframe>
                                            </object>
                                        </Box>
                                    ) : (
                                        <Box sx={{ p: 4, textAlign: 'center' }}>
                                            <Typography color="error" gutterBottom>PDF URL is missing or invalid.</Typography>
                                            <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>Refresh Page</Button>
                                        </Box>
                                    )}
                                    <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Having trouble?{' '}
                                            <a href={application.signedPdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', fontWeight: 700, textDecoration: 'underline' }}>
                                                Open Direct Link
                                            </a>
                                            {' • '}
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                sx={{ cursor: 'pointer', color: '#0369a1', fontWeight: 700, textDecoration: 'underline' }}
                                                onClick={() => window.location.reload()}
                                            >
                                                Reload Page
                                            </Typography>
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Attachments */}
                    {application.attachments?.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Attached Documents
                            </Typography>
                            <Stack spacing={1}>
                                {application.attachments.map((url: string, i: number) => (
                                    <Box key={i} sx={{
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0'
                                    }}>
                                        <LucideFileText size={20} color="#475569" />
                                        <Typography variant="body2" sx={{ flex: 1, fontSize: '0.8rem' }}>Document {i + 1}</Typography>
                                        <Button size="small" variant="outlined" startIcon={<LucideEye size={14} />}
                                            onClick={() => window.open(url, '_blank')} sx={{ fontSize: '0.7rem' }}>
                                            View
                                        </Button>
                                        <Button size="small" variant="outlined" startIcon={<LucideDownload size={14} />}
                                            href={url} download target="_blank" sx={{ fontSize: '0.7rem' }}>
                                            Download
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Paper>

                {/* Approval & Signatures */}
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} color="#64748b" sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Approval & Digital Signatures
                    </Typography>

                    <Stack spacing={2}>
                        {/* L0 Trail */}
                        <Box sx={{
                            p: 2, borderRadius: 2, border: '1px solid #e2e8f0',
                            bgcolor: application.approvalTrail?.l0 ? '#f0fdf4' : '#f8fafc',
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="caption" fontWeight={800} color="#64748b">STAGE L0: INITIAL REVIEW</Typography>
                                    <Typography variant="body2">
                                        {application.approvalTrail?.l0
                                            ? `Reviewed by ${application.approvalTrail.l0.reviewer?.name || 'Authorized Reviewer'}`
                                            : 'Awaiting Review'}
                                    </Typography>
                                    {application.approvalTrail?.l0?.date && (
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(application.approvalTrail.l0.date).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Box>
                                {application.approvalTrail?.l0 && (
                                    <Chip icon={<LucideCheckCircle size={14} />} label="PASSED" size="small" color="success" sx={{ fontWeight: 700 }} />
                                )}
                            </Stack>
                        </Box>

                        {/* L1 Trail (only if medium exists) */}
                        {hasMedium && (
                            <Box sx={{
                                p: 2, borderRadius: 2, border: '1px solid #e2e8f0',
                                bgcolor: application.approvalTrail?.l1 ? '#f0fdf4' : '#f8fafc',
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="#64748b">
                                            STAGE L1: ENDORSED BY {application.medium?.name?.toUpperCase() || 'TEACHER'}
                                        </Typography>
                                        <Typography variant="body2">
                                            {application.approvalTrail?.l1
                                                ? `Signed by ${application.approvalTrail.l1.reviewer?.name || application.medium?.name}`
                                                : 'Awaiting Signature'}
                                        </Typography>
                                        {application.approvalTrail?.l1?.date && (
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(application.approvalTrail.l1.date).toLocaleDateString()}
                                            </Typography>
                                        )}
                                    </Box>
                                    {/* Digital Signature Display */}
                                    {application.approvalTrail?.l1?.signatureUrl && (
                                        <Box sx={{
                                            textAlign: 'center',
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            minWidth: 150,
                                        }}>
                                            <img
                                                src={application.approvalTrail.l1.signatureUrl}
                                                alt="L1 Digital Signature"
                                                style={{ height: 40, display: 'block', margin: '0 auto' }}
                                            />
                                            <Divider sx={{ my: 0.5 }} />
                                            <Typography variant="caption" fontWeight={700} display="block">
                                                {application.approvalTrail.l1.reviewer?.name || application.medium?.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                                <LucidePenTool size={10} style={{ marginRight: 2, verticalAlign: 'middle' }} />
                                                Digital Signature
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        )}

                        {/* L2 Trail */}
                        <Box sx={{
                            p: 2, borderRadius: 2, border: '1px solid #e2e8f0',
                            bgcolor: application.approvalTrail?.l2 ? '#f0fdf4' : '#f8fafc',
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="caption" fontWeight={800} color="#64748b">
                                        STAGE L2: APPROVED BY {application.to?.name?.toUpperCase() || 'TEACHER'}
                                    </Typography>
                                    <Typography variant="body2">
                                        {application.approvalTrail?.l2
                                            ? `Signed by ${application.approvalTrail.l2.reviewer?.name || application.to?.name}`
                                            : 'Awaiting Final Signature'}
                                    </Typography>
                                    {application.approvalTrail?.l2?.date && (
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(application.approvalTrail.l2.date).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Box>
                                {/* Digital Signature Display */}
                                {application.approvalTrail?.l2?.signatureUrl && (
                                    <Box sx={{
                                        textAlign: 'center',
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        minWidth: 150,
                                    }}>
                                        <img
                                            src={application.approvalTrail.l2.signatureUrl}
                                            alt="L2 Digital Signature"
                                            style={{ height: 40, display: 'block', margin: '0 auto' }}
                                        />
                                        <Divider sx={{ my: 0.5 }} />
                                        <Typography variant="caption" fontWeight={700} display="block">
                                            {application.approvalTrail.l2.reviewer?.name || application.to?.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                            <LucidePenTool size={10} style={{ marginRight: 2, verticalAlign: 'middle' }} />
                                            Digital Signature
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Final Signed Signatures Area (Bottom Right) */}
                    {(application.approvalTrail?.l1?.signatureUrl || application.approvalTrail?.l2?.signatureUrl) && (
                        <>
                            <Divider sx={{ my: 4 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Stack direction="row" spacing={4}>
                                    {application.approvalTrail?.l1?.signatureUrl && (
                                        <Box sx={{ textAlign: 'center', minWidth: 160 }}>
                                            <img
                                                src={application.approvalTrail.l1.signatureUrl}
                                                alt="L1 Signature"
                                                style={{ height: 50, display: 'block', margin: '0 auto 4px' }}
                                            />
                                            <Box sx={{ borderTop: '1.5px solid #002147', pt: 0.5, mt: 0.5 }}>
                                                <Typography variant="body2" fontWeight={800} color="#002147">
                                                    {application.approvalTrail.l1.reviewer?.name || application.medium?.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {application.medium?.designation || 'Faculty Member'}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                                    {new Date(application.approvalTrail.l1.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    {application.approvalTrail?.l2?.signatureUrl && (
                                        <Box sx={{ textAlign: 'center', minWidth: 160 }}>
                                            <img
                                                src={application.approvalTrail.l2.signatureUrl}
                                                alt="L2 Signature"
                                                style={{ height: 50, display: 'block', margin: '0 auto 4px' }}
                                            />
                                            <Box sx={{ borderTop: '1.5px solid #002147', pt: 0.5, mt: 0.5 }}>
                                                <Typography variant="body2" fontWeight={800} color="#002147">
                                                    {application.approvalTrail.l2.reviewer?.name || application.to?.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {application.to?.designation || 'Head of Department'}
                                                </Typography>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                                    {new Date(application.approvalTrail.l2.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </>
                    )}

                    {/* Verification Footer */}
                    {application.uniqueCode && (
                        <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #cbd5e1', textAlign: 'center' }}>
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                <LucideShieldCheck size={16} color="#16a34a" />
                                <Typography variant="caption" color="text.secondary">
                                    Digitally verified document • Code: <strong>{application.uniqueCode}</strong>
                                </Typography>
                            </Stack>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
