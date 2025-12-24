import { useState, useMemo } from 'react';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/layout/Header';
import { getProperties } from '../service/properties/getProperties.service';
import PropertyCard from '../components/common/PropertyCard';
import SearchSection from '../components/common/SearchSection';
import { COLORS } from '../theme/theme';

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    priceRange: { min: 0, max: 100000000 }
  });

  const { data: allProperties = [], isLoading: loading } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const properties = useMemo(() => {
    let filtered = [...allProperties];

    if (filters.location.trim()) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.propertyType.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.propertyType.toLowerCase())
      );
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );

    return filtered;
  }, [allProperties, filters]);

  const handleSearch = (
    location: string, 
    propertyType: string, 
    priceRange: { min: number; max: number }
  ) => {
    setFilters({ location, propertyType, priceRange });
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 16 }, pb: 10, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontFamily: 'var(--font-serif)', fontWeight: 700, mb: 3, color: '#000', lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Find Your Perfect<br />Student Home
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, fontSize: '1.2rem', maxWidth: 600, mx: 'auto' }}>
                Safe, affordable, and convenient rentals near your campus.
            </Typography>
        </Box>

        {/* Search Component */}
        <SearchSection onSearch={handleSearch} />
      </Container>

       <Container maxWidth="xl" sx={{ pb: 12, px: { xs: 2, md: 4 } }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: COLORS.primary }} />
            </Box>
        ) : (
            <Grid container spacing={4} sx={{ width: '100%' }}>
            {properties.map((property) => (
                <Grid key={property._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PropertyCard property={property} />
                </Grid>
            ))}
            </Grid>
        )}
      </Container>
    </Box>
  );
}
