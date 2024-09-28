import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import AuthProvider from './auth/AuthProvider';

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const theme = createTheme({
    colorSchemes: {
      dark: true,
      light: {
        palette: {
          background: {
            default: blueGrey[50],
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
