'use client';

import { useParams } from 'next/navigation';
import { useGetEventByIdQuery } from '@/features/event/eventApi';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Paper, 
  Button, 
  CircularProgress,
  Chip,
  Breadcrumbs,
  Grid
} from '@mui/material';
import { LucideCalendar, LucideArrowLeft, LucideMapPin, LucideBriefcase, LucideExternalLink, LucideFileText } from 'lucide-react';
import Link from 'next/link';
import { downloadFile } from '@/utils/download.util';

export default function EventDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetEventByIdQuery(id);
  const event = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 4 }}>Event Not Found</Typography>
        <Button 
          component={Link} 
          href="/events" 
          variant="contained" 
          startIcon={<LucideArrowLeft size={18} />}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link href="/events" style={{ textDecoration: 'none', color: 'inherit' }}>Events</Link>
          <Typography color="text.primary">Event Details</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Stack spacing={4}>
                <Box>
                  <Chip 
                    label={event.category} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 2, fontWeight: 700 }}
                  />
                  <Typography variant="h2" fontWeight={900} color="#0f172a" sx={{ mb: 3, lineHeight: 1.1 }}>
                    {event.title}
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} color="text.secondary">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LucideCalendar size={18} />
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(event.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LucideMapPin size={18} />
                      <Typography variant="body2" fontWeight={600}>
                        {event.location}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {event.images && event.images.length > 0 && (
                   <Box 
                    component="img" 
                    src={event.images[0]} 
                    alt={event.title}
                    sx={{ 
                      width: '100%', 
                      height: 400, 
                      objectFit: 'cover', 
                      borderRadius: 4,
                      boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)'
                    }}
                  />
                )}

                <Box sx={{ 
                  typography: 'body1', 
                  color: '#334155', 
                  lineHeight: 1.8,
                  '& p': { mb: 2 },
                  whiteSpace: 'pre-wrap'
                }}>
                  {event.description}
                </Box>

                <Box sx={{ pt: 4, borderTop: '1px solid #e2e8f0' }}>
                  <Button 
                    component={Link} 
                    href="/events" 
                    variant="text" 
                    color="inherit"
                    startIcon={<LucideArrowLeft size={18} />}
                    sx={{ fontWeight: 700 }}
                  >
                    Back to All Events
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
             <Stack spacing={4}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                   <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Event Info</Typography>
                   <Stack spacing={3}>
                      <Box>
                         <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Organizer</Typography>
                         <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                            <LucideBriefcase size={20} color="#2563eb" />
                            <Typography variant="body1" fontWeight={700}>{event.organizer}</Typography>
                         </Stack>
                      </Box>
                      <Box>
                         <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Date & Time</Typography>
                         <Typography variant="body1" fontWeight={700} sx={{ mt: 0.5 }}>
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                         </Typography>
                      </Box>
                      {event.registrationLink && (
                         <Button
                            component="a"
                            href={event.registrationLink}
                            target="_blank"
                            variant="contained"
                            fullWidth
                            size="large"
                            endIcon={<LucideExternalLink size={18} />}
                            sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
                         >
                            Register Now
                         </Button>
                      )}
                       
                       {event.attachments && event.attachments.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                             <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>Attachments</Typography>
                             <Stack spacing={1}>
                                {event.attachments.map((attachment: string, idx: number) => (
                                   <Button 
                                      key={idx}
                                      variant="outlined"
                                      size="small"
                                      startIcon={<LucideFileText size={16} />}
                                      onClick={() => downloadFile(attachment)}
                                      sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                                   >
                                      Download {event.attachments.length > 1 ? `File ${idx + 1}` : 'Attachment'}
                                   </Button>
                                ))}
                             </Stack>
                          </Box>
                       )}
                    </Stack>
                </Paper>

                {event.images && event.images.length > 1 && (
                   <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>Gallery</Typography>
                      <Grid container spacing={1}>
                         {event.images.slice(1).map((img: string, idx: number) => (
                            <Grid size={{ xs: 4 }} key={idx}>
                               <Box 
                                 component="img" 
                                 src={img} 
                                 sx={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 2 }} 
                               />
                            </Grid>
                         ))}
                      </Grid>
                   </Paper>
                )}
             </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
