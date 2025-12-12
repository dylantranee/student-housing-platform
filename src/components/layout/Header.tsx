import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Snackbar, Alert, Container } from '@mui/material';
import { PersonOutline as PersonOutlineIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [requireAuthOpen, setRequireAuthOpen] = useState(false);

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
                    Search houses
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
                            startIcon={<PersonOutlineIcon />}
                            sx={{ color: '#222', textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 50, '&:hover': { bgcolor: '#f7f7f7' } }}
                            onClick={() => navigate('/profile')}
                        >
                            Profile
                        </Button>
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
    </>
  );
}
