
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLoginService } from '../../service/user/auth/user.login.service';
import { Card, Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      errors.age = 'Age must be greater than 18';
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
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, phone, email, password })
      });
      const result = await res.json();
      if (!res.ok) {
        if (result?.error?.toLowerCase().includes('phone')) {
          setError('Số điện thoại đã được sử dụng');
        } else if (result?.error?.toLowerCase().includes('email')) {
          setError('Email đã được sử dụng');
        } else {
          setError('Đăng ký thất bại');
        }
        setSuccess('');
        return;
      }
      setSuccess('Đăng ký thành công!');
      setError('');
      setFieldErrors({});
      // Auto login after successful registration
      try {
        const loginRes = await UserLoginService.loginByEmailAndPassword({ email, password });
        if (loginRes?.data?.accessToken) {
          localStorage.setItem('access_token', loginRes.data.accessToken);
          document.cookie = `access_token=${loginRes.data.accessToken}; path=/`;
        }
      } catch {}
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError('Đăng ký thất bại');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
      <Card sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <ApartmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>HouPlatform</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textAlign: 'center' }}>
            Create your account to start exploring properties.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Full Name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.age}
            helperText={fieldErrors.age}
            InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.phone}
            helperText={fieldErrors.phone}
            InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon color="primary" /></InputAdornment> }}
          />
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1, fontWeight: 600, py: 1.5, borderRadius: 2, ':hover': { backgroundColor: 'primary.dark' } }}>
            Register
          </Button>
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
        </Box>
      </Card>
    </Box>
  );
}
