import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }
  interface SimplePaletteColorOptions {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
  }
}

const theme = createTheme({
  direction: 'rtl',
  palette: {
    background: {
      default: '#F2EFE7',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#3368A0',
      light: '#548DC9', // 400
      dark: '#2A5584',  // 600
      contrastText: '#FFFFFF',
      50: '#F0F5F9',
      100: '#DEE8F2',
      200: '#BBD0E7',
      300: '#8CB1D9',
      400: '#548DC9',
      500: '#3368A0',
      600: '#2A5584',
      700: '#1E446B',
      800: '#133458',
      900: '#0C233B',
    },
    secondary: {
      main: '#133458',
    },
    text: {
      primary: '#133458',
      secondary: 'rgba(19,52,88,0.72)',
      disabled: 'rgba(19,52,88,0.4)',
    },
    divider: 'rgba(19,52,88,0.12)',
  },
  typography: {
    fontFamily: 'var(--font-cairo), sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.7,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid rgba(19,52,88,0.12)',
          boxShadow: '0 2px 8px rgba(19,52,88,0.04)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3368A0', // primary.500
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F0F5F9', // primary.50
        },
      },
    },
  },
});

export default theme;
