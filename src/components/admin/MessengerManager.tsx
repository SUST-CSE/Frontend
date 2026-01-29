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
import { LucideSend, LucideMail, LucideBell, LucideTarget } from 'lucide-react';
import { useState } from 'react';
import { useSendMessageMutation } from '@/features/content/contentApi';
import toast from 'react-hot-toast';

export default function MessengerManager() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target: 'BOTH',
    methods: ['EMAIL', 'NOTICE']
  });
  const [sendMessage, { isLoading, isSuccess }] = useSendMessageMutation();
  const [resultData, setResultData] = useState<{ email?: { success: number }; notice?: boolean } | null>(null);

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
      toast.success("Broadcast sent successfully!");
      setFormData({ title: '', content: '', target: 'BOTH', methods: ['EMAIL', 'NOTICE'] });
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send broadcast");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={900} color="#002147" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LucideMail size={32} />
          Admin Messenger
        </Typography>
        <Typography color="text.secondary">
          Send mass communications to department members via Email or Portal Notices
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
                  />
                </Box>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LucideTarget size={18} color="#002147" /> Target Audience
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      >
                        <MenuItem value="BOTH">All Members</MenuItem>
                        <MenuItem value="STUDENT">Students Only</MenuItem>
                        <MenuItem value="TEACHER">Teachers Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LucideBell size={18} color="#002147" /> Delivery Methods
                    </Typography>
                    <FormGroup row>
                      <FormControlLabel
                        control={<Checkbox checked={formData.methods.includes('EMAIL')} onChange={() => handleMethodChange('EMAIL')} color="primary" />}
                        label={<Typography variant="body2" fontWeight={600}>Email</Typography>}
                      />
                      <FormControlLabel
                        control={<Checkbox checked={formData.methods.includes('NOTICE')} onChange={() => handleMethodChange('NOTICE')} color="primary" />}
                        label={<Typography variant="body2" fontWeight={600}>Notice</Typography>}
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
                    sx={{ py: 1.8, bgcolor: '#002147', fontWeight: 800 }}
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
              <Alert severity="success" sx={{ borderRadius: 4 }} onClose={() => setResultData(null)}>
                <Typography variant="subtitle2" fontWeight={800}>Broadcast Successful!</Typography>
                <Box sx={{ mt: 1, fontSize: '0.85rem' }}>
                  {resultData.email && <Typography variant="inherit">• Emails Sent: {resultData.email.success}</Typography>}
                  {resultData.notice && <Typography variant="inherit">• Portal Notice Published</Typography>}
                </Box>
              </Alert>
            )}

            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                 Guidelines
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">Use the audience selector to narrow down recipients.</Typography>
                <Typography variant="body2" color="text.secondary">Portal notices will stay pinned for better visibility.</Typography>
                <Typography variant="body2" color="text.secondary">Email broadcasts reach all targeted members directly.</Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
