import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Snackbar, Alert, Container, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { PersonOutline as PersonOutlineIcon, Home as HomeIcon, AddHome as AddHomeIcon, CompareArrows as CompareIcon, Close as CloseIcon, CompareArrows as CompareArrowsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [requireAuthOpen, setRequireAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check token in cookie
  const tokenMatch = document.cookie.match(/access_token=([^;]+)/);
  const isAuthenticated = !!tokenMatch;

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setLogoutOpen(true);
    setTimeout(() => {
        setLogoutOpen(false);
        navigate('/');
    }, 1200);
  };

  const handleAddProperty = () => {
    if (isAuthenticated) {
        navigate('/add-rental-property');
    } else {
        setRequireAuthOpen(true);
        setTimeout(() => setRequireAuthOpen(false), 1500);
    }
  };

  return (
    <>
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee', color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
            
            {/* Left: Search/Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    onClick={() => setMenuOpen(true)}
                    disableRipple
                    sx={{
                        color: '#222',
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        p: 0,
                        bg: 'transparent',
                        gap: 1.5,
                        minWidth: 'auto',
                        '&:hover': { bgcolor: 'transparent' },
                        '&:hover .icon-box': { border: '1px solid #222', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                    }}
                >
                    <Box 
                        className="icon-box"
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            width: 44, 
                            height: 44,
                            border: '1px solid #ddd',
                            borderRadius: '50%',
                            bgcolor: 'white',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                         }}
                    >
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', width: 14 }}>
                            <svg viewBox="0 0 18 14" fill="currentColor" width="100%" height="100%">
                                <path d="M17,8H1c-.55225,0-1-.44775-1-1s.44775-1,1-1h16c.55225,0,1,.44775,1,1s-.44775,1-1,1Z" />
                                <path d="M17,14H1c-.55225,0-1-.44775-1-1s.44775-1,1-1h16c.55225,0,1,.44775,1,1s-.44775,1-1,1Z" />
                                <path d="M17,2H1c-.55225,0-1-.44775-1-1S.44775,0,1,0h16c.55225,0,1,.44775,1,1s-.44775,1-1,1Z" />
                            </svg>
                        </Box>
                    </Box>
                </Button>
            </Box>

            {/* Center: Brand Logo */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)' 
                }}
                onClick={() => navigate('/')}
            >
                {/* Logo Icon */}
                <Box component="span" sx={{ color: '#FF5A5F', mr: 1, fontSize: 32, lineHeight: 0 }}>
                    ✻
                </Box>
                <Typography variant="h5" sx={{ fontFamily: 'var(--font-serif)', fontWeight: 700, letterSpacing: '-0.5px', color: '#FF5A5F' }}>
                    HouPlatform
                </Typography>
            </Box>

            {/* Right: Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                
                {!isAuthenticated ? (
                    <>
                        <Button 
                            startIcon={<PersonOutlineIcon />}
                            sx={{ color: '#222', textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 50, '&:hover': { bgcolor: '#f7f7f7' } }}
                            onClick={() => navigate('/login')}
                        >
                            Log in
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            sx={{ color: '#222', textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 50, '&:hover': { bgcolor: '#f7f7f7' } }}
                            onClick={() => navigate('/requests')}
                        >
                            Requests
                        </Button>
                        {/* <Button 
                            startIcon={<PersonOutlineIcon />}
                            sx={{ color: '#222', textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 50, '&:hover': { bgcolor: '#f7f7f7' } }}
                            onClick={() => navigate('/profile')}
                        >
                            Profile
                        </Button> */}
                        <Button 
                            sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 50, '&:hover': { bgcolor: '#f7f7f7' } }}
                            onClick={handleLogout}
                        >
                            Log out
                        </Button>
                    </>
                )}

                <Button 
                    variant="contained" 
                    sx={{ 
                        bgcolor: '#222', 
                        color: 'white', 
                        borderRadius: 50, 
                        px: 3, 
                        py: 1,
                        ml: 1,
                        textTransform: 'none', 
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#000', boxShadow: 'none' }
                    }}
                    onClick={handleAddProperty}
                >
                    List your house
                </Button>
            </Box>
        </Toolbar>
      </Container>
    </AppBar>

    {/* Burger Menu Drawer */}
    <Drawer
      anchor="left"
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 320,
          bgcolor: '#FCFCFC'
        }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF5A5F' }}>
          Menu
        </Typography>
        <Button
          onClick={() => setMenuOpen(false)}
          sx={{
            minWidth: 'auto',
            p: 1,
            borderRadius: '50%',
            color: '#666',
            '&:hover': { bgcolor: '#E0E0E0' }
          }}
        >
          <CloseIcon />
        </Button>
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/');
              setMenuOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': { bgcolor: '#FFECF1' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon sx={{ color: '#FF5A5F' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleAddProperty();
              setMenuOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': { bgcolor: '#FFECF1' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AddHomeIcon sx={{ color: '#FF5A5F' }} />
            </ListItemIcon>
            <ListItemText 
              primary="List your house" 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate('/compare-prices');
              setMenuOpen(false);
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': { bgcolor: '#FFECF1' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CompareIcon sx={{ color: '#FF5A5F' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Compare Prices" 
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <>
            <Divider sx={{ my: 2 }} />
            
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/requests');
                  setMenuOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { bgcolor: '#FFECF1' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CompareArrowsIcon sx={{ color: '#FF5A5F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Requests" 
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { bgcolor: '#FFECF1' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonOutlineIcon sx={{ color: '#FF5A5F' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      {!isAuthenticated && (
        <Box sx={{ p: 3, mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonOutlineIcon />}
            onClick={() => {
              navigate('/login');
              setMenuOpen(false);
            }}
            sx={{
              bgcolor: '#FF5A5F',
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#FF385C',
                boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)'
              }
            }}
          >
            Log in
          </Button>
        </Box>
      )}

      {isAuthenticated && (
        <Box sx={{ p: 3, mt: 'auto' }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            sx={{
              borderColor: '#FF5A5F',
              color: '#FF5A5F',
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#FF385C',
                bgcolor: '#FFECF1'
              }
            }}
          >
            Log out
          </Button>
        </Box>
      )}
    </Drawer>

    <Snackbar open={logoutOpen} autoHideDuration={1500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert 
          severity="success" 
          variant="filled" 
          sx={{ 
            width: '100%',
            bgcolor: '#96FFC0',
            color: '#222',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#222'
            }
          }}
        >
          Log out successfully!
        </Alert>
    </Snackbar>
    <Snackbar open={requireAuthOpen} autoHideDuration={1500} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert 
          severity="warning" 
          variant="filled" 
          sx={{ 
            width: '100%',
            bgcolor: '#ED5466',
            color: '#ffffff',
            fontWeight: 600,
            '& .MuiAlert-icon': {
              color: '#ffffff'
            }
          }}
        >
          You must sign up/sign in to add rental property.
        </Alert>
    </Snackbar>
    </>
  );
}
