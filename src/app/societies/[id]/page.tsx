'use client';

import { useParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Avatar, 
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { LucideGlobe, LucideLinkedin, LucideCalendar, LucideMapPin, LucideClock, LucideFacebook } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useGetSocietyByIdQuery, useGetSocietyMembersQuery, useGetFormerSocietyMembersQuery } from '@/features/society/societyApi';
import { useGetEventsQuery } from '@/features/event/eventApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`society-tabpanel-${index}`}
      aria-labelledby={`society-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 4, animation: 'fadeIn 0.5s ease' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DESIGNATION_ORDER: { [key: string]: number } = {
  'PRESIDENT': 1,
  'VICE_PRESIDENT': 2,
  'GENERAL_SECRETARY': 3,
  'ASSISTANT_GENERAL_SECRETARY': 4,
  'ORGANIZING_SECRETARY': 5,
  'SPORTS_SECRETARY': 6,
  'PUBLICATION_SECRETARY': 7,
  'EXECUTIVE_MEMBER': 8,
};

const sortMembers = (members: any[]) => {
  return [...members].sort((a, b) => {
    const rankA = DESIGNATION_ORDER[a.designation] || 99;
    const rankB = DESIGNATION_ORDER[b.designation] || 99;
    return rankA - rankB;
  });
};

export default function SocietyDetailsPage() {
  const { id } = useParams();
  const { data: societyData, isLoading: socLoading } = useGetSocietyByIdQuery(id, { skip: !id });
  const { data: currentMemberData, isLoading: curMemLoading } = useGetSocietyMembersQuery(id, { skip: !id });
  const { data: formerMemberData, isLoading: formerMemLoading } = useGetFormerSocietyMembersQuery(id, { skip: !id });
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({}); // Fetch all events, filter client-side
  
  const [tabFor, setTabFor] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const society = societyData?.data;
  const currentMembers = sortMembers(currentMemberData?.data || []);
  const formerMembers = sortMembers(formerMemberData?.data || []);
  const allEvents = eventsData?.data || [];

  // Filter events where committee/organizer matches society name roughly
  // Ideally backend should link Event -> Society ID. For now string match.
  const societyEvents = allEvents.filter((event: any) => 
    event.organizer?.toLowerCase().includes(society?.name?.toLowerCase()) || 
    event.organizer?.toLowerCase().includes('cse society') // Fallback common name
  );

  const upcomingEvents = societyEvents.filter((event: any) => new Date(event.startDate) > new Date());
  const pastEvents = societyEvents.filter((event: any) => new Date(event.startDate) <= new Date());

  useEffect(() => {
    if (!socLoading && society) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, [socLoading, society]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabFor(newValue);
  };

  if (socLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#16a34a' }} />
      </Box>
    );
  }

  if (!society) {
    return <Typography>Society not found</Typography>;
  }

  return (
    <Box sx={{ py: 6, bgcolor: '#ffffff', minHeight: '100vh' }} ref={contentRef}>
      <Container maxWidth="lg">
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink component={Link} href="/societies" underline="hover" color="inherit">Organizations</MuiLink>
          <Typography color="text.primary" fontWeight={700}>{society.name}</Typography>
        </Breadcrumbs>

        {/* Header Section */}
        <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
          <Box 
            sx={{ 
              width: 180, 
              height: 180, 
              borderRadius: 4, 
              bgcolor: '#f8fafc', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #e2e8f0',
              p: 2
            }}
          >
            {society.logo ? (
              <img src={society.logo} alt={society.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <LucideGlobe size={80} color="#cbd5e1" />
            )}
          </Box>
          <Box>
             <Typography variant="overline" sx={{ color: '#16a34a', fontWeight: 800, letterSpacing: 2, fontSize: '0.9rem' }}>
              {society.category}
            </Typography>
            <Typography variant="h2" fontWeight={900} color="#000000" sx={{ mb: 2, lineHeight: 1.1 }}>
              {society.name}
            </Typography>
             <Stack direction="row" spacing={1}>
                {society.socialLinks?.website && <IconButton href={society.socialLinks.website} target="_blank" sx={{ color: '#000000', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#16a34a', color: '#fff' } }}><LucideGlobe size={20} /></IconButton>}
                {society.socialLinks?.facebook && <IconButton href={society.socialLinks.facebook} target="_blank" sx={{ color: '#1877F2', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#16a34a', color: '#fff' } }}><LucideFacebook size={20} /></IconButton>} 
                {society.socialLinks?.linkedin && <IconButton href={society.socialLinks.linkedin} target="_blank" sx={{ color: '#0A66C2', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#16a34a', color: '#fff' } }}><LucideLinkedin size={20} /></IconButton>}
             </Stack>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabFor} 
            onChange={handleChange} 
            variant="scrollable"
            scrollButtons="auto"
            aria-label="society tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#64748b',
                mr: 4,
                '&.Mui-selected': { color: '#000000' }
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#16a34a',
                height: 3
              }
            }}
          >
            <Tab label="About" />
            <Tab label="Current Committee" />
            <Tab label="Former Members" />
            <Tab label="Activities" />
            <Tab label="Upcoming Events" />
          </Tabs>
        </Box>

        {/* About Tab */}
        <CustomTabPanel value={tabFor} index={0}>
          <Typography variant="h5" fontWeight={800} gutterBottom>Our Mission</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {society.description}
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
             <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 4 }}>
                   <Typography variant="h6" fontWeight={800} gutterBottom>Founded</Typography>
                   <Typography variant="h4" color="#16a34a" fontWeight={900}>{new Date(society.foundedDate).getFullYear()}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 4 }}>
                   <Typography variant="h6" fontWeight={800} gutterBottom>Total Members</Typography>
                   <Typography variant="h4" color="#000000" fontWeight={900}>{currentMembers.length + formerMembers.length}+</Typography>
                </Paper>
             </Grid>
          </Grid>
        </CustomTabPanel>

        {/* Current Members Tab */}
        <CustomTabPanel value={tabFor} index={1}>
           <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
              Current Executive Body
           </Typography>
           
           {curMemLoading ? <CircularProgress /> : (
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                 <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                       <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Photo</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Designation</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Session</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Tenure</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                       {currentMembers.length > 0 ? currentMembers.map((member: any) => (
                          <TableRow key={member._id} hover>
                             <TableCell>
                                <Avatar 
                                   src={member.image || member.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'Member')}&background=random`} 
                                   alt={member.user?.name}
                                   sx={{ width: 50, height: 50, border: '1px solid #e2e8f0', fontSize: '1.2rem' }}
                                >
                                   {member.user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                             </TableCell>
                             <TableCell sx={{ fontWeight: 700 }}>{member.user?.name}</TableCell>
                             <TableCell>
                                <Chip label={member.designation} size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '0.7rem' }} />
                             </TableCell>
                             <TableCell sx={{ fontWeight: 600 }}>{member.session}</TableCell>
                             <TableCell>{new Date(member.tenureStart).getFullYear()} - Present</TableCell>
                          </TableRow>
                       )) : (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No current members found.</TableCell></TableRow>
                       )}
                    </TableBody>
                 </Table>
              </TableContainer>
           )}
        </CustomTabPanel>

        {/* Former Members Tab */}
         <CustomTabPanel value={tabFor} index={2}>
            <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 3 }}>
               Former Executive Members
            </Typography>

            {formerMemLoading ? <CircularProgress /> : (
               <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                  <Table>
                     <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                           <TableCell sx={{ fontWeight: 800 }}>Photo</TableCell>
                           <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                           <TableCell sx={{ fontWeight: 800 }}>Designation</TableCell>
                           <TableCell sx={{ fontWeight: 800 }}>Session</TableCell>
                           <TableCell sx={{ fontWeight: 800 }}>Tenure</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {formerMembers.length > 0 ? formerMembers.map((member: any) => (
                           <TableRow key={member._id} hover>
                              <TableCell>
                                 <Avatar 
                                    src={member.image || member.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user?.name || 'Member')}&background=random`} 
                                    alt={member.user?.name}
                                    sx={{ width: 50, height: 50, border: '1px solid #e2e8f0', filter: 'grayscale(100%)', fontSize: '1.2rem' }}
                                 >
                                    {member.user?.name?.charAt(0).toUpperCase()}
                                 </Avatar>
                              </TableCell>
                              <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>{member.user?.name}</TableCell>
                              <TableCell>
                                 <Chip label={member.designation} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{member.session}</TableCell>
                              <TableCell>
                                 {new Date(member.tenureStart).getFullYear()} - {member.tenureEnd ? new Date(member.tenureEnd).getFullYear() : 'N/A'}
                              </TableCell>
                           </TableRow>
                        )) : (
                           <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No former members found.</TableCell></TableRow>
                        )}
                     </TableBody>
                  </Table>
               </TableContainer>
            )}
        </CustomTabPanel>

        {/* Activities Tab (Past Events) */}
        <CustomTabPanel value={tabFor} index={3}>
           <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 4 }}>
              Society Activities & Highlights
           </Typography>
           {pastEvents.length > 0 ? (
              <Grid container spacing={3}>
                 {pastEvents.map((event: any) => (
                    <Grid item xs={12} md={4} key={event._id}>
                       <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4, height: '100%' }}>
                          {event.image && (
                             <CardMedia component="img" height="180" image={event.image} alt={event.title} />
                          )}
                          <CardContent>
                             <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <LucideCalendar size={14} /> {new Date(event.startDate).toLocaleDateString()}
                             </Typography>
                             <Typography variant="h6" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2 }}>
                                {event.title}
                             </Typography>
                             <Typography variant="body2" color="text.secondary">
                                {event.description.substring(0, 100)}...
                             </Typography>
                          </CardContent>
                       </Card>
                    </Grid>
                 ))}
              </Grid>
           ) : (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                 <Typography color="text.secondary">No past activities found.</Typography>
              </Box>
           )}
        </CustomTabPanel>

        {/* Upcoming Events Tab */}
        <CustomTabPanel value={tabFor} index={4}>
           <Typography variant="h5" fontWeight={800} gutterBottom sx={{ mb: 4 }}>
              Upcoming Events
           </Typography>
           {upcomingEvents.length > 0 ? (
              <Grid container spacing={3}>
                 {upcomingEvents.map((event: any) => (
                    <Grid item xs={12} key={event._id}>
                       <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: { xs: '100%', md: 100 }, height: 100, bgcolor: '#e0f2fe', borderRadius: 3, color: '#0284c7' }}>
                             <Typography variant="h4" fontWeight={900}>{new Date(event.startDate).getDate()}</Typography>
                             <Typography variant="button" fontWeight={700}>{new Date(event.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</Typography>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                             <Typography variant="h5" fontWeight={800} gutterBottom>{event.title}</Typography>
                             <Stack direction="row" spacing={3} sx={{ mb: 2, color: 'text.secondary' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <LucideClock size={18} /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                   <LucideMapPin size={18} /> {event.location}
                                </Box>
                             </Stack>
                             <Typography color="text.secondary">{event.description}</Typography>
                             <Button variant="contained" sx={{ mt: 3, bgcolor: '#000000', fontWeight: 700 }} href={`/events/${event._id}`}>
                                View Details
                             </Button>
                          </Box>
                       </Paper>
                    </Grid>
                 ))}
              </Grid>
           ) : (
              <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                 <LucideCalendar size={48} color="#94a3b8" />
                 <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ mt: 2 }}>
                    No Upcoming Events
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                    Stay tuned for future announcements!
                 </Typography>
              </Box>
           )}
        </CustomTabPanel>

      </Container>
    </Box>
  );
}
