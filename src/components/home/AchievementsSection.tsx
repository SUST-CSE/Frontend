'use client';

import { useEffect, useMemo } from 'react';

import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Stack, 
  Avatar, 
  IconButton,
  Tooltip,
  Divider,
  Skeleton
} from '@mui/material';
import Link from 'next/link';
import { 
  LucideTrophy, 
  LucideUsers, 
  LucideExternalLink,
  LucideCalendar
} from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGetAchievementsQuery } from '@/features/content/contentApi';
interface IAchievement {
  _id: string;
  title: string;
  description: string;
  teamName?: string;
  competitionName: string;
  position: string;
  image: string;
  date: string;
  category: string;
}

// Assuming this is part of a functional component, let's wrap it.
// The original document was missing the component declaration.
export default function AchievementsSection() { // Added component declaration
  const { data, isLoading } = useGetAchievementsQuery({});
  const achievements: IAchievement[] = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (achievements.length === 0) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      '.achievement-card',
      { y: 60, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1, 
        stagger: 0.2, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.achievements-grid',
          start: 'top 80%',
        }
      }
    );
  }, [achievements]);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ p: 1, bgcolor: '#facc1520', borderRadius: 2, display: 'flex' }}>
            <LucideTrophy size={20} color="#eab308" />
          </Box>
          <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: '#eab308' }}>
            CELEBRATING EXCELLENCE
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a',  letterSpacing: '-0.02em' }}>
            Latest <span style={{ color: '#000' }}>Achievements</span>
          </Typography>
        </Box>

        <Grid container spacing={4} className="achievements-grid">
          {isLoading ? (
             Array.from(new Array(3)).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}> {/* Changed 'size' to 'xs', 'sm', 'md' for Grid item */}
                   <Paper elevation={0} sx={{ borderRadius: 5, overflow: 'hidden', border: '1px solid #e2e8f0', height: '100%' }}>
                      <Skeleton variant="rectangular" height={220} animation="wave" />
                      <Box sx={{ p: 3.5 }}>
                         <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <Skeleton variant="circular" width={32} height={32} />
                            <Skeleton variant="text" width="60%" />
                         </Stack>
                         <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
                         <Skeleton variant="text" width="80%" />
                         <Skeleton variant="text" width="90%" sx={{ mb: 3 }} />
                         <Divider sx={{ mb: 2 }} />
                         <Stack direction="row" justifyContent="space-between">
                            <Skeleton variant="text" width={80} />
                            <Skeleton variant="circular" width={24} height={24} />
                         </Stack>
                      </Box>
                   </Paper>
                </Grid>
             ))
          ) : (
             achievements.slice(0, 3).map((achievement: IAchievement) => (
               <Grid key={achievement._id.toString()} size={{ xs: 12, sm: 6, md: 4 }} className="achievement-card"> {/* Changed 'size' to 'xs', 'sm', 'md' and added className */}
                 <Paper
                   elevation={0}
                   sx={{
                     height: '100%',
                     borderRadius: 5,
                     overflow: 'hidden',
                     border: '1px solid #e2e8f0',
                     bgcolor: '#ffffff',
                     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                     cursor: 'pointer',
                     textDecoration: 'none',
                     display: 'block',
                     '&:hover': {
                       transform: 'translateY(-10px)',
                       boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.12)',
                       borderColor: '#facc15'
                     }
                   }}
                 >
                   {/* Photo Section */}
                   <Box sx={{ position: 'relative', height: 220, bgcolor: '#f1f5f9' }}>
                     <Image 
                       src={achievement.image || '/sust.png'} 
                       alt={achievement.title} 
                       fill 
                       style={{ objectFit: 'cover' }}
                       unoptimized
                     />
                     <Box 
                       sx={{ 
                         position: 'absolute', 
                         top: 16, 
                         left: 16, 
                         zIndex: 1 
                       }}
                     >
                       <Chip 
                         label={achievement.category} 
                         size="small"
                         sx={{ 
                           bgcolor: 'rgba(255, 255, 255, 0.95)', 
                           backdropFilter: 'blur(4px)',
                           color: '#0f172a',
                           fontWeight: 800,
                           fontSize: '0.65rem'
                         }} 
                       />
                     </Box>
                     <Box 
                       sx={{ 
                         position: 'absolute', 
                         bottom: 0, 
                         left: 0, 
                         right: 0, 
                         p: 3, 
                         background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                         color: '#ffffff'
                       }}
                     >
                       <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                         {achievement.position}
                       </Typography>
                       <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>
                         {achievement.competitionName}
                       </Typography>
                     </Box>
                   </Box>
   
                   {/* Content Section */}
                   <Box sx={{ p: 3.5 }}>
                     <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                       <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                         <LucideUsers size={16} />
                       </Avatar>
                       <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
                         {achievement.teamName || 'Team SUST'}
                       </Typography>
                     </Stack>
   
                     <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, color: '#0f172a', lineHeight: 1.3 }}>
                       {achievement.title}
                     </Typography>
   
                     <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                       {achievement.description}
                     </Typography>
   
                     <Divider sx={{ mb: 2.5, borderStyle: 'dashed' }} />
   
                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                       <Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#94a3b8' }}>
                         <LucideCalendar size={14} />
                         <Typography variant="caption" sx={{ fontWeight: 600 }}>
                           {new Date(achievement.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                         </Typography>
                       </Stack>
                       <Tooltip title="View Details">
                         <IconButton 
                           size="small" 
                           component={Link}
                           href={`/achievements/${achievement._id}`}
                           sx={{ color: '#0f172a', '&:hover': { bgcolor: '#f8fafc' } }}
                         >
                           <LucideExternalLink size={18} />
                         </IconButton>
                       </Tooltip>
                     </Stack>
                   </Box>
                 </Paper>
               </Grid>
             ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

