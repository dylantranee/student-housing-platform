import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, Button, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { Search as SearchIcon, Bed as BedIcon, KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('');
  const [price, setPrice] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [requireAuthOpen, setRequireAuthOpen] = useState(false);
  const navigate = useNavigate();
  // Check token in cookie
  const tokenMatch = document.cookie.match(/access_token=([^;]+)/);
  const isAuthenticated = !!tokenMatch;
  // Fake user info (có thể lấy từ localStorage hoặc backend nếu cần)
  const user = null;

  return (
    <Box>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1, fontSize: { xs: 28, md: 36 } }}>
                  HouPlatform
                </Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
                ml: 2,
                '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(46, 125, 50, 0.07)' },
              }}
              onClick={() => navigate('/compare-prices')}
            >
              Compare Prices
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                ml: 2,
                boxShadow: 'none',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/add-rental-property');
                } else {
                  setRequireAuthOpen(true);
                  setTimeout(() => {
                    setRequireAuthOpen(false);
                  }, 1500);
                }
              }}
            >
              Add Rental Property
            </Button>
            {/* Welcome message when signed in */}
            {isAuthenticated && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  {/* ...existing code... */}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  sx={{
                    color: 'black',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  component={Link}
                  to="/register"
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(46, 125, 50, 0.1)' },
                  }}
                  component={Link}
                  to="/login"
                >
                  Sign In
                </Button>
              </>
            ) : (
              <>
                <Button
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  component={Link}
                  to="/profile"
                >
                  Profile
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(46, 125, 50, 0.1)' },
                  }}
                  onClick={() => {
                    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    setLogoutOpen(true);
                    setTimeout(() => {
                      setLogoutOpen(false);
                      navigate('/');
                    }, 1200);
                  }}
                >
                  Log Out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>

        {/* Search Bar */}
        <Box sx={{ backgroundColor: '#f5f5f5', py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 1400,
              mx: 'auto',
              px: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <InputBase
                placeholder="Enter an address, street, ID..."
                startAdornment={<SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{
                  backgroundColor: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  width: '100%',
                }}
              />
            </Box>

            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: 'white',
                minWidth: 140,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="building">Building</MenuItem>
              <MenuItem value="serviced">Serviced Apartment</MenuItem>
              <MenuItem value="studio">Studio</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="office">Office</MenuItem>
              <MenuItem value="penthouse">Penthouse</MenuItem>
            </Select>

            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: 'white',
                minWidth: 160,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="">All Locations</MenuItem>
              <MenuItem value="district1">DISTRICT 1</MenuItem>
              <MenuItem value="district2">DISTRICT 2 – THAO DIEN</MenuItem>
              <MenuItem value="district3">DISTRICT 3</MenuItem>
              <MenuItem value="district4">DISTRICT 4</MenuItem>
              <MenuItem value="binhthanh">BINH THANH</MenuItem>
              <MenuItem value="phunhuan">PHU NHUAN</MenuItem>
              <MenuItem value="tanbinh">TAN BINH</MenuItem>
              <MenuItem value="district7">DISTRICT 7 – Phu My Hung</MenuItem>
              <MenuItem value="district8">DISTRICT 8</MenuItem>
              <MenuItem value="district10">DISTRICT 10</MenuItem>
              <MenuItem value="district11">DISTRICT 11</MenuItem>
              <MenuItem value="tanphu">TAN PHU</MenuItem>
              <MenuItem value="govap">GO VAP</MenuItem>
              <MenuItem value="binhtan">BINH TAN</MenuItem>
            </Select>

            <Select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              displayEmpty
              startAdornment={<BedIcon sx={{ mr: 0.5, fontSize: 20, color: 'text.secondary' }} />}
              sx={{
                backgroundColor: 'white',
                minWidth: 120,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="">Beds</MenuItem>
              <MenuItem value="1">1 Bed</MenuItem>
              <MenuItem value="2">2 Beds</MenuItem>
              <MenuItem value="3">3 Beds</MenuItem>
              <MenuItem value="4">4 Beds</MenuItem>
              <MenuItem value="5">5+ Beds</MenuItem>
            </Select>

            <Select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: 'white',
                minWidth: 140,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              <MenuItem value="">Price</MenuItem>
              <MenuItem value="0-5">Under 5M</MenuItem>
              <MenuItem value="5-10">5M - 10M</MenuItem>
              <MenuItem value="10-15">10M - 15M</MenuItem>
              <MenuItem value="15-20">15M - 20M</MenuItem>
              <MenuItem value="20-30">20M - 30M</MenuItem>
              <MenuItem value="30-50">30M - 50M</MenuItem>
              <MenuItem value="50+">Above 50M</MenuItem>
            </Select>

            <Button
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                mr: 2,
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </AppBar>
      <Snackbar open={logoutOpen} autoHideDuration={1500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Log out successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={requireAuthOpen} autoHideDuration={1500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
          You must sign up/sign in to add rental property.
        </Alert>
      </Snackbar>
    </Box>
  );
}
