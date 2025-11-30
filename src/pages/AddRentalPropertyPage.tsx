import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Button, InputLabel, FormControl, Chip, Checkbox, FormControlLabel, Switch } from '@mui/material';
import Grid from '@mui/material/Grid';
import LeafletMapSearch from '../components/common/LeafletMapSearch';

const propertyTypes = [
  'Apartment', 'Townhouse', 'Room', 'Villa', 'Studio', 'Penthouse', 'Officetel', 'Ground Floor', 'Other'
];
const amenitiesList = [
  'Wifi', 'Air conditioning', 'Parking', 'Security', 'Elevator', 'Swimming pool', 'Gym', 'Garden', 'Balcony', 'Fully furnished', 'Pet friendly'
];

export default function AddRentalPropertyPage() {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showContact, setShowContact] = useState<'public'|'hidden'|'system'>('public');

  return (
    
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Post Rental Property</Typography>
      <Grid container spacing={3}>
        {/* 1️⃣ Basic Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Basic Information</Typography>
          <TextField fullWidth label="Title" placeholder="2BR Apartment near center" sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Property Type</InputLabel>
            <Select label="Property Type" defaultValue="">
              {propertyTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField fullWidth label="Area (m²)" type="number" sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="Bedrooms" type="number" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Bathrooms" type="number" /></Grid>
          </Grid>
        </Grid>
        {/* 2️⃣ Address & Map */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Address</Typography>
          <TextField fullWidth label="Street" placeholder="e.g. Nguyen Hue" sx={{ mb: 2 }} />
          <TextField fullWidth label="Ward" placeholder="e.g. Ben Nghe" sx={{ mb: 2 }} />
          <TextField fullWidth label="District" placeholder="e.g. District 1" sx={{ mb: 2 }} />
          <TextField fullWidth label="City" placeholder="e.g. Ho Chi Minh City" sx={{ mb: 2 }} />
          <TextField fullWidth label="Building (optional)" placeholder="Building name if any" sx={{ mb: 2 }} />
        </Grid>
        {/* 3️⃣ Rental Price */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Rental Price</Typography>
          <TextField fullWidth label="Price" type="number" placeholder="VND" sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Unit</InputLabel>
            <Select label="Unit" defaultValue="month">
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Deposit (if any)" type="number" sx={{ mb: 2 }} />
        </Grid>
        {/* 4️⃣ Description & Amenities */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Description & Amenities</Typography>
          <TextField fullWidth label="Detailed Description" multiline minRows={3} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Amenities</InputLabel>
            <Select
              label="Amenities"
              multiple
              value={amenities}
              onChange={e => setAmenities(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(value => <Chip key={value} label={value} />)}
                </Box>
              )}
            >
              {amenitiesList.map(a => <MenuItem key={a} value={a}><Checkbox checked={amenities.indexOf(a) > -1} />{a}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        {/* 5️⃣ Images */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} mb={2}>Images</Typography>
          <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 2, textAlign: 'center', color: 'text.secondary', mb: 2 }}>
            Drag & drop images here or select images (up to 10 images)
          </Box>
        </Grid>
        {/* 6️⃣ Contact & Owner */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600} mb={2}>Contact & Owner</Typography>
          <TextField fullWidth label="Owner Name" sx={{ mb: 2 }} />
          <TextField fullWidth label="Phone Number" sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" sx={{ mb: 2 }} />
        </Grid>
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="contained" color="primary" size="large">Post Rental Listing</Button>
      </Box>
    </Box>
  );
}
