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
  LucideX,
  LucideBriefcase,
  LucideMailCheck,
  LucideWallet,
  LucideClipboardList
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
  { label: 'Blog Moderation', icon: <LucideFileText size={20} />, href: '/admin/dashboard/blogs', permission: 'MANAGE_BLOGS' },
  { label: 'Organizations', icon: <LucideGlobe size={20} />, href: '/admin/dashboard/societies', permission: 'MANAGE_SOCIETIES' },
  { label: 'Home & Content', icon: <LucideCalendar size={20} />, href: '/admin/dashboard/content', permission: 'MANAGE_CONTENT' },
  { label: 'Important Data', icon: <LucideClipboardList size={20} />, href: '/admin/dashboard/important-data', permission: 'MANAGE_CONTENT' },
  { label: 'User Management', icon: <LucideUsers size={20} />, href: '/admin/dashboard/users', permission: 'MANAGE_USERS' },
  { label: 'Work Assignments', icon: <LucideBriefcase size={20} />, href: '/admin/dashboard/work-assignments', permission: 'MANAGE_WORK' },
  { label: 'Applications', icon: <LucideClipboardList size={20} />, href: '/admin/dashboard/applications', permission: 'MANAGE_APPLICATIONS' },
  { label: 'Department Finance', icon: <LucideWallet size={20} />, href: '/admin/dashboard/finance', permission: 'MANAGE_ACCOUNTS' },
  { label: 'Email Logs', icon: <LucideMailCheck size={20} />, href: '/admin/dashboard/email-logs', permission: 'VIEW_EMAIL_LOGS' },
  { label: 'Alumni Management', icon: <LucideGraduationCap size={20} />, href: '/admin/dashboard/alumni', permission: 'MANAGE_USERS' },
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
    const hasAnyAdminPermission = user?.permissions && user.permissions.length > 0;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && !hasAnyAdminPermission)) {
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

  const hasAnyAdminPermission = user?.permissions && user.permissions.length > 0;
  if (!isAuthenticated || (user?.role !== 'ADMIN' && !hasAnyAdminPermission)) return null;

  const filteredMenuItems = MENU_ITEMS.filter(item => {
    // If it's a global admin, show everything
    if (user?.role === 'ADMIN') return true;

    // If it has no specific permission requirement, show it to anyone allowed in admin panel
    if (!item.permission) return true;

    // Check if user has the specific permission
    return user?.permissions?.includes(item.permission);
  });

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      {/* Sidebar Header - Hidden in desktop since it's below global navbar */}
      {isMobile && (
        <Box sx={{ p: 3, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <NextImage src="/sust.png" alt="SUST Logo" width={32} height={32} />
            <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: -0.5, color: '#fff' }}>
              SUST <span style={{ color: '#3b82f6' }}>Admin</span>
            </Typography>
          </Stack>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <LucideX size={20} />
          </IconButton>
        </Box>
      )}
      
      <Box sx={{ px: 2, mb: 4, mt: isMobile ? 0 : 4 }}>
         <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2, bgcolor: '#1e293b', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
            <Avatar src={user?.profileImage} sx={{ width: 40, height: 40, border: '2px solid #3b82f6' }}>
               {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
               <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: '#fff' }}>Admin Control</Typography>
               <Typography variant="caption" sx={{ color: '#94a3b8' }} noWrap>{user?.name}</Typography>
            </Box>
         </Stack>
      </Box>

      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#1e293b', borderRadius: 10 } }}>
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.href);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: isActive ? '#3b82f6' : '#94a3b8',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#3b82f6' : '#f8fafc',
                    transform: 'translateX(4px)'
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? '#3b82f6' : 'inherit',
                    transition: 'color 0.2s ease'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            color: '#ef4444',
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' }
          }}
        >
           <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              <LucideLogOut size={20} />
           </ListItemIcon>
           <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
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
              bgcolor: '#0f172a',
              color: '#ffffff',
              borderRight: 'none',
              top: '100px', // Exactly below the navbar
              height: 'calc(100vh - 100px)',
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              bgcolor: '#0f172a',
              color: '#ffffff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Floating Mobile Toggle for Admin Menu */}
        {isMobile && !mobileOpen && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24, 
              bgcolor: '#0f172a', 
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              zIndex: 1200,
              '&:hover': { bgcolor: '#1e293b' }
            }}
          >
            <LucideMenu size={24} />
          </IconButton>
        )}

        <Box component="main" sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          flexGrow: 1,
          width: '100%',
          overflowX: 'hidden',
          animation: 'fadeIn 0.6s ease-out forwards',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
