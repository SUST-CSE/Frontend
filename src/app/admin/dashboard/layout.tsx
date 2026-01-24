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
  LucideGraduationCap,
  LucideSend,
  LucideMenu,
  LucideX
} from 'lucide-react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { logout } from '@/features/auth/authSlice';
import { useLogoutUserMutation } from '@/features/auth/authApi';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';

const DRAWER_WIDTH = 280;

const MENU_ITEMS = [
  { label: 'Overview', icon: <LucideLayoutDashboard size={20} />, href: '/admin/dashboard' },
  { label: 'Messenger', icon: <LucideSend size={20} />, href: '/admin/dashboard/messenger' },
  { label: 'Blog Moderation', icon: <LucideFileText size={20} />, href: '/admin/dashboard/blogs' },
  { label: 'Organizations', icon: <LucideGlobe size={20} />, href: '/admin/dashboard/societies' },
  { label: 'Home & Content', icon: <LucideCalendar size={20} />, href: '/admin/dashboard/content' },
  { label: 'User Management', icon: <LucideUsers size={20} />, href: '/admin/dashboard/users' },
  { label: 'Alumni Management', icon: <LucideGraduationCap size={20} />, href: '/admin/dashboard/alumni' },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <NextImage src="/sust.png" alt="SUST Logo" width={32} height={32} />
          <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: -0.5 }}>
            SUST <span style={{ color: '#16a34a' }}>Admin</span>
          </Typography>
        </Stack>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <LucideX size={20} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
         <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, bgcolor: '#111', borderRadius: 2 }}>
            <Avatar src={user?.profileImage} sx={{ width: 40, height: 40, bgcolor: '#16a34a' }}>
               {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
               <Typography variant="subtitle2" fontWeight={700} noWrap>Admin Panel</Typography>
               <Typography variant="caption" sx={{ color: '#64748b' }} noWrap>{user?.email}</Typography>
            </Box>
         </Stack>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.href);
                  if (isMobile) setMobileOpen(false);
                }}
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

      <Box sx={{ p: 2, borderTop: '1px solid #333' }}>
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Drawer for Desktop */}
      {!isMobile && (
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
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer for Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              bgcolor: '#000000',
              color: '#ffffff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#ffffff', 
            borderBottom: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1100
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <NextImage src="/sust.png" alt="SUST Logo" width={32} height={32} />
              <Typography variant="h6" fontWeight={900} color="#0f172a">Admin</Typography>
            </Stack>
            <IconButton onClick={handleDrawerToggle}>
              <LucideMenu size={24} />
            </IconButton>
          </Box>
        )}

        <Box component="main" sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          flexGrow: 1,
          width: '100%',
          overflowX: 'hidden'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
