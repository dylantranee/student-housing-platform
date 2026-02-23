import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { COLORS } from '../../theme/theme';

interface SearchSectionProps {
  onSearch: (location: string, propertyType: string, priceRange: { min: number; max: number }) => void;
}

export default function SearchSection({ onSearch }: SearchSectionProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPropertyType, setSearchPropertyType] = useState('');
  const [searchPriceRange, setSearchPriceRange] = useState<{ min: number; max: number }>({ 
    min: 0, 
    max: Infinity 
  });

  const handleSearch = () => {
    onSearch(searchLocation, searchPropertyType, searchPriceRange);
  };

  return (
    <>
      {/* Search Bar */}
      <Box 
        sx={{ 
          display: 'inline-flex', 
          bgcolor: 'white', 
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)', 
          borderRadius: 50, 
          p: 1, 
          alignItems: 'center',
          border: '1px solid #e0e0e0',
          maxWidth: '100%',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}
      >
        <Box 
          component="input"
          placeholder="Enter location..."
          value={searchLocation}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchLocation(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRight: { sm: '1px solid #eee' }, 
            cursor: 'text', 
            textAlign: 'left',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            minWidth: '180px',
            '&::placeholder': { color: '#999' }
          }}
        />
        <Box 
          component="input"
          placeholder="Property type..."
          value={searchPropertyType}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchPropertyType(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRight: { sm: '1px solid #eee' }, 
            cursor: 'text', 
            textAlign: 'left',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            minWidth: '180px',
            '&::placeholder': { color: '#999' }
          }}
        />
        <Box 
          component="input"
          type="number"
          placeholder="Max price..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value ? parseInt(e.target.value) : Infinity;
            setSearchPriceRange(prev => ({ ...prev, max: val }));
          }}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
          sx={{ 
            px: 4, 
            py: 1.5, 
            cursor: 'text', 
            mr: 2, 
            textAlign: 'left',
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.875rem',
            minWidth: '150px',
            '&::placeholder': { color: '#999' }
          }}
        />
        <Button 
          variant="contained"
          onClick={handleSearch}
          sx={{ 
            bgcolor: COLORS.primary, 
            borderRadius: 50, 
            px: 4, 
            py: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': { bgcolor: COLORS.primaryHover, boxShadow: 'none' }
          }}
        >
          Search
        </Button>
      </Box>
    </>
  );
}
