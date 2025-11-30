

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LeafletMapSearch from '../components/common/LeafletMapSearch';

export default function ComparePricesPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
        Compare Prices
      </Typography>
      <LeafletMapSearch />
    </Box>
  );
}
