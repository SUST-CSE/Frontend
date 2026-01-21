'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material';
import { User as UserIcon } from 'lucide-react';
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
        <Toolbar disableGutters sx={{ height: 100, px: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
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
                  fontSize: { xs: '0.9rem', sm: '1.2rem' },
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
                  fontSize: { xs: '0.65rem', sm: '0.85rem' },
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  mt: 0.5
                }}
              >
                Shahjalal University of Science and Technology
              </Typography>
            </Box>
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
        </Toolbar>
    </AppBar>
  );
}
