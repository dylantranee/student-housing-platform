import { Box, Container, Typography } from '@mui/material';
import Header from '../components/layout/Header';
import LeafletMapSearch from '../components/common/LeafletMapSearch';

export default function ComparePricesPage() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 2 }, pb: 10, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontFamily: 'var(--font-serif)', 
              fontWeight: 700, 
              mb: 3, 
              color: '#000', 
              lineHeight: 1.1, 
              fontSize: { xs: '2.5rem', md: '3.5rem' } 
            }}
          >
            Compare Rental Prices
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 400, 
              fontSize: '1.2rem', 
              maxWidth: 600, 
              mx: 'auto'
            }}
          >
            Explore market prices across different locations to find the best value for your budget.
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <LeafletMapSearch />
        </Box>
      </Container>
    </Box>
  );
}
