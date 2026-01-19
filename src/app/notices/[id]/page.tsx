'use client';

import { useParams } from 'next/navigation';
import { useGetNoticeByIdQuery } from '@/features/content/contentApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Paper, 
  Button, 
  CircularProgress,
  Chip,
  Breadcrumbs
} from '@mui/material';
import { LucideCalendar, LucideArrowLeft, LucideUser, LucideFileText } from 'lucide-react';
import Link from 'next/link';
import { downloadFile } from '@/utils/download.util';

export default function NoticeDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetNoticeByIdQuery(id);
  const notice = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!notice) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Notice Not Found</Typography>
        <Button 
          component={Link} 
          href="/notices" 
          variant="contained" 
          color="success"
          startIcon={<LucideArrowLeft size={18} />}
        >
          Back to Notices
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link href="/notices" style={{ textDecoration: 'none', color: 'inherit' }}>Notices</Link>
          <Typography color="text.primary">Notice Details</Typography>
        </Breadcrumbs>

        <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Stack spacing={4}>
            <Box>
              <Chip 
                icon={<LucideFileText size={14} />} 
                label={notice.category || 'Announcement'} 
                color="success" 
                variant="outlined"
                sx={{ mb: 2, fontWeight: 700 }}
              />
              <Typography variant="h2" fontWeight={900} color="#0f172a" sx={{ mb: 3, lineHeight: 1.1 }}>
                {notice.title}
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} color="text.secondary">
                <Stack direction="row" spacing={1} alignItems="center">
                  <LucideCalendar size={18} />
                  <Typography variant="body2" fontWeight={600}>
                    {new Date(notice.publishDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LucideUser size={18} />
                  <Typography variant="body2" fontWeight={600}>
                    Posted by {notice.createdBy?.name || 'Academic Admin'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ 
              typography: 'body1', 
              color: '#334155', 
              lineHeight: 1.8,
              '& p': { mb: 2 },
              whiteSpace: 'pre-wrap'
            }}>
              {notice.description}
            </Box>

            {notice.attachments && notice.attachments.length > 0 && (
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Attachments</Typography>
                <Stack spacing={2}>
                  {notice.attachments.map((attachment: string, index: number) => (
                    <Button
                      key={index}
                      onClick={() => downloadFile(attachment)}
                      variant="outlined"
                      color="success"
                      startIcon={<LucideFileText size={18} />}
                      sx={{ justifyContent: 'flex-start', py: 1.5, px: 3, borderRadius: 3 }}
                    >
                      Download Attachment {notice.attachments.length > 1 ? index + 1 : ''}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ pt: 4, borderTop: '1px solid #e2e8f0' }}>
              <Button 
                component={Link} 
                href="/notices" 
                variant="text" 
                color="inherit"
                startIcon={<LucideArrowLeft size={18} />}
                sx={{ fontWeight: 700 }}
              >
                Back to All Notices
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
