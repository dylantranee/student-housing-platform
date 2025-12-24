import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RoommateCard } from '../components/RoommateCard';
import { RoommateDetailModal } from '../components/RoommateDetailModal';
import { browseRoommates } from '../service/browseRoommates.service';
import type { RoommateProfile } from '../types/roommateProfile.types';
import Header from '../components/layout/Header';
import { COLORS } from '../theme/theme';

export const BrowseRoommatesPage = () => {
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  const { data: profiles = [], isLoading, error: queryError } = useQuery({
    queryKey: ['roommates'],
    queryFn: browseRoommates,
  });

  const errorMessage = queryError instanceof Error ? queryError.message : 
                 (queryError as any)?.response?.data?.message || 
                 'Failed to load roommate profiles. Please try again.';
  
  const requiresProfile = errorMessage.includes('create your roommate profile');

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#222' }}>
                Hand-picked for you
              </Typography>
              <Box sx={{ height: 2, width: 40, bgcolor: COLORS.primary }} />
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
      />
      </Container>
    </Box>
  );
};
