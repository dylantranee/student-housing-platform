import { createTheme } from '@mui/material/styles';

// Project Color Palette
export const COLORS = {
  primary: '#FF5A5F',      // Coral Red - Primary brand color
  primaryHover: '#FF385C', // Darker coral for hover states
  secondary: '#FF93B3',    // Pink - Secondary accent
  neutral: '#DEDEDE',      // Light Gray - Borders, backgrounds
  gradient: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)', // Background gradient
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
      light: COLORS.secondary,
      dark: COLORS.primaryHover,
    },
    secondary: {
      main: COLORS.secondary,
      light: '#FFB8D2',
      dark: '#FF6E9F',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
      },
    },
  },
});
