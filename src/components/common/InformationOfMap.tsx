import { Box, Typography, TextField, Chip, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../../service/properties/getProperties.service';

type PriceStats = {
  avgPrice: number;
  lowest: Property;
  highest: Property;
  closestToAvg: Property;
};

type InformationOfMapProps = {
  position: [number, number];
  address: string;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  properties: Property[];
  loading: boolean;
  priceStats: PriceStats | null;
  readOnly?: boolean;
};

export default function InformationOfMap({
  position,
  address,
  radiusKm,
  onRadiusChange,
  properties,
  loading,
  priceStats,
  readOnly = false
}: InformationOfMapProps) {
  const navigate = useNavigate();

  if (readOnly) return null;

  return (
    <Box 
      sx={{ 
        mb: 1, 
        p: 1, 
        bgcolor: '#ffffff', 
        borderRadius: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        minHeight: 90,
        maxWidth: '980px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: { xs: '100%', md: '50%' } }}>
        <Typography 
          variant="body2" 
          fontWeight={600} 
          color="#333"
          sx={{
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3em',
            lineHeight: '2.5em',
          }}
        >
          {address || 'Select a location on the map'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
            <Typography variant="body2" fontWeight={600}>Radius:</Typography>
            <TextField
              size="small"
              type="number"
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value) || 2)}
              inputProps={{ min: 0.5, max: 10, step: 0.5 }}
              sx={{ width: 80 }}
            />
            <Typography variant="body2">km</Typography>
          </Box>
          <Chip 
            icon={<HomeIcon />}
            label={`${properties.length} found`}
            size="small"
            sx={{
              bgcolor: properties.length > 0 ? '#FF5A5F' : '#E0E0E0',
              color: properties.length > 0 ? 'white' : '#666',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: properties.length > 0 ? 'white' : '#666'
              }
            }}
          />
          {loading && <CircularProgress size={20} />}
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1.5,
        alignItems: 'flex-start',
        flexShrink: 0,
        mr: 3      }}>
        {priceStats && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip 
              label={`Avg Price: $${priceStats.avgPrice.toLocaleString()}/mo`}
              size="small"
              sx={{
                bgcolor: '#1F77B4',
                color: 'white',
                fontWeight: 600
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Lowest: $${priceStats.lowest.price.toLocaleString()}`}
                size="small"
                onClick={() => navigate(`/property/${priceStats.lowest._id}`)}
                sx={{
                  bgcolor: '#2CA02C',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#1976D2' }
                }}
              />
              <Chip 
                label={`Highest: $${priceStats.highest.price.toLocaleString()}`}
                size="small"
                onClick={() => navigate(`/property/${priceStats.highest._id}`)}
                sx={{
                  bgcolor: '#D62728',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#D32F2F' }
                }}
              />
              <Chip 
                label={`Closest to Avg: $${priceStats.closestToAvg.price.toLocaleString()}`}
                size="small"
                onClick={() => navigate(`/property/${priceStats.closestToAvg._id}`)}
                sx={{
                  bgcolor: '#FF9800',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F57C00' }
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
