
import { useState } from 'react';
import { UserLoginService } from '../../service/user/auth/user.login.service';
import { Card, Box, Typography, TextField, Button, InputAdornment, Alert, Snackbar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const res = await UserLoginService.loginByEmailAndPassword({ email, password });
      document.cookie = `access_token=${res.data.accessToken}; path=/`;
      setSuccess(true);
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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      <Card sx={{ p: 4, maxWidth: 400, width: '100%', boxShadow: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <ApartmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>HouPlatform</Typography>
        </Box>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment> }}
          />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1, fontWeight: 600, py: 1.5, boxShadow: 2, borderRadius: 2, ':hover': { backgroundColor: 'primary.dark' } }}>
            Login
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert
              severity={error ? 'error' : 'success'}
              variant="filled"
              sx={{ width: '100%' }}
              onClose={() => setOpenSnackbar(false)}
            >
              {error ? error : 'Login successful! Redirecting...'}
            </Alert>
          </Snackbar>
        </Box>
      </Card>
    </Box>
  );
}
