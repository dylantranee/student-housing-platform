import React, { useState, useEffect } from "react";
import { getProfile } from '../service/user/getProfile.service';
import { createProperty } from '../service/properties/createProperty.service';
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
	       };
	       const [form, setForm] = useState(initialFormState);

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
			};
			console.log('Submit data:', submitData);
			   await createProperty(submitData);
			   alert('Property added!');
			   setForm(initialFormState); // Reset form về giá trị ban đầu
		} catch (error) {
			alert('Error adding property');
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 3, boxShadow: 3, mt: 6 }}>
				<Typography variant="h4" fontWeight={700} mb={3} align="center">
					Add Rental Property
				</Typography>
				<Box component="form" onSubmit={handleSubmit}>
					<Stack spacing={3}>
						<TextField
							label="Title"
							name="title"
							value={form.title}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							label="Address"
							name="address"
							value={form.address}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							label="Rental Price (VND/month)"
							name="price"
							type="number"
							value={form.price}
							onChange={handleChange}
							required
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">VND</InputAdornment>,
							}}
						/>
						<TextField
							label="Description"
							name="description"
							value={form.description}
							onChange={handleChange}
							multiline
							rows={3}
							fullWidth
						/>
						<TextField
							label="Bedrooms"
							name="bedrooms"
							type="number"
							value={form.bedrooms}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							label="Bathrooms"
							name="bathrooms"
							type="number"
							value={form.bathrooms}
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							label="Area (m²)"
							name="area"
							type="number"
							value={form.area}
							onChange={handleChange}
							required
							fullWidth
							InputProps={{
								endAdornment: <InputAdornment position="end">m²</InputAdornment>,
							}}
						/>
						<FormControl fullWidth>
							<Button
								variant="outlined"
								component="label"
								sx={{ textTransform: "none" }}
							>
								{form.image ? form.image.name : "Choose Image"}
								<input
									type="file"
									accept="image/*"
									hidden
									onChange={handleImageChange}
								/>
							</Button>
						</FormControl>
						<Button
							type="submit"
							variant="contained"
							size="large"
							sx={{ fontWeight: 600, borderRadius: 2 }}
							fullWidth
						>
							Add Property
						</Button>
					</Stack>
				</Box>
			</Box>
		</Container>
	);
};

export default AddRentalPropertyPage;
