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
  Select,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  LinearProgress,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  LucideSend,
  LucideArrowLeft,
  LucideFileUp,
  LucideInfo,
  LucideFileText,
  LucideType,
  LucideX,
} from 'lucide-react';
import { useSubmitApplicationMutation } from '@/features/application/applicationApi';
import { APPLICATION_TYPE, APP_TYPE_LABELS } from '@/features/application/applicationConstants';
import { useGetFacultyQuery } from '@/features/user/userApi';
import toast from 'react-hot-toast';

export default function SubmitApplicationPage() {
  const router = useRouter();
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const { data: facultyData, isLoading: loadingFaculty } = useGetFacultyQuery({});
  const faculty = facultyData?.data?.users || facultyData?.data || [];

  const [submissionMode, setSubmissionMode] = useState<'TEXT' | 'PDF'>('TEXT');
  const [title, setTitle] = useState('');
  const [type, setType] = useState(APPLICATION_TYPE.GENERAL);
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [to, setTo] = useState<any>(null); // L2 teacher (required)
  const [medium, setMedium] = useState<any>(null); // L1 teacher (optional)
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setFile(selected);
    }
  };

  const removeFile = () => setFile(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    console.log('🚀 Submitting Application:', { title, toId: to?._id, mode: submissionMode });

    if (!to?._id) {
      toast.error('Recipient teacher selection is invalid. Please try selecting again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', type);
      formData.append('to', to._id);
      formData.append('submissionMode', submissionMode);

      if (medium?._id) {
        formData.append('medium', medium._id);
      }

      if (submissionMode === 'TEXT') {
        formData.append('textContent', textContent || description);
      }

      if (file) {
        formData.append('file', file);
      }

      console.log('📦 FormData keys being sent:', Array.from((formData as any).keys()));

      await submitApplication(formData).unwrap();
      toast.success('Application submitted successfully!');
      router.push('/applications');
    } catch (err: any) {
      console.error('❌ Submission Error:', err);
      toast.error(err?.data?.message || 'Failed to submit application');
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
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight={900} color="#002147" gutterBottom>
              Submit Application
            </Typography>
            <Typography color="text.secondary">
              Fill out the form below to submit a formal request to the department.
            </Typography>
          </Box>

          {isLoading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>

              {/* Submission Mode Toggle */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#334155' }}>
                  Submission Mode
                </Typography>
                <ToggleButtonGroup
                  value={submissionMode}
                  exclusive
                  onChange={(_, val) => val && setSubmissionMode(val)}
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 3, py: 1.2, fontWeight: 700, textTransform: 'none',
                      '&.Mui-selected': { bgcolor: '#002147', color: '#fff', '&:hover': { bgcolor: '#003366' } }
                    }
                  }}
                >
                  <ToggleButton value="TEXT">
                    <LucideType size={18} style={{ marginRight: 8 }} /> Write Text
                  </ToggleButton>
                  <ToggleButton value="PDF">
                    <LucideFileUp size={18} style={{ marginRight: 8 }} /> Upload Document
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Application Type */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  Application Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    {Object.values(APPLICATION_TYPE).map((t) => (
                      <MenuItem key={t} value={t}>
                        {APP_TYPE_LABELS[t]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Subject / Title */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  Subject / Title *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Request for leave (2 days), Equipment booking for project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Box>

              {/* Detailed Description */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                    Detailed Description *
                  </Typography>
                  <Tooltip title="Provide all necessary details, dates, and reasons.">
                    <LucideInfo size={14} color="#94a3b8" />
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Brief summary of your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Box>

              {/* Text Content (only in TEXT mode) */}
              {submissionMode === 'TEXT' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                      Application Body (Full Text)
                    </Typography>
                    <Tooltip title="This text will be converted into an official PDF document with department letterhead.">
                      <LucideInfo size={14} color="#94a3b8" />
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    placeholder={`To,\nThe Head of the Department\nDept. of Computer Science and Engineering\nSUST, Sylhet\n\nSubject: ...\n\nDear Sir/Madam,\n\nI am writing to request...\n\nYours faithfully,\n[Your Name]`}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'serif',
                        fontSize: '0.95rem',
                        lineHeight: 1.8,
                        bgcolor: '#fefce8',
                        border: '1px solid #fef3c7',
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    This text will be automatically formatted into an official PDF document.
                  </Typography>
                </Box>
              )}

              {/* File Upload (visible in both modes, but primary in PDF mode) */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                  {submissionMode === 'PDF' ? 'Upload Document *' : 'Attachments (Optional)'}
                </Typography>
                {!file ? (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<LucideFileUp size={18} />}
                    sx={{
                      textTransform: 'none',
                      borderStyle: 'dashed',
                      py: 3,
                      bgcolor: '#f1f5f9',
                      color: '#475569',
                      borderColor: '#cbd5e1',
                      '&:hover': { bgcolor: '#e2e8f0', borderColor: '#94a3b8' }
                    }}
                    fullWidth
                  >
                    Click to upload PDF, JPG, or PNG (Max 5MB)
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </Button>
                ) : (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: '#f0fdf4',
                    borderRadius: 2,
                    border: '1px solid #bbf7d0'
                  }}>
                    <LucideFileText size={24} color="#16a34a" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700}>{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={removeFile}
                      startIcon={<LucideX size={14} />}
                      sx={{ textTransform: 'none' }}
                    >
                      Remove
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Recipient Teachers */}
              <Box sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#eff6ff',
                border: '1px solid #bfdbfe'
              }}>
                <Typography variant="subtitle2" fontWeight={800} color="#1d4ed8" sx={{ mb: 2 }}>
                  Approval Chain
                </Typography>
                <Stack spacing={3}>
                  {/* To (L2 - Final Approver) - Required */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#334155' }}>
                      To (Final Approver) *
                    </Typography>
                    <Autocomplete
                      options={faculty}
                      getOptionLabel={(opt: any) => `${opt.name}${opt.designation ? ' — ' + opt.designation : ''}`}
                      value={to}
                      onChange={(_, val) => setTo(val)}
                      loading={loadingFaculty}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select the final approving teacher (L2)"
                          required
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingFaculty ? <CircularProgress size={18} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      isOptionEqualToValue={(opt: any, val: any) => opt._id === val._id}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Usually the Head of Department or course supervisor.
                    </Typography>
                  </Box>

                  {/* Medium (L1 - Intermediate) - Optional */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#334155' }}>
                        Through / Medium (Optional)
                      </Typography>
                      <Chip label="Optional" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                    </Box>
                    <Autocomplete
                      options={faculty}
                      getOptionLabel={(opt: any) => `${opt.name}${opt.designation ? ' — ' + opt.designation : ''}`}
                      value={medium}
                      onChange={(_, val) => setMedium(val)}
                      loading={loadingFaculty}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select an intermediate teacher (L1) — leave empty to skip"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingFaculty ? <CircularProgress size={18} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      isOptionEqualToValue={(opt: any, val: any) => opt._id === val._id}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      If left empty, the application goes directly from L0 review to the final approver (L2).
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Flow Info */}
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" gutterBottom>
                  APPROVAL FLOW
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip label="L0: Initial Review" size="small" color="warning" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                  <Typography variant="caption" color="text.secondary">→</Typography>
                  {medium ? (
                    <>
                      <Chip label={`L1: ${medium.name}`} size="small" color="info" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                      <Typography variant="caption" color="text.secondary">→</Typography>
                    </>
                  ) : null}
                  <Chip
                    label={to ? `L2: ${to.name}` : 'L2: Final Approver'}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                  {!medium && (
                    <Chip label="Direct (No L1)" size="small" variant="outlined" color="secondary" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                  )}
                </Stack>
              </Box>

              {/* Submit */}
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
