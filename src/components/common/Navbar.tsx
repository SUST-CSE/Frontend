'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Avatar } from '@mui/material';
import { LucideTerminal, User as UserIcon } from 'lucide-react';
import { RootState } from '@/store';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  { label: 'Societies', href: '/societies' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Academic', href: '/academic' },
  { label: 'Payments', href: '/payments' },
  { label: 'Blogs', href: '/blogs' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

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
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <LucideTerminal size={32} color="#000000" strokeWidth={2.5} />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#000000' }}
            >
              SUST <span style={{ color: '#16a34a' }}>CSE</span>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  color: '#64748b',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.9rem',
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
                 <Avatar sx={{ width: 32, height: 32, bgcolor: '#16a34a', fontSize: '0.9rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                 </Avatar>
              ) : (
                <UserIcon size={24} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
