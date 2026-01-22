'use client';

import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar,
  Stack
} from '@mui/material';
import { 
  LucideLayoutDashboard, 
  LucideFileText, 
  LucideUsers, 
  LucideCalendar, 
  LucideLogOut, 
  LucideGlobe,
  LucideGraduationCap
} from 'lucide-react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { logout } from '@/features/auth/authSlice';
import { useLogoutUserMutation } from '@/features/auth/authApi';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { label: 'Overview', icon: <LucideLayoutDashboard size={20} />, href: '/admin/dashboard' },
  { label: 'Blog Moderation', icon: <LucideFileText size={20} />, href: '/admin/dashboard/blogs' },
  { label: 'Societies', icon: <LucideGlobe size={20} />, href: '/admin/dashboard/societies' },
  { label: 'Home & Content', icon: <LucideCalendar size={20} />, href: '/admin/dashboard/content' },
  { label: 'User Management', icon: <LucideUsers size={20} />, href: '/admin/dashboard/users' },
  { label: 'Alumni Management', icon: <LucideGraduationCap size={20} />, href: '/admin/dashboard/alumni' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
    } catch (error) {
       console.error("Logout failed on server", error);
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#000000',
            color: '#ffffff',
            borderRight: '1px solid #333'
          },
        }}
      >
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <NextImage src="/sust.png" alt="SUST Logo" width={40} height={40} />
          <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
            SUST <span style={{ color: '#16a34a' }}>Admin</span>
          </Typography>
        </Box>

        <Box sx={{ px: 2, mb: 4 }}>
           <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, bgcolor: '#111', borderRadius: 2 }}>
              <Avatar src={user?.profileImage} sx={{ width: 40, height: 40, bgcolor: '#16a34a' }}>A</Avatar>
              <Box>
                 <Typography variant="subtitle2" fontWeight={700}>Admin Panel</Typography>
                 <Typography variant="caption" sx={{ color: '#64748b' }}>{user?.email}</Typography>
              </Box>
           </Stack>
        </Box>

        <List sx={{ px: 2 }}>
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => router.push(item.href)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? '#16a34a' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    '&:hover': {
                      bgcolor: isActive ? '#15803d' : 'rgba(255,255,255,0.05)',
                      color: '#ffffff'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: '#ef4444',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' }
            }}
          >
             <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LucideLogOut size={20} />
             </ListItemIcon>
             <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        {children}
      </Box>
    </Box>
  );
}
