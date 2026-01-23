'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  Menu,
  MenuItem,
  Collapse,
  Stack
} from '@mui/material';
import { 
  User as UserIcon, 
  LucideMenu, 
  LucideX, 
  LucideChevronRight, 
  LucideChevronDown, 
  LucideExternalLink 
} from 'lucide-react';
import { RootState } from '@/store';
import { useGetProductsQuery } from '@/features/product/productApi';

interface Product {
  _id: string;
  name: string;
  link: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  { label: 'Organizations', href: '/societies' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Academic', href: '/academic' },
  { label: 'Products', href: '#', isDropdown: true },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Blogs', href: '/blogs' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Products Dropdown State
  const [productsAnchorEl, setProductsAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { data: productsData } = useGetProductsQuery({});
  const activeProducts = productsData?.data || [];

  // Check if a route is active
  const isActive = (href: string) => {
    if (href === '#' || href === '') return false;
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

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
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleProductsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProductsAnchorEl(event.currentTarget);
  };

  const handleProductsClose = () => {
    setProductsAnchorEl(null);
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
        {NAV_ITEMS.map((item) => {
          if (item.isDropdown && item.label === 'Products') {
            return (
              <Box key={item.label} sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  sx={{ 
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#f8fafc', color: '#16a34a' }
                  }}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem', color: '#64748b' }} 
                  />
                  {mobileProductsOpen ? <LucideChevronDown size={16} color="#cbd5e1" /> : <LucideChevronRight size={16} color="#cbd5e1" />}
                </ListItemButton>
                <Collapse in={mobileProductsOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {activeProducts.map((product: Product) => (
                      <ListItemButton 
                        key={product._id}
                        component="a"
                        href={product.link}
                        target="_blank"
                        sx={{ borderRadius: 2 }}
                      >
                        <ListItemText 
                          primary={product.name} 
                          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                        />
                        <LucideExternalLink size={14} color="#94a3b8" />
                      </ListItemButton>
                    ))}
                    {activeProducts.length === 0 && (
                      <Typography variant="caption" sx={{ pl: 2, py: 1, color: 'text.secondary', display: 'block' }}>No products available</Typography>
                    )}
                  </List>
                </Collapse>
              </Box>
            );
          }

          const active = isActive(item.href);
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: active ? '#f0fdf4' : 'transparent',
                  borderLeft: active ? '4px solid #16a34a' : '4px solid transparent',
                  '&:hover': { bgcolor: '#f8fafc', color: '#16a34a' }
                }}
              >
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontWeight: active ? 700 : 600, 
                    fontSize: '0.95rem',
                    color: active ? '#16a34a' : '#64748b'
                  }} 
                />
                <LucideChevronRight size={16} color={active ? '#16a34a' : '#cbd5e1'} />
              </ListItemButton>
            </ListItem>
          );
        })}
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
        <Toolbar disableGutters sx={{ height: 100, px: { xs: 1.5, sm: 3 }, justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 }, 
              cursor: 'pointer',
              flex: 1, // Allow it to perform layout flexibility
              mr: 2, // Force distance from the right side (menu icon)
              overflow: 'hidden' // Prevent overflow
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
                  fontSize: { xs: '0.9rem', sm: '1.1rem', lg: '1.25rem' }, // Slightly larger base for readability
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
                  fontSize: { xs: '0.65rem', sm: '0.8rem', lg: '0.85rem' },
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
            {NAV_ITEMS.map((item) => {
              if (item.isDropdown && item.label === 'Products') {
                return (
                  <Box key={item.label}>
                    <Button
                      onClick={handleProductsClick}
                      endIcon={<LucideChevronDown size={14} />}
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
                    <Menu
                      anchorEl={productsAnchorEl}
                      open={Boolean(productsAnchorEl)}
                      onClose={handleProductsClose}
                      elevation={0}
                      sx={{
                        '& .MuiPaper-root': {
                          mt: 1,
                          minWidth: 200,
                          borderRadius: 3,
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          border: '1px solid #f1f5f9'
                        }
                      }}
                    >
                      {activeProducts.map((product: Product) => (
                        <MenuItem 
                          key={product._id} 
                          component="a" 
                          href={product.link} 
                          target="_blank"
                          onClick={handleProductsClose}
                          sx={{ 
                            py: 1.5,
                            px: 2,
                            fontWeight: 600,
                            borderRadius: 2,
                            mx: 1,
                            my: 0.5,
                            '&:hover': { bgcolor: '#f0fdf4', color: '#16a34a' }
                          }}
                        >
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            {product.icon && <Box sx={{ width: 20, height: 20, position: 'relative' }}><Image src={product.icon} alt={product.name} fill style={{ objectFit: 'contain' }} unoptimized /></Box>}
                            <ListItemText primary={product.name} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }} />
                            <LucideExternalLink size={14} color="#cbd5e1" />
                          </Stack>
                        </MenuItem>
                      ))}
                      {activeProducts.length === 0 && (
                        <MenuItem disabled sx={{ py: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">No products available</Typography>
                        </MenuItem>
                      )}
                    </Menu>
                  </Box>
                );
              }

              const active = isActive(item.href);
              return (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: active ? '#16a34a' : '#64748b',
                    px: 2,
                    fontWeight: active ? 700 : 600,
                    fontSize: '0.95rem',
                    borderBottom: active ? '2px solid #16a34a' : '2px solid transparent',
                    borderRadius: 0,
                    '&:hover': {
                      color: '#16a34a',
                      bgcolor: '#f1f5f9',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            
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
