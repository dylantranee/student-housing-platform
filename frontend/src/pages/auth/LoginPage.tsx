
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLoginService } from '../../service/user/auth/user.login.service';
import { Card, Box, Typography, TextField, Button, InputAdornment, Alert, Snackbar, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../theme/theme';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await UserLoginService.loginByEmailAndPassword({ email, password });
      document.cookie = `access_token=${res.data.accessToken}; path=/`;
      setOpenSnackbar(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1200);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
        px: 2
      }}
    >
      <Card 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          maxWidth: 440, 
          width: '100%', 
          boxShadow: '0 8px 32px rgba(255, 90, 95, 0.15)', 
          borderRadius: 4,
          border: '1px solid rgba(255, 90, 95, 0.1)',
          position: 'relative'
        }}
      >
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: '#666',
            '&:hover': {
              bgcolor: '#f8f9fa',
              color: COLORS.primary
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              bgcolor: '#FFF0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <HomeIcon sx={{ fontSize: 36, color: COLORS.primary }} />
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: '#222', 
              mb: 0.5,
              letterSpacing: '-0.5px'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.95rem'
            }}
          >
            Sign in to continue to HouPlatform
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600, 
                color: '#222',
                fontSize: '0.9rem'
              }}
            >
              Email Address
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              placeholder="you@example.com"
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#fff'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff'
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                fontWeight: 600, 
                color: '#222',
                fontSize: '0.9rem'
              }}
            >
              Password
            </Typography>
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              placeholder="Enter your password"
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                  '&:hover': {
                    backgroundColor: '#fff'
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#fff'
                  }
                }
              }}
            />
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              mt: 1, 
              bgcolor: COLORS.primary,
              color: 'white',
              fontWeight: 700,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { 
                bgcolor: COLORS.primaryHover,
                boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)'
              }
            }}
          >
            Sign In
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                display: 'inline'
              }}
            >
              Don't have an account?{' '}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              sx={{ 
                fontWeight: 700, 
                color: COLORS.primary, 
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} 
              onClick={() => navigate('/register')}
            >
              Create Account
            </Typography>
          </Box>
        </Box>

        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={2500} 
          onClose={() => setOpenSnackbar(false)} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              fontWeight: 600,
              bgcolor: '#96FFC0',
              color: '#222',
              '& .MuiAlert-icon': {
                color: '#222'
              }
            }}
            onClose={() => setOpenSnackbar(false)}
          >
            {error ? error : 'Login successful!'}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
}
