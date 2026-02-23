import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RoommateCard } from '../components/RoommateCard';
import { RoommateDetailModal } from '../components/RoommateDetailModal';
import { browseRoommates } from '../service/browseRoommates.service';
import type { RoommateProfile } from '../types/roommateProfile.types';
import Header from '../components/layout/Header';
import { COLORS } from '../theme/theme';
import SchoolIcon from '@mui/icons-material/School';
import NightlifeIcon from '@mui/icons-material/Nightlife';
import BalanceIcon from '@mui/icons-material/Balance';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const BrowseRoommatesPage = () => {
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [strategy, setStrategy] = useState('balanced');
  const [selectedRoommateIds, setSelectedRoommateIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const fromProperty = searchParams.get('fromProperty');
  const propertyTitle = searchParams.get('propertyTitle');

  const { data, isLoading, error: queryError } = useQuery({
    queryKey: ['roommates', strategy],
    queryFn: ({ queryKey }) => browseRoommates(queryKey[1] as string),
  });

  useEffect(() => {
    const saved = localStorage.getItem('last_selected_roommate_ids');
    if (saved) {
      try {
        setSelectedRoommateIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved roommate selections', e);
      }
    }
  }, []);

  const profiles = data?.profiles || [];
  const requiresProfile = data?.requiresProfile || false;
  const serverMessage = data?.message;

  const errorMessage = queryError instanceof Error ? queryError.message : 
                 (queryError as any)?.response?.data?.message || 
                 serverMessage ||
                 'Failed to load roommate profiles. Please try again.';
  
  const handleStrategyChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStrategy: string | null,
  ) => {
    if (newStrategy !== null && typeof newStrategy === 'string') {
      setStrategy(newStrategy);
    }
  };

  const filteredProfiles = profiles
    .filter(p => (p.matchScore || 0) >= 40)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const handleViewDetails = (profileId: string) => {
    const profile = profiles.find(p => p._id === profileId);
    if (profile) {
      setSelectedProfile(profile);
      setShowDetailModal(true);
    }
  };

  const toggleRoommateSelection = (profile: RoommateProfile) => {
    const userId = typeof profile.userId === 'object' ? (profile.userId as any)._id : profile.userId;
    if (!userId) return;

    setSelectedRoommateIds(prev => {
        const next = prev.includes(userId) 
            ? prev.filter(id => id !== userId) 
            : [...prev, userId];
        localStorage.setItem('last_selected_roommate_ids', JSON.stringify(next));
        return next;
    });
  };

  const handleCreateProfile = () => {
    navigate('/profile?tab=roommate');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      
      {/* Decorative Hero Section */}
      <Box sx={{ 
        pt: { xs: 8, md: 14 }, 
        pb: { xs: 8, md: 12 }, 
        background: 'linear-gradient(to bottom, #FFF8F8 0%, #FFFFFF 100%)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 90, 95, 0.05)'
      }}>
        <Container maxWidth="md">
          {fromProperty && (
            <Button
              startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
              onClick={() => navigate(`/property/${fromProperty}`)}
              sx={{
                mb: 3,
                textTransform: 'none',
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: '0.9rem',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
            >
              Back to {propertyTitle || 'Property'}
            </Button>
          )}
          <Typography 
            variant="h2" 
            sx={{ 
                fontFamily: 'var(--font-serif)', 
                fontWeight: 700, 
                mb: 2, 
                color: '#222',
                fontSize: { xs: '2.8rem', md: '4.2rem' },
                lineHeight: 1.1,
                letterSpacing: '-1.8px'
            }}
          >
            Discover Your<br />Community
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
                fontWeight: 400, 
                fontSize: '1.25rem', 
                color: '#717171',
                maxWidth: 600, 
                mx: 'auto',
                mb: 6,
                lineHeight: 1.6
            }}
          >
            Meet the most compatible souls in the HouPlatform community. Hand-picked based on your unique vibe, lifestyle, and spirit.
          </Typography>
          
          <Button 
            variant="contained" 
            onClick={handleCreateProfile}
            sx={{ 
                bgcolor: COLORS.primary,
                borderRadius: 50,
                px: 5,
                py: 2,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(255, 90, 95, 0.25)',
                '&:hover': { bgcolor: COLORS.primaryHover, boxShadow: '0 12px 32px rgba(255, 90, 95, 0.35)' }
            }}
          >
            Refine My Vibe
          </Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 10, px: { xs: 2, md: 6 } }}>

        {/* Results Metadata Section */}
        {!isLoading && filteredProfiles.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            mb: 6,
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#222' }}>
                Hand-picked for you
              </Typography>
              <Box sx={{ height: 2, width: 40, bgcolor: COLORS.primary }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#222', mr: 1 }}>
                Match by:
              </Typography>
              <ToggleButtonGroup
                value={strategy}
                exclusive
                onChange={handleStrategyChange}
                size="small"
                sx={{
                  bgcolor: '#f8f9fa',
                  p: 0.5,
                  borderRadius: 3,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#717171',
                    gap: 1,
                    '&.Mui-selected': {
                      bgcolor: '#fff',
                      color: COLORS.primary,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      '&:hover': {
                        bgcolor: '#fff',
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="balanced">
                  <Tooltip title="Equal weight to all factors">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BalanceIcon sx={{ fontSize: 18 }} />
                      Balanced
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="university">
                  <Tooltip title="Prioritize same school background">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 18 }} />
                      University
                    </Box>
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="lifestyle">
                  <Tooltip title="Prioritize habits and daily vibe">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NightlifeIcon sx={{ fontSize: 18 }} />
                      Lifestyle
                    </Box>
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Typography variant="body2" sx={{ color: '#717171', fontStyle: 'italic' }}>
              Showing only students with &gt;40% vibe compatibility.
            </Typography>
          </Box>
        )}

      {/* Error State */}
      {queryError && (
        <Alert 
          severity={requiresProfile ? "info" : "error"} 
          sx={{ mb: 3 }}
          action={
            requiresProfile ? (
              <Button color="inherit" size="small" onClick={handleCreateProfile}>
                Create Profile
              </Button>
            ) : undefined
          }
        >
          {errorMessage}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : profiles.length === 0 && !requiresProfile ? (
        /* Empty State */
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No roommate matches found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            To see matches, ensure you have set up your own roommate profile with your preferences.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleCreateProfile}
            sx={{ 
                bgcolor: COLORS.primary,
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: COLORS.primaryHover }
            }}
          >
            Set Your Preferences
          </Button>
        </Box>
      ) : (
        /* Results Grid */
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            Found {filteredProfiles.length} compatible roommate{filteredProfiles.length !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3 
          }}>
            {filteredProfiles.map((profile) => (
              <Box key={profile._id}>
                <RoommateCard
                  profile={profile}
                  onViewDetails={handleViewDetails}
                  selected={selectedRoommateIds.includes(typeof profile.userId === 'object' ? (profile.userId as any)._id : profile.userId)}
                  onToggleSelect={() => toggleRoommateSelection(profile)}
                />
              </Box>
            ))}
          </Box>
        </>
      )}

      <RoommateDetailModal
        profile={selectedProfile}
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isSelected={selectedProfile ? selectedRoommateIds.includes(typeof selectedProfile.userId === 'object' ? (selectedProfile.userId as any)._id : selectedProfile.userId) : false}
        onToggleSelect={selectedProfile ? (() => toggleRoommateSelection(selectedProfile)) : undefined}
      />
      </Container>
    </Box>
  );
};
