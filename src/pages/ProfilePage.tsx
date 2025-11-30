
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Button, TextField, InputAdornment, Snackbar } from '@mui/material';
import { getProfile } from '../service/user/getProfile.service';
import { updateProfile } from '../service/user/updateProfile.service';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';

export default function ProfilePage() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState<any>({ name: '', age: '', phone: '', email: '' });
	const [fieldErrors, setFieldErrors] = useState<any>({});
	const [success, setSuccess] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);

	useEffect(() => {
		async function fetchProfile() {
			setLoading(true);
			setError('');
			try {
				const res = await getProfile();
				setUser(res.data || res);
				setForm({
					name: res.data?.name || res.name || '',
					age: res.data?.age || res.age || '',
					phone: res.data?.phone || res.phone || '',
					email: res.data?.email || res.email || '',
				});
			} catch (err: any) {
				setError('Failed to load profile. Please log in again.');
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, []);

	const validate = () => {
		const errors: any = {};
		if (!form.name.trim()) {
			errors.name = 'Full name is required';
		} else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(form.name.trim())) {
			errors.name = 'Full name must only contain letters and spaces';
		}
		if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 18 || Number(form.age) > 120) {
			errors.age = 'Age must be greater than 18';
		}
		if (!form.phone.match(/^\d{10}$/)) {
			errors.phone = 'Phone must be exactly 10 digits';
		}
		if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
			errors.email = 'Invalid email address';
		}
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleEdit = () => {
		setEditMode(true);
		setFieldErrors({});
		setSuccess('');
	};

	const handleCancel = () => {
		setEditMode(false);
		setForm({
			name: user?.name || '',
			age: user?.age || '',
			phone: user?.phone || '',
			email: user?.email || '',
		});
		setFieldErrors({});
		setSuccess('');
	};

	const handleChange = (e: any) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSave = async (e: any) => {
		e.preventDefault();
		if (!validate()) return;
		try {
			const res = await updateProfile({
				name: form.name,
				age: Number(form.age),
				phone: form.phone,
				email: form.email,
			});
			setUser((prev: any) => ({ ...prev, ...res.data }));
			setEditMode(false);
			setSuccess('Cập nhật thành công!');
			setOpenSnackbar(true);
		} catch (err: any) {
			setError('Cập nhật thất bại');
			setOpenSnackbar(true);
		}
	};

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
			<Paper sx={{ maxWidth: 420, width: '100%', mx: 'auto', p: 4, borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: 'none', textAlign: 'center' }}>
				{loading ? (
					<CircularProgress color="primary" sx={{ my: 6 }} />
				) : error ? (
					<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
				) : (
					<>
						{editMode ? (
							<Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', mt: 1 }}>
								<TextField
									label="Full Name"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									fullWidth
									error={!!fieldErrors.name}
									helperText={fieldErrors.name}
									InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment> }}
									sx={{ maxWidth: 340, borderRadius: 2, fontSize: 18, '& input': { fontSize: 18 }, '& label': { fontSize: 18 } }}
								/>
								<TextField
									label="Age"
									name="age"
									type="number"
									value={form.age}
									onChange={handleChange}
									required
									fullWidth
									error={!!fieldErrors.age}
									helperText={fieldErrors.age}
									InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="primary" /></InputAdornment> }}
									sx={{ maxWidth: 340, borderRadius: 2, fontSize: 18, '& input': { fontSize: 18 }, '& label': { fontSize: 18 } }}
								/>
								<TextField
									label="Phone Number"
									name="phone"
									type="tel"
									value={form.phone}
									onChange={handleChange}
									required
									fullWidth
									error={!!fieldErrors.phone}
									helperText={fieldErrors.phone}
									InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary" /></InputAdornment> }}
									sx={{ maxWidth: 340, borderRadius: 2, fontSize: 18, '& input': { fontSize: 18 }, '& label': { fontSize: 18 } }}
								/>
								<TextField
									label="Email"
									name="email"
									type="email"
									value={form.email}
									onChange={handleChange}
									required
									fullWidth
									error={!!fieldErrors.email}
									helperText={fieldErrors.email}
									InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="primary" /></InputAdornment> }}
									sx={{ maxWidth: 340, borderRadius: 2, fontSize: 18, '& input': { fontSize: 18 }, '& label': { fontSize: 18 } }}
								/>
								<Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
									<Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1, fontSize: 18 }}>Save</Button>
									<Button variant="outlined" color="secondary" sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1, fontSize: 18 }} onClick={handleCancel}>Cancel</Button>
								</Box>
							</Box>
						) : (
							<>
								<Typography variant="h4" sx={{ fontWeight: 800, mb: 2, letterSpacing: 1, fontSize: 28 }}>{user?.name || user?.email}</Typography>
								<Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600, fontSize: 20 }}>Email: {user?.email}</Typography>
								{user?.age && <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: 20 }}>Age: {user.age}</Typography>}
								{user?.phone && <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: 20 }}>Phone: {user.phone}</Typography>}
								<Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
									<Button variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1, fontSize: 18 }} onClick={handleEdit}>Edit</Button>
									<Button variant="outlined" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1, fontSize: 18 }} href="/" >Back to Home</Button>
								</Box>
							</>
						)}
						<Snackbar open={openSnackbar} autoHideDuration={2500} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
							<Alert
								severity={success ? 'success' : 'error'}
								variant="filled"
								sx={{ width: '100%' }}
								onClose={() => setOpenSnackbar(false)}
							>
								{success ? success : error}
							</Alert>
						</Snackbar>
					</>
				)}
			</Paper>
		</Box>
	);
}
