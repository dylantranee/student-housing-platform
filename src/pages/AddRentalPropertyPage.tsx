import React, { useState, useEffect } from "react";
import { getProfile } from '../service/user/getProfile.service';
import { createProperty } from '../service/properties/createProperty.service';
import LeafletMap from '../components/common/LeafletMap';
import Header from '../components/layout/Header';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  FormControl,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { COLORS } from '../theme/theme';


const AddRentalPropertyPage: React.FC = () => {
	       const initialFormState = {
		       title: "",
		       email: "",
		       address: "",
		       price: "",
		       description: "",
		       bedrooms: "",
		       bathrooms: "",
		       area: "",
		       image: null as File | null,
		       lat: 0,
		       lng: 0,
	       };
	       const [form, setForm] = useState(initialFormState);
	       const [position, setPosition] = useState<[number, number]>([10.762622, 106.660172]);
	       const [address, setAddress] = useState<string>("");

	useEffect(() => {
		async function fetchProfile() {
			try {
				const data = await getProfile();
				console.log('Profile data:', data);
				setForm((prev) => ({
					...prev,
					name: data.name || "",
					email: data.email || "",
				}));
			} catch (err) {
				console.error('Failed to fetch profile:', err);
			}
		}
		fetchProfile();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setForm((prev) => ({ ...prev, image: e.target.files![0] }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const submitData = {
				title: form.title,
				location: form.address,
				price: Number(form.price),
				bedrooms: Number(form.bedrooms),
				bathrooms: Number(form.bathrooms),
				area: Number(form.area),
				description: form.description,
				images: form.image ? [form.image.name] : [],
				email: form.email,
				lat: form.lat,
				lng: form.lng,
			};
			console.log('Submit data:', submitData);
			console.log('Lat/Lng values:', { lat: form.lat, lng: form.lng });
			   await createProperty(submitData);
			   alert('Property added!');
			   setForm(initialFormState); // Reset form về giá trị ban đầu
		} catch (error) {
			alert('Error adding property');
		}
	};

	return (
		<>
		<Header />
		<Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
			<Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: 10 }}>
				<Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, textAlign: 'center' }}>
					<Typography 
						variant="h2" 
						component="h1" 
						sx={{ 
							fontFamily: 'var(--font-serif)', 
							fontWeight: 700, 
							mb: 2, 
							color: '#000', 
							fontSize: { xs: '2rem', md: '2.75rem' } 
						}}
					>
						List Your Property
					</Typography>
					<Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: '1.1rem' }}>
						Share your space with students looking for their perfect home
					</Typography>
				</Box>

				<Box 
					sx={{ 
						bgcolor: 'white', 
						p: { xs: 3, md: 5 }, 
						borderRadius: 3, 
						boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
						border: '1px solid #e0e0e0'
					}}
				>
					<Box component="form" onSubmit={handleSubmit}>
						<Stack spacing={4}>
							{/* Basic Information Section */}
							<Box>
								<Typography 
									variant="h6" 
									sx={{ 
										fontWeight: 700, 
										mb: 3, 
										color: '#000',
										fontSize: '1.25rem',
										letterSpacing: 0.5
									}}
								>
									BASIC INFORMATION
								</Typography>
								<Stack spacing={3}>
									<TextField
										label="Property Title"
										name="title"
										value={form.title}
										onChange={handleChange}
										required
										fullWidth
										placeholder="e.g., Cozy Studio Near University"
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
												'&:hover fieldset': { borderColor: '#FF5A5F' },
												'&.Mui-focused fieldset': { borderColor: '#FF5A5F' }
											}
										}}
									/>
									<TextField
										label="Address"
										name="address"
										value={form.address}
										onChange={handleChange}
										required
										fullWidth
										placeholder="e.g., 123 Main Street, District 1"
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
												'&:hover fieldset': { borderColor: '#FF5A5F' },
												'&.Mui-focused fieldset': { borderColor: '#FF5A5F' }
											}
										}}
									/>
									<TextField
										label="Description"
										name="description"
										value={form.description}
										onChange={handleChange}
										multiline
										rows={4}
										fullWidth
										placeholder="Describe your property, amenities, nearby facilities..."
										sx={{
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
											'&:hover fieldset': { borderColor: COLORS.primary },
											'&.Mui-focused fieldset': { borderColor: COLORS.primary }
											}
										}}
									/>
								</Stack>
							</Box>

							{/* Property Details Section */}
							<Box>
								<Typography 
									variant="h6" 
									sx={{ 
										fontWeight: 700, 
										mb: 3, 
										color: '#000',
										fontSize: '1.25rem',
										letterSpacing: 0.5
									}}
								>
									PROPERTY DETAILS
								</Typography>
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label="Rental Price (VND/month)"
											name="price"
											type="number"
											value={form.price}
											onChange={handleChange}
											required
											fullWidth
											placeholder="e.g., 5000000"
											InputProps={{
												endAdornment: <InputAdornment position="end">VND</InputAdornment>,
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: 2,
														'&:hover fieldset': { borderColor: COLORS.primary },
														'&.Mui-focused fieldset': { borderColor: COLORS.primary }
												}
											}}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label="Area (m²)"
											name="area"
											type="number"
											value={form.area}
											onChange={handleChange}
											required
											fullWidth
											placeholder="e.g., 30"
											InputProps={{
												endAdornment: <InputAdornment position="end">m²</InputAdornment>,
											}}
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: 2,
													'&:hover fieldset': { borderColor: '#FF5A5F' },
													'&.Mui-focused fieldset': { borderColor: '#FF5A5F' }
												}
											}}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label="Bedrooms"
											name="bedrooms"
											type="number"
											value={form.bedrooms}
											onChange={handleChange}
											required
											fullWidth
											placeholder="e.g., 1"
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: 2,
													'&:hover fieldset': { borderColor: '#FF5A5F' },
													'&.Mui-focused fieldset': { borderColor: '#FF5A5F' }
												}
											}}
										/>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											label="Bathrooms"
											name="bathrooms"
											type="number"
											value={form.bathrooms}
											onChange={handleChange}
											required
											fullWidth
											placeholder="e.g., 1"
											sx={{
												'& .MuiOutlinedInput-root': {
													borderRadius: 2,
													'&:hover fieldset': { borderColor: '#FF5A5F' },
													'&.Mui-focused fieldset': { borderColor: '#FF5A5F' }
												}
											}}
										/>
									</Grid>
								</Grid>
							</Box>
						{/* Images Section */}
						<Box>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700, 
									mb: 3, 
									color: '#000',
									fontSize: '1.25rem',
									letterSpacing: 0.5
								}}
							>
								IMAGES
							</Typography>
							<FormControl fullWidth>
								<Button
									variant="outlined"
									component="label"
									sx={{ 
										textTransform: "none",
										borderRadius: 2,
										py: 2,
										borderColor: '#e0e0e0',
										color: '#000',
										fontSize: '1rem',
										'&:hover': {
										borderColor: COLORS.primary,
											bgcolor: '#fff5f5'
										}
									}}
								>
									{form.image ? form.image.name : "Choose Property Image"}
									<input
										type="file"
										accept="image/*"
										hidden
										onChange={handleImageChange}
									/>
								</Button>
							</FormControl>
						</Box>

						{/* Location Section */}
						<Box>
							<Typography 
								variant="h6" 
								sx={{ 
									fontWeight: 700, 
									mb: 3, 
									color: '#000',
									fontSize: '1.25rem',
									letterSpacing: 0.5
								}}
							>
								LOCATION
							</Typography>
							<LeafletMap 
								position={position}
								setPosition={setPosition}
								setAddress={setAddress}
								radiusKm={0}
								properties={[]}
								onLocationChange={(lat, lng, addr) => {
									setForm(prev => ({ ...prev, lat, lng, address: addr }));
								}}
								usePropertyLocationIcon
							/>
						</Box>

						{/* Submit Button */}
						<Button
							type="submit"
							variant="contained"
							size="large"
							sx={{ 
								fontWeight: 700, 
								borderRadius: 50,
								py: 2,
								fontSize: '1.1rem',
								bgcolor: COLORS.primary,
								textTransform: 'none',
								boxShadow: 'none',
								'&:hover': { 
									bgcolor: COLORS.primaryHover,
									boxShadow: 'none'
								}
							}}
							fullWidth
						>
							Publish Property
						</Button>
					</Stack>
				</Box>
			</Box>
		</Container>
		</Box>
		</>
	);
};

export default AddRentalPropertyPage;
