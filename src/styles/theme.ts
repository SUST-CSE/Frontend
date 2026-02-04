import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#16a34a', // Green
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626', // Red
    },
    warning: {
      main: '#facc15', // Yellow
    },
    background: {
      default: '#ffffff', // White
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#4b5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, fontSize: '3.5rem', letterSpacing: '-0.02em', color: '#000000' },
    h2: { fontWeight: 800, fontSize: '2.75rem', letterSpacing: '-0.01em', color: '#000000' },
    h3: { fontWeight: 800, fontSize: '2.25rem', color: '#000000' },
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h5: { fontWeight: 700, fontSize: '1.5rem' },
    h6: { fontWeight: 700, fontSize: '1.25rem' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        },
        containedPrimary: {
          backgroundColor: '#000000',
          '&:hover': { backgroundColor: '#1f2937' },
        },
        containedSecondary: {
          backgroundColor: '#16a34a',
          '&:hover': { backgroundColor: '#15803d' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            borderColor: '#e2e8f0',
          },
        },
      },
    }
  },
});
