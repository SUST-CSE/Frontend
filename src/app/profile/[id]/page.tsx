'use client';

import { useParams } from 'next/navigation';
import { Box, Container, Typography, Grid, Avatar, Stack, Chip, Button, Divider, Paper, CircularProgress, Link as MuiLink } from '@mui/material';
import { useGetUserByIdQuery } from '@/features/user/userApi';
import { LucideMail, LucideLinkedin, LucideGithub, LucideGlobe, LucideMapPin, LucideBriefcase, LucideGraduationCap, LucideCode, LucideBookOpen, LucideFacebook, LucideInstagram } from 'lucide-react';
import Link from 'next/link';

export default function ProfileDetailsPage() {
  const { id } = useParams();
  const { data: response, isLoading, error } = useGetUserByIdQuery(id);
  const user = response?.data;

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error || !user) return (
    <Box sx={{ textAlign: 'center', py: 20 }}>
      <Typography variant="h5" color="error">User not found or profile is private.</Typography>
      <Button component={Link} href="/" sx={{ mt: 2 }}>Go Home</Button>
    </Box>
  );

  const isTeacher = user.role === 'TEACHER';

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
      {/* Header / Cover Area */}
      <Box sx={{ height: 200, bgcolor: '#002147', position: 'relative' }}>
        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
           {/* You could add a cover image here if supported */}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -10 }}>
        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Avatar 
                src={user.profileImage} 
                sx={{ 
                  width: 160, 
                  height: 160, 
                  mx: 'auto', 
                  border: '6px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  mb: 2,
                  fontSize: '3rem'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" fontWeight={800} gutterBottom>{user.name}</Typography>
              
              {isTeacher ? (
                <Typography variant="subtitle1" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                  {user.designation}
                </Typography>
              ) : (
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                  <Chip label={`Batch: ${user.batch}`} size="small" color="primary" variant="outlined" />
                  <Chip label={`ID: ${user.studentId}`} size="small" variant="outlined" />
                </Stack>
              )}

              {user.experiences?.[0]?.company && (
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                   {user.experiences[0].title} at {user.experiences[0].company}
                 </Typography>
              )}

              <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                {user.email && (
                  <IconButtonLink href={`mailto:${user.email}`} icon={<LucideMail size={20} />} />
                )}
                {user.socialLinks?.linkedin && (
                  <IconButtonLink href={user.socialLinks.linkedin} icon={<LucideLinkedin size={20} />} />
                )}
                {user.socialLinks?.github && (
                  <IconButtonLink href={user.socialLinks.github} icon={<LucideGithub size={20} />} />
                )}
                {user.socialLinks?.website && (
                  <IconButtonLink href={user.socialLinks.website} icon={<LucideGlobe size={20} />} />
                )}
                 {user.socialLinks?.facebook && (
                  <IconButtonLink href={user.socialLinks.facebook} icon={<LucideFacebook size={20} />} />
                )}
              </Stack>
            </Paper>

            {/* Contact / Info Block */}
            <Paper elevation={0} sx={{ p: 4, mt: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>Contact Info</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LucideMail size={20} color="#64748b" />
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{user.email}</Typography>
                </Box>
                {user.phone && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LucideMapPin size={20} color="#64748b" /> {/* Placeholder icon for phone logic if needed */}
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            
            {/* About / Research Interests */}
            {isTeacher && user.researchInterests?.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LucideBookOpen size={24} color="#002147" />
                  Research Interests
                </Typography>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {user.researchInterests.map((int: string, i: number) => (
                      <Chip key={i} label={int} sx={{ fontWeight: 500, fontSize: '0.9rem' }} />
                    ))}
                  </Stack>
                </Paper>
              </Box>
            )}

            {/* Experience */}
            {user.experiences?.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LucideBriefcase size={24} color="#002147" />
                  Experience
                </Typography>
                <Stack spacing={2}>
                  {user.experiences.map((exp: any, i: number) => (
                    <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                      <Typography variant="h6" fontWeight={700}>{exp.title}</Typography>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>{exp.company} • {exp.location}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                        {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`}
                      </Typography>
                      <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>{exp.description}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Research / Publications */}
            {user.researches?.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LucideGraduationCap size={24} color="#002147" />
                  Publications
                </Typography>
                <Stack spacing={2}>
                  {user.researches.map((res: any, i: number) => (
                    <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.4 }}>
                        {res.publicationLink ? (
                          <MuiLink href={res.publicationLink} target="_blank" underline="hover" color="inherit">
                            {res.title}
                          </MuiLink>
                        ) : res.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {res.journal} • {new Date(res.publicationDate).toLocaleDateString(undefined, { year: 'numeric' })}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{res.description}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Projects (Students) */}
            {!isTeacher && user.projects?.length > 0 && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LucideCode size={24} color="#002147" />
                  Projects
                </Typography>
                <Grid container spacing={3}>
                  {user.projects.map((proj: any, i: number) => (
                    <Grid size={{ xs: 12 }} key={i}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Typography variant="h6" fontWeight={700}>{proj.title}</Typography>
                          <Stack direction="row" spacing={1}>
                            {proj.githubLink && (
                              <MuiLink href={proj.githubLink} target="_blank" color="text.secondary">
                                <LucideGithub size={20} />
                              </MuiLink>
                            )}
                            {proj.liveLink && (
                              <MuiLink href={proj.liveLink} target="_blank" color="text.secondary">
                                <LucideGlobe size={20} />
                              </MuiLink>
                            )}
                          </Stack>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ my: 1.5 }}>
                          {proj.technologies?.map((tech: string, t: number) => (
                            <Chip key={t} label={tech} size="small" sx={{ fontSize: '0.75rem', height: 24 }} />
                          ))}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">{proj.description}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function IconButtonLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Button 
      component={Link} 
      href={href} 
      target="_blank" 
      sx={{ 
        minWidth: 'auto', 
        p: 1, 
        bgcolor: '#f1f5f9', 
        color: '#334155', 
        borderRadius: 2,
        '&:hover': { bgcolor: '#e2e8f0', color: '#002147' } 
      }}
    >
      {icon}
    </Button>
  );
}
