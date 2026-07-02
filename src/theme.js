import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#155EEF',
      dark: '#0F3E99',
    },
    secondary: {
      main: '#0E9384',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#101828',
      secondary: '#5D6678',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontSize: '2.4rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.6rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '1.15rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E4E7EC',
          boxShadow: '0 1px 2px rgba(16, 24, 40, 0.06)',
        },
      },
    },
  },
});
