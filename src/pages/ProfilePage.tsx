import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button, 
  TextField, 
  InputAdornment, 
  Snackbar,
  Container,
  Tabs,
  Tab,
  Divider,
  Stack
} from '@mui/material';
import { getProfile } from '../service/user/getProfile.service';
import { updateProfile } from '../service/user/updateProfile.service';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import RoommateProfileTab from '../components/profile/RoommateProfileTab';
import { COLORS } from '../theme/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editMode, setEditMode] = useState(false);
	
	// Initialize tab from query param if present
	const initialTab = searchParams.get('tab') === 'roommate' ? 1 : 0;
	const [tabValue, setTabValue] = useState(initialTab);
	
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
				const data = res.data || res;
				setUser(data);
				setForm({
					name: data.name || '',
					age: data.age || '',
					phone: data.phone || '',
					email: data.email || '',
				});
			} catch (err: any) {
				setError('Failed to load profile. Please log in again.');
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, []);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		setSearchParams({ tab: newValue === 1 ? 'roommate' : 'account' });
	};

	const validate = () => {
		const errors: any = {};
		if (!form.name.trim()) {
			errors.name = 'Full name is required';
		}
		if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 18) {
			errors.age = 'Age must be 18 or older';
		}
		if (!form.phone.match(/^\d{10}$/)) {
			errors.phone = 'Phone must be 10 digits';
		}
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
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
			setSuccess('Profile updated successfully');
			setOpenSnackbar(true);
		} catch (err: any) {
			setError('Failed to update profile');
			setOpenSnackbar(true);
		}
	};

	return (
		<Box sx={{ bgcolor: '#FDFDFD', minHeight: '100vh', pb: 8 }}>
			<Header />
			
			<Container maxWidth="md" sx={{ mt: { xs: 10, md: 14 } }}>
				<Box sx={{ mb: 4 }}>
					<Typography variant="h3" sx={{ fontWeight: 900, fontFamily: 'var(--font-serif)', color: '#222', mb: 1 }}>
						Settings
					</Typography>
					<Typography color="text.secondary" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
						Manage your account information and roommate preferences.
					</Typography>
				</Box>

				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
					<Tabs value={tabValue} onChange={handleTabChange} sx={{
						'& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '1rem', minWidth: 120 },
						'& .Mui-selected': { color: `${COLORS.primary} !important` },
						'& .MuiTabs-indicator': { backgroundColor: COLORS.primary }
					}}>
						<Tab icon={<AccountCircleIcon />} iconPosition="start" label="Account Details" />
						<Tab icon={<Diversity3Icon />} iconPosition="start" label="Roommate Profile" />
					</Tabs>
				</Box>

				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
						<CircularProgress sx={{ color: COLORS.primary }} />
					</Box>
				) : (
					<>
						<TabPanel value={tabValue} index={0}>
							<Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #f0f0f0' }}>
								{editMode ? (
									<Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
										<Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Update Account Info</Typography>
										<Stack spacing={3}>
											<TextField
												label="Full Name"
												name="name"
												value={form.name}
												onChange={(e) => setForm({ ...form, name: e.target.value })}
												error={!!fieldErrors.name}
												helperText={fieldErrors.name}
												fullWidth
											/>
											<Stack direction="row" spacing={2}>
												<TextField
													label="Age"
													name="age"
													type="number"
													value={form.age}
													onChange={(e) => setForm({ ...form, age: e.target.value })}
													error={!!fieldErrors.age}
													helperText={fieldErrors.age}
													fullWidth
												/>
												<TextField
													label="Phone Number"
													name="phone"
													value={form.phone}
													onChange={(e) => setForm({ ...form, phone: e.target.value })}
													error={!!fieldErrors.phone}
													helperText={fieldErrors.phone}
													fullWidth
												/>
											</Stack>
											<TextField
												label="Email"
												disabled
												value={form.email}
												fullWidth
												helperText="Email cannot be changed"
											/>
										</Stack>
										<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
										<Button type="submit" variant="contained" sx={{ bgcolor: COLORS.primary, '&:hover': { bgcolor: COLORS.primaryHover }, borderRadius: 50, px: 4, fontWeight: 800, boxShadow: 'none' }}>Save Changes</Button>
											<Button onClick={() => setEditMode(false)} variant="outlined" sx={{ borderRadius: 50, px: 4, fontWeight: 700 }}>Cancel</Button>
										</Box>
									</Box>
								) : (
									<Box>
										<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
											<Box>
												<Typography variant="h5" sx={{ fontWeight: 800, color: '#222' }}>{user?.name || 'Incomplete Profile'}</Typography>
												<Typography color="text.secondary" sx={{ fontWeight: 500 }}>Student Member</Typography>
											</Box>
											<Button 
												variant="outlined" 
												onClick={() => setEditMode(true)}
												sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700, borderColor: '#ddd', color: '#222' }}
											>
												Edit Profile
											</Button>
										</Box>
										
										<Divider sx={{ mb: 3 }} />
										
										<Stack spacing={2.5}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<EmailIcon sx={{ color: 'text.secondary' }} />
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>EMAIL ADDRESS</Typography>
													<Typography sx={{ fontWeight: 600 }}>{user?.email}</Typography>
												</Box>
											</Box>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<PhoneIcon sx={{ color: 'text.secondary' }} />
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>PHONE NUMBER</Typography>
													<Typography sx={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</Typography>
												</Box>
											</Box>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<CakeIcon sx={{ color: 'text.secondary' }} />
												<Box>
													<Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>AGE</Typography>
													<Typography sx={{ fontWeight: 600 }}>{user?.age || 'Not provided'}</Typography>
												</Box>
											</Box>
										</Stack>
									</Box>
								)}
							</Paper>
						</TabPanel>

						<TabPanel value={tabValue} index={1}>
							<RoommateProfileTab userId={user?._id || user?.id} />
						</TabPanel>
					</>
				)}

				<Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
					<Alert severity={success ? 'success' : 'error'} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
						{success || error}
					</Alert>
				</Snackbar>
			</Container>
		</Box>
	);
}
