'use client';

import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { LucideSend, LucideMail, LucideBell, LucideTarget, LucideHistory } from 'lucide-react';
import { useState } from 'react';
import { useSendMessageMutation } from '@/features/content/contentApi';

export default function MessengerPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'BOTH',
    methods: ['EMAIL', 'NOTICE']
  });
  const [sendMessage, { isLoading, isSuccess, isError, error }] = useSendMessageMutation();
  const [resultData, setResultData] = useState<any>(null);

  const handleMethodChange = (method: string) => {
    const newMethods = formData.methods.includes(method)
      ? formData.methods.filter(m => m !== method)
      : [...formData.methods, method];
    setFormData({ ...formData, methods: newMethods });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || formData.methods.length === 0) return;

    try {
      const result = await sendMessage(formData).unwrap();
      setResultData(result.data);
      setFormData({ title: '', content: '', target: 'BOTH', methods: ['EMAIL', 'NOTICE'] });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} color="#0f172a" sx={{ letterSpacing: -1, mb: 1 }}>
          Admin <span style={{ color: '#16a34a' }}>Messenger</span>
        </Typography>
        <Typography color="text.secondary" fontWeight={500}>
          Send mass communications to department members via Email or Portal Notices.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: '#0f172a' }}>Message Title</Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g. Important Announcement regarding Final Exams"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, color: '#0f172a' }}>Message Content</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="Type your message here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LucideTarget size={18} color="#16a34a" /> Target Audience
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        sx={{ borderRadius: 2.5 }}
                      >
                        <MenuItem value="BOTH">All Members</MenuItem>
                        <MenuItem value="STUDENT">Students Only</MenuItem>
                        <MenuItem value="TEACHER">Teachers Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LucideBell size={18} color="#16a34a" /> Delivery Methods
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel
                        control={<Checkbox checked={formData.methods.includes('EMAIL')} onChange={() => handleMethodChange('EMAIL')} color="secondary" />}
                        label={<Typography variant="body2" fontWeight={600}>Direct Email</Typography>}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formData.methods.includes('NOTICE')} onChange={() => handleMethodChange('NOTICE')} color="secondary" />}
                        label={<Typography variant="body2" fontWeight={600}>Portal Notice</Typography>}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading || !formData.title || !formData.content || formData.methods.length === 0}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LucideSend size={20} />}
                    sx={{ 
                      py: 1.8, 
                      borderRadius: 3.5, 
                      bgcolor: '#000', 
                      fontWeight: 800, 
                      fontSize: '1rem',
                      '&:hover': { bgcolor: '#16a34a' }
                    }}
                  >
                    {isLoading ? 'Sending Broadcast...' : 'Initiate Broadcast'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            {isSuccess && resultData && (
              <Alert 
                severity="success" 
                sx={{ borderRadius: 4, bgcolor: '#f0fdf4', border: '1px solid #bcf0da', color: '#15803d' }}
                onClose={() => setResultData(null)}
              >
                <Typography variant="subtitle2" fontWeight={800}>Broadcast Successful!</Typography>
                <Box sx={{ mt: 1, fontSize: '0.85rem' }}>
                  {resultData.email && (
                    <Typography variant="inherit">
                      • <b>Emails:</b> Successfully delivered to {resultData.email.success} of {resultData.email.total} users.
                    </Typography>
                  )}
                  {resultData.notice && (
                    <Typography variant="inherit">
                      • <b>Portal:</b> Notice record created and pinned globally.
                    </Typography>
                  )}
                </Box>
              </Alert>
            )}

            {isError && (
              <Alert severity="error" sx={{ borderRadius: 4 }}>
                <Typography variant="subtitle2" fontWeight={800}>Error sending message</Typography>
                <Typography variant="caption">{(error as any)?.data?.message || 'Connection lost'}</Typography>
              </Alert>
            )}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LucideHistory size={22} color="#64748b" /> Guidelines
              </Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>Selective Targeting</Typography>
                  <Typography variant="body2" color="text.secondary">Use the audience selector to narrow down recipients. Messaging "All Members" will reach everyone in the database.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>Portal Notices</Typography>
                  <Typography variant="body2" color="text.secondary">Messages sent as portal notices will appear in the public noticeboard and stay pinned for better visibility.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>Email Delivery</Typography>
                  <Typography variant="body2" color="text.secondary">Direct emails use the department SMTP server. Avoid sending large attachments to ensure high deliverability.</Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
               <LucideMail size={32} color="#16a34a" style={{ marginBottom: 12 }} />
               <Typography variant="subtitle2" fontWeight={800}>Need help?</Typography>
               <Typography variant="caption" color="text.secondary">Contact the technical team for SMTP configuration or database scaling.</Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
