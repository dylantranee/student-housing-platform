import { Card, CardContent, Typography, Box, Chip, Button, Avatar } from '@mui/material';
import { School, AutoAwesome, NightsStay, VolumeUp } from '@mui/icons-material';
import type { RoommateProfile } from '../types/roommateProfile.types';

interface RoommateCardProps {
  profile: RoommateProfile;
  onViewDetails: (profileId: string) => void;
  variant?: 'default' | 'compact';
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (profileId: string) => void;
}

import { UPLOADS_BASE_URL } from '../config/apiConfig';

export const RoommateCard: React.FC<RoommateCardProps> = ({ 
  profile, 
  onViewDetails, 
  variant = 'default',
  selectable = false,
  selected = false,
  onToggleSelect
}) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const getCleanlinessLabel = (level?: number) => {
    const labels: Record<number, string> = {
      1: 'Laid back',
      2: 'Moderate tidy',
      3: 'Super neat'
    };
    return labels[level || 0] || 'Vibe centric';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Flexible';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (variant === 'compact') {
    return (
      <Card 
        elevation={0}
        onClick={(e) => {
          if (selectable && onToggleSelect) {
            e.stopPropagation();
            onToggleSelect(profile._id);
          } else {
            onViewDetails(profile._id);
          }
        }}
        sx={{ 
          cursor: 'pointer',
          p: 2,
          borderRadius: 5,
          border: '2px solid',
          borderColor: selected ? '#FF5A5F' : 'rgba(0,0,0,0.06)',
          bgcolor: selected ? '#FFF8F8' : '#ffffff',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            borderColor: '#FF5A5F',
            boxShadow: '0 8px 24px rgba(255, 90, 95, 0.08)',
            transform: 'translateX(4px)'
          }
        }}
      >
        {selected && (
          <Box sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            zIndex: 10,
            bgcolor: '#FF5A5F',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 6px rgba(255, 90, 95, 0.4)'
          }}>
            <AutoAwesome sx={{ fontSize: 14 }} />
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.profilePhoto ? (
                profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${UPLOADS_BASE_URL}/${profile.profilePhoto}`
              ) : undefined}
              sx={{ 
                width: 64, 
                height: 64, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '2px solid white'
              }}
            />
            {profile.matchScore != null && (
              <Box sx={{ 
                position: 'absolute', 
                top: -6, 
                right: -6, 
                zIndex: 3 
              }}>
                <Box sx={{ 
                  bgcolor: '#222', 
                  color: 'white', 
                  fontSize: '10px', 
                  fontWeight: 900, 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 10,
                  border: '1px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {profile.matchScore}%
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#222', lineHeight: 1.2 }}>
              {(profile.userId as any)?.name || 'Anonymous'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#717171', display: 'block', mb: 0.5 }}>
              {profile.university?.split(' - ')[0] || 'Unknown Uni'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#FF5A5F' }}>
                {(profile.budgetMax || 0) >= 1000000 ? `${((profile.budgetMax || 0) / 1000000).toFixed(1)}M` : formatCurrency(profile.budgetMax)} ₫
              </Typography>
              <Typography variant="caption" sx={{ color: '#B0B0B0', fontWeight: 600 }}>
                {formatDate(profile.moveInDate).split(' ')[0]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 6,
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: selected ? '0 24px 48px rgba(255, 90, 95, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
        transform: selected ? 'translateY(-12px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          boxShadow: '0 24px 48px rgba(255, 90, 95, 0.12)',
          transform: 'translateY(-12px)',
          borderColor: '#FF5A5F'
        },
        ...(selected && {
          borderColor: '#FF5A5F',
          borderWidth: '2px'
        })
      }}
    >
      {selected && (
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          zIndex: 10,
          bgcolor: '#FF5A5F',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(255, 90, 95, 0.4)',
          border: '2px solid white'
        }}>
          <AutoAwesome sx={{ fontSize: 16 }} />
        </Box>
      )}
      {/* Decorative Card Header */}
      <Box sx={{ 
        height: 100, 
        bgcolor: '#FFF8F8', 
        borderBottom: '1px solid rgba(255, 90, 95, 0.05)',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Avatar
          src={profile.profilePhoto ? (
            profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${UPLOADS_BASE_URL}/${profile.profilePhoto}`
          ) : undefined}
          sx={{ 
            width: 110, 
            height: 110, 
            border: '5px solid white', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            position: 'absolute',
            bottom: -55,
            zIndex: 2
          }}
        />
      </Box>

      {/* Match Score - Floating pill */}
      {profile.matchScore != null && (
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          left: 16, 
          zIndex: 3 
        }}>
          <Chip
            label={`${profile.matchScore}% Soul Match`}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.7rem',
              bgcolor: profile.matchScore >= 70 ? '#222' : '#717171',
              color: 'white',
              px: 1,
              height: 28,
              borderRadius: '50px',
              border: '2px solid rgba(255,255,255,0.8)'
            }}
          />
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1, pt: 8, pb: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#222', mb: 1, fontSize: '1.4rem' }}>
          {(profile.userId as any)?.name || 'Anonymous'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
          <School sx={{ fontSize: 14, color: '#717171' }} />
          <Typography variant="caption" sx={{ color: '#717171', fontWeight: 600, letterSpacing: 0.5 }}>
            {profile.university?.split(' - ')[0] || 'Unknown Uni'}
          </Typography>
        </Box>
        
        {profile.bio && (
          <Typography variant="body2" sx={{ 
            mb: 3, 
            color: '#484848', 
            fontSize: '0.9rem', 
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '4.5em'
          }}>
            {profile.bio}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>BUDGET</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#222' }}>
                {(profile.budgetMax || 0) >= 1000000 ? `${((profile.budgetMax || 0) / 1000000).toFixed(1)}M` : formatCurrency(profile.budgetMax)} ₫
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: '#B0B0B0', textTransform: 'uppercase', letterSpacing: 1, mb: 0.5 }}>MOVE-IN</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#222' }}>{formatDate(profile.moveInDate).split(' ')[0]}</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {profile.cleanliness && (
            <Chip 
                icon={<AutoAwesome sx={{ fontSize: '12px !important' }} />}
                label={getCleanlinessLabel(profile.cleanliness)} 
                size="small" 
                sx={{ bgcolor: '#F7F7F7', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, px: 0.5, color: '#484848' }} 
            />
          )}
          {profile.sleepSchedule && (
            <Chip 
                icon={<NightsStay sx={{ fontSize: '12px !important' }} />}
                label={profile.sleepSchedule} 
                size="small" 
                sx={{ bgcolor: '#F7F7F7', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, px: 0.5, color: '#484848' }} 
            />
          )}
          {profile.noiseTolerance && (
            <Chip 
                icon={<VolumeUp sx={{ fontSize: '12px !important' }} />}
                label={profile.noiseTolerance === 'Quiet' ? 'Peaceful' : profile.noiseTolerance} 
                size="small" 
                sx={{ bgcolor: '#F7F7F7', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, px: 0.5, color: '#484848' }} 
            />
          )}
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => onViewDetails(profile._id)}
          sx={{ 
            bgcolor: '#222', 
            borderRadius: 50, 
            py: 1.5, 
            fontWeight: 800, 
            textTransform: 'none',
            boxShadow: 'none',
            letterSpacing: 0.5,
            fontSize: '0.9rem',
            '&:hover': { bgcolor: '#000', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }
          }}
        >
          View Profile
        </Button>
      </Box>
    </Card>
  );
};
