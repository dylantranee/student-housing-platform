import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Grid,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { Close, School, People } from '@mui/icons-material';
import { IconButton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { RoommateProfile } from '../types/roommateProfile.types';
import { SendRequestModal } from './SendRequestModal';

interface RoommateDetailModalProps {
  profile: RoommateProfile | null;
  open: boolean;
  onClose: () => void;
  contextPropertyUrl?: string;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

import { UPLOADS_BASE_URL } from '../config/apiConfig';

export const RoommateDetailModal: React.FC<RoommateDetailModalProps> = ({
  profile,
  open,
  onClose,
  contextPropertyUrl,
  isSelected = false,
  onToggleSelect,
}) => {
  const navigate = useNavigate();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    setRequestSent(false);
  }, [profile?._id]);

  if (!profile) return null;

  const getCleanlinessLabel = (level?: number) => {
    const labels: Record<number, string> = {
      1: 'Laid back',
      2: 'Moderate tidy',
      3: 'Super neat'
    };
    return labels[level || 0] || 'Vibe centric';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'Flexible';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 6, overflow: 'hidden' }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'white' }
          }} 
          size="small"
        >
          <Close />
        </IconButton>

        {/* Banner Section */}
        <Box sx={{ height: 140, bgcolor: '#FFF8F8', borderBottom: '1px solid rgba(255,90,95,0.05)' }} />
        
        {/* Profile Info Overlay */}
        <Box sx={{ px: 4, mt: -8, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            src={profile.profilePhoto ? (
              profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${UPLOADS_BASE_URL}/${profile.profilePhoto}`
            ) : undefined}
            sx={{ 
              width: 140, 
              height: 140, 
              border: '6px solid white', 
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              mb: 2
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'var(--font-serif)', color: '#222', mb: 1 }}>
            {(profile.userId as any)?.name || 'Anonymous'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <School sx={{ fontSize: 18, color: '#717171' }} />
            <Typography variant="body1" sx={{ color: '#717171', fontWeight: 600 }}>{profile.university}</Typography>
          </Box>
          {profile.studyProgram && (
            <Typography variant="body2" sx={{ color: '#B0B0B0', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {profile.studyProgram}
            </Typography>
          )}
        </Box>
      </Box>

      <DialogContent sx={{ px: { xs: 3, md: 6 }, pb: 4 }}>
        {/* Quick Insights Row */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 8 }, mb: 5, p: 3, bgcolor: '#F9F9F9', borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#B0B0B0', letterSpacing: 1.2, mb: 1, display: 'block' }}>BUDGET</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
                {(profile.budgetMax || 0) >= 1000000 ? `${((profile.budgetMax || 0) / 1000000).toFixed(1)}M ₫` : formatCurrency(profile.budgetMax)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#B0B0B0', letterSpacing: 1.2, mb: 1, display: 'block' }}>AVAILABILITY</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>{formatDate(profile.moveInDate).split(',')[0]}</Typography>
          </Box>
          {profile.matchScore != null && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#B0B0B0', letterSpacing: 1.2, mb: 1, display: 'block' }}>MATCH</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF5A5F' }}>{profile.matchScore}%</Typography>
            </Box>
          )}
        </Box>

        {requestSent && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: 4, fontWeight: 700 }}>
            Your connection request has been sent to {(profile.userId as any)?.name}!
          </Alert>
        )}

        {/* Match Compatibility Breakdown */}
        {profile.matchBreakdown && (
          <Box sx={{ mb: 6, p: 3, bgcolor: '#FDFDFD', borderRadius: 4, border: '1px solid #F0F0F0' }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#222', lineHeight: 1.2 }}>
                Compatibility Breakdown
              </Typography>
              <Typography variant="caption" sx={{ color: '#717171', fontWeight: 600 }}>
                Analysis of your shared vibe and preferences
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {[
                { label: 'Lifestyle', value: profile.matchBreakdown.lifestyle, max: 30, desc: 'University, Smoking, and Noise preferences.' },
                { label: 'Budget', value: profile.matchBreakdown.budget, max: 20, desc: 'Overlap in your monthly rental price ranges.' },
                { label: 'Schedule', value: profile.matchBreakdown.schedule, max: 20, desc: 'Alignment of your sleep schedules and move-in dates.' },
                { label: 'Social', value: profile.matchBreakdown.social, max: 15, desc: 'How you both like to interact and spend social energy.' },
                { label: 'Cleanliness', value: profile.matchBreakdown.cleanliness, max: 15, desc: 'Expectations for shared space maintenance.' },
              ].map((category) => {
                const percentage = (category.value / category.max) * 100;
                let color = '#FF5252'; 
                if (percentage >= 75) color = '#4CAF50'; 
                else if (percentage >= 40) color = '#FFC107'; 

                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={category.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, gap: 2 }}>
                      <Tooltip title={category.desc} arrow placement="top">
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#222', cursor: 'help' }}>
                          {category.label}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: color, flexShrink: 0 }}>
                        {Math.round(category.value)} / {category.max}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: '#EAEAEA',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: color,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* About Section */}
        {profile.bio && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#222', letterSpacing: -0.5 }}>
              The Vibe
            </Typography>
            <Typography variant="body1" sx={{ color: '#484848', lineHeight: 1.8, fontSize: '1.05rem' }}>
              {profile.bio}
            </Typography>
          </Box>
        )}

        <Grid container spacing={6}>
          {/* Left Column: Lifestyle */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb : 3, color: '#222' }}>
              Lifestyle
            </Typography>
            <Stack spacing={2.5}>
              {[
                { label: 'Sleep Habits', value: profile.sleepSchedule },
                { label: 'Cleanliness', value: getCleanlinessLabel(profile.cleanliness) },
                { label: 'Social Battery', value: profile.socialPreference },
                { label: 'Work/Study', value: profile.studyHabits },
                { label: 'Noise Tolerance', value: profile.noiseTolerance === 'Quiet' ? 'Peaceful' : profile.noiseTolerance },
                { label: 'Smoking', value: profile.smoking }
              ].map((item, idx) => item.value ? (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#717171' }}>{item.label}</Typography>
                  <Chip 
                    label={item.value} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#F7F7F7', 
                      fontWeight: 700, 
                      color: '#222',
                      borderRadius: 2,
                      px: 0.5
                    }} 
                  />
                </Box>
              ) : null)}
            </Stack>
          </Grid>

          {/* Right Column: Preferences */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>
              What they're looking for
            </Typography>
            <Stack spacing={2.5}>
              {[
                { label: 'Room Type', value: profile.roomType },
                { label: 'Roommates Wanted', value: profile.roommatesWanted ? `${profile.roommatesWanted} people` : null },
                { label: 'Lease Commitment', value: profile.leaseLength }
              ].map((item, idx) => item.value ? (
                <Box key={idx}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#717171', mb: 1 }}>{item.label}</Typography>
                  <Chip 
                    label={item.value} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#FFF5F5', 
                      color: '#FF5A5F',
                      fontWeight: 700, 
                      borderRadius: 2,
                      px: 0.5
                    }} 
                  />
                </Box>
              ) : null)}
              
              {profile.preferredUniversities && profile.preferredUniversities.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#717171', mb: 1 }}>Preferred Universities</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.preferredUniversities.map(uni => (
                      <Chip 
                        key={uni} 
                        label={uni.split(' - ')[0]} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 2 }} 
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 4, borderTop: '1px solid #f0f0f0', justifyContent: 'center', gap: 2 }}>
        <Button onClick={onClose} sx={{ color: '#717171', fontWeight: 700, px: 3 }}>Close</Button>
        
        {onToggleSelect ? (
          <Button 
              variant="contained" 
              onClick={() => {
                onToggleSelect();
                onClose();
              }}
              startIcon={<People />}
              sx={{ 
                  bgcolor: isSelected ? '#717171 !important' : '#FF5A5F !important', 
                  color: 'white !important', 
                  borderRadius: 50, 
                  px: 6, 
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: isSelected ? '#484848 !important' : '#E14850 !important' }
              }}
          >
            {isSelected ? 'Remove from Inquiry' : 'Add to Inquiry'}
          </Button>
        ) : (
          <>
            {(requestSent || profile.connectionStatus === 'pending') ? (
              <Button 
                  variant="contained" 
                  disabled
                  sx={{ 
                      bgcolor: '#f5f5f5 !important', 
                      color: '#999 !important', 
                      borderRadius: 50, 
                      px: 6, 
                      py: 1.5,
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: 'none'
                  }}
              >
                Request Sent
              </Button>
            ) : profile.connectionStatus === 'accepted' ? (
              <Button 
                  variant="contained"
                  onClick={() => navigate('/requests?tab=2')}
                  sx={{ 
                      bgcolor: '#4CAF50 !important', 
                      color: 'white !important',
                      borderRadius: 50, 
                      px: 6, 
                      py: 1.5, 
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#45a049 !important' }
                  }}
              >
                Message
              </Button>
            ) : (
              <Button 
                  variant="contained" 
                  onClick={() => setSendModalOpen(true)}
                  sx={{ 
                      bgcolor: '#FF5A5F !important', 
                      color: 'white !important', 
                      borderRadius: 50, 
                      px: 6, 
                      py: 1.5,
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#E14850 !important' }
                  }}
              >
                Say Hello
              </Button>
            )}
          </>
        )}
      </DialogActions>

      <SendRequestModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        receiverId={(profile.userId as any)?._id || (profile.userId as any)?.id}
        receiverName={(profile.userId as any)?.name || 'Anonymous'}
        receiverPhoto={profile.profilePhoto}
        onSuccess={() => setRequestSent(true)}
        contextPropertyUrl={contextPropertyUrl}
      />
    </Dialog>
  );
};
