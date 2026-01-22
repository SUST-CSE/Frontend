'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { User as UserIcon, LucideMenu, LucideX, LucideChevronRight } from 'lucide-react';
import { RootState } from '@/store';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  { label: 'Societies', href: '/societies' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Academic', href: '/academic' },
  { label: 'Payments', href: '/payments' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Blogs', href: '/blogs' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
        <Image 
          src="/sust.png" 
          alt="SUST Logo" 
          width={40} 
          height={40} 
          style={{ objectFit: 'contain' }}
        />
        <IconButton onClick={handleDrawerToggle}>
          <LucideX size={24} color="#64748b" />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, px: 2, pt: 2 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              component={Link} 
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 2,
                '&:hover': { bgcolor: '#f8fafc', color: '#16a34a' }
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} 
              />
              <LucideChevronRight size={16} color="#cbd5e1" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9' }}>
        {isAuthenticated && user?.name ? (
           <Button
             fullWidth
             variant="outlined"
             onClick={() => {
               handleUserClick();
               handleDrawerToggle();
             }}
             startIcon={
                <Avatar sx={{ width: 24, height: 24, bgcolor: '#16a34a', fontSize: '0.75rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
             }
             sx={{ 
               justifyContent: 'flex-start',
               color: '#0f172a',
               borderColor: '#e2e8f0',
               textTransform: 'none',
               fontWeight: 600
             }}
           >
             {user.name}
           </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              handleUserClick();
              handleDrawerToggle();
            }}
            sx={{ 
              bgcolor: '#000000',
              color: '#ffffff',
              '&:hover': { bgcolor: '#16a34a' },
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      ref={navRef}
      sx={{ 
        bgcolor: '#ffffff', 
        boxShadow: 'none',
        borderBottom: '1px solid #e2e8f0' 
      }}
    >
        <Toolbar disableGutters sx={{ height: 100, px: 3, justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              cursor: 'pointer' 
            }} 
            onClick={() => router.push('/')}
          >
            <Image 
              src="/sust.png" 
              alt="SUST Logo" 
              width={60} 
              height={60} 
              style={{ objectFit: 'contain' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="subtitle1"
                sx={{ 
                  fontWeight: 700, 
                  lineHeight: 1.1, 
                  color: '#0f172a',
                  fontSize: { xs: '0.85rem', sm: '1.1rem', lg: '1.25rem' },
                  letterSpacing: '-0.01em'
                }}
              >
                Department of Computer Science and Engineering
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  fontWeight: 600, 
                  color: '#121a15ff',
                  fontSize: { xs: '0.6rem', sm: '0.8rem', lg: '0.85rem' },
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  mt: 0.5
                }}
              >
                Shahjalal University of Science and Technology
              </Typography>
            </Box>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: '#64748b',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': {
                    color: '#16a34a',
                    bgcolor: '#f1f5f9',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            
            <IconButton 
              onClick={handleUserClick}
              sx={{ 
                ml: 2,
                color: '#000000',
                '&:hover': { color: '#16a34a', bgcolor: '#f1f5f9' }
              }}
            >
              {isAuthenticated && user?.name ? (
                 <Avatar sx={{ width: 36, height: 36, bgcolor: '#16a34a', fontSize: '1rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                 </Avatar>
              ) : (
                <UserIcon size={28} />
              )}
            </IconButton>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { lg: 'none' }, color: '#0f172a' }}
          >
            <LucideMenu size={28} />
          </IconButton>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawerContent}
        </Drawer>
    </AppBar>
  );
}
