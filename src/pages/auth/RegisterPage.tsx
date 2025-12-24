import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLoginService } from '../../service/user/auth/user.login.service';
import { API_BASE_URL } from '../../config/apiConfig';
import { Card, Box, Typography, TextField, Button, InputAdornment, Alert, Snackbar, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { COLORS } from '../../theme/theme';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const navigate = useNavigate();

  const validate = () => {
    const errors: any = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name.trim())) {
      errors.name = 'Full name must only contain letters and spaces';
    }
    if (!age || isNaN(Number(age)) || Number(age) < 18 || Number(age) > 120) {
      errors.age = 'Age must be at least 18';
    }
    if (!phone.match(/^\d{10}$/)) {
      errors.phone = 'Phone must be exactly 10 digits';
    }
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      errors.email = 'Invalid email address';
    }
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age: Number(age), phone, email, password })
      });
      const result = await res.json();
      
      if (!res.ok) {
        if (result?.error?.toLowerCase().includes('phone')) {
          setError('Phone number is already registered');
        } else if (result?.error?.toLowerCase().includes('email')) {
          setError('Email address is already registered');
        } else {
          setError('Registration failed. Please try again.');
        }
        setOpenSnackbar(true);
        return;
      }
      
      setOpenSnackbar(true);
      setFieldErrors({});
      
      // Auto login after successful registration
      try {
        const loginRes = await UserLoginService.loginByEmailAndPassword({ email, password });
        if (loginRes?.data?.accessToken) {
          localStorage.setItem('access_token', loginRes.data.accessToken);
          document.cookie = `access_token=${loginRes.data.accessToken}; path=/`;
        }
      } catch (loginErr) {
        console.error('Auto-login failed:', loginErr);
      }
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
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
        px: 2,
        py: 4
      }}
    >
      <Card 
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          maxWidth: 500, 
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
            Create Account
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.95rem',
              textAlign: 'center'
            }}
          >
            Join HouPlatform and find your perfect student home
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
              Full Name
            </Typography>
            <TextField
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              fullWidth
              placeholder="John Doe"
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f8f9fa',
                  '&:hover': { backgroundColor: '#fff' },
                  '&.Mui-focused': { backgroundColor: '#fff' }
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
                Age
              </Typography>
              <TextField
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
                fullWidth
                placeholder="18"
                error={!!fieldErrors.age}
                helperText={fieldErrors.age}
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon sx={{ color: '#999', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover': { backgroundColor: '#fff' },
                    '&.Mui-focused': { backgroundColor: '#fff' }
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
                Phone Number
              </Typography>
              <TextField
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                fullWidth
                placeholder="0123456789"
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone}
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#999', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover': { backgroundColor: '#fff' },
                    '&.Mui-focused': { backgroundColor: '#fff' }
                  }
                }}
              />
            </Box>
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
              Email Address
            </Typography>
            <TextField
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              placeholder="you@example.com"
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
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
                  '&:hover': { backgroundColor: '#fff' },
                  '&.Mui-focused': { backgroundColor: '#fff' }
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
              placeholder="Minimum 8 characters"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
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
                  '&:hover': { backgroundColor: '#fff' },
                  '&.Mui-focused': { backgroundColor: '#fff' }
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
            Create Account
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                display: 'inline'
              }}
            >
              Already have an account?{' '}
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
              onClick={() => navigate('/login')}
            >
              Sign In
            </Typography>
          </Box>
        </Box>

        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setOpenSnackbar(false)} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            severity={error ? 'error' : 'success'}
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              fontWeight: 600
            }}
            onClose={() => setOpenSnackbar(false)}
          >
            {error ? error : '🎉 Account created! Redirecting...'}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
}
