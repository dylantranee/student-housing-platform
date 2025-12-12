import { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography, CircularProgress } from '@mui/material';
import Header from '../components/layout/Header';
import { getProperties } from '../service/properties/getProperties.service';
import type { Property } from '../service/properties/getProperties.service';
import PropertyCard from '../components/common/PropertyCard';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

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
            <Box sx={{ px: 4, py: 1.5, borderRight: { sm: '1px solid #eee' }, cursor: 'pointer', textAlign: 'left' }}>
                <Typography variant="caption" display="block" fontWeight={700} sx={{ letterSpacing: 0.5, color: '#000' }}>LOCATION</Typography>
                <Typography variant="body2" color="text.secondary">Select district</Typography>
            </Box>
            <Box sx={{ px: 4, py: 1.5, borderRight: { sm: '1px solid #eee' }, cursor: 'pointer', textAlign: 'left' }}>
                <Typography variant="caption" display="block" fontWeight={700} sx={{ letterSpacing: 0.5, color: '#000' }}>PROPERTY TYPE</Typography>
                <Typography variant="body2" color="text.secondary">Apartment, Studio...</Typography>
            </Box>
             <Box sx={{ px: 4, py: 1.5, cursor: 'pointer', mr: 2, textAlign: 'left' }}>
                <Typography variant="caption" display="block" fontWeight={700} sx={{ letterSpacing: 0.5, color: '#000' }}>PRICE RANGE</Typography>
                <Typography variant="body2" color="text.secondary">Set budget</Typography>
            </Box>
            <Button 
                variant="contained" 
                sx={{ 
                    bgcolor: '#FF5A5F', 
                    borderRadius: 50, 
                    px: 4, 
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#FF385C', boxShadow: 'none' }
                }}
            >
                Search
            </Button>
        </Box>
      </Container>

       <Container maxWidth="xl" sx={{ pb: 12, px: { xs: 2, md: 4 } }}>
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#FF5A5F' }} />
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
