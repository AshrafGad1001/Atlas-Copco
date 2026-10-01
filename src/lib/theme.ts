import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2', // Update with your actual primary color
    },
    secondary: {
      main: '#dc004e', // Update with your actual secondary color
    },
  },
  typography: {
    fontFamily: [
      'Cairo',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
