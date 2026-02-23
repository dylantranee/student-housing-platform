import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Stack, 
    Divider, 
    CircularProgress,
    IconButton,
    Avatar,
    Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
    FavoriteBorder, 
    Share, 
    Description,
    CheckCircleOutline,
    Star
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/layout/Header';
import { getPropertyDetail } from '../service/properties/getPropertyDetail.service';
import LeafletMap from '../components/common/LeafletMap';
import { UPLOADS_BASE_URL } from '../config/apiConfig';
import { browseRoommates } from '../service/browseRoommates.service';
import { RoommateCard } from '../components/RoommateCard';
import { RoommateDetailModal } from '../components/RoommateDetailModal';
import type { RoommateProfile } from '../types/roommateProfile.types';
import { COLORS } from '../theme/theme';
import PeopleIcon from '@mui/icons-material/People';
import ContactOwnerModal from '../components/ContactOwnerModal';

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
];

// Reuse icons from PropertyCard or define local ones
const BedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 18 16" fill="currentColor">
        <path d="M17,16h-3c-.37891,0-.7251-.21387-.89453-.55273l-.72363-1.44727h-6.76367l-.72363,1.44727c-.16943.33887-.51562.55273-.89453.55273H1c-.55225,0-1-.44775-1-1v-6c0-.55225.44775-1,1-1h16c.55225,0,1,.44775,1,1v6c0,.55225-.44775,1-1,1ZM14.61816,14h1.38184v-4H2v4h1.38184l.72363-1.44727c.16943-.33887.51562-.55273.89453-.55273h8c.37891,0,.7251.21387.89453.55273l.72363,1.44727Z" />
        <path d="M16,10c-.55225,0-1-.44775-1-1V3c0-.55127-.44873-1-1-1H4c-.55127,0-1,.44873-1,1v6c0,.55225-.44775,1-1,1s-1-.44775-1-1V3C1,1.3457,2.3457,0,4,0h10c1.6543,0,3,1.3457,3,3v6c0,.55225-.44775,1-1,1Z" />
        <path d="M9,10c-.55225,0-1-.44775-1-1v-2h-2v2c0,.55225-.44775,1-1,1s-1-.44775-1-1v-2c0-1.10303.89697-2,2-2h2c1.10303,0,2,.89697,2,2v2c0,.55225-.44775,1-1,1Z" />
        <path d="M13,10c-.55225,0-1-.44775-1-1v-2h-2v2c0,.55225-.44775,1-1,1s-1-.44775-1-1v-2c0-1.10303.89697-2,2-2h2c1.10303,0,2,.89697,2,2v2c0,.55225-.44775,1-1,1Z" />
    </svg>
);

const BathIcon = () => (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor">
        <path d="M13.14307,17H4.85693c-2.67822,0-4.85693-2.17871-4.85693-4.85693V4c0-.55225.44775-1,1-1s1,.44775,1,1v5h15c.55225,0,1,.44775,1,1v2.14307c0,2.67822-2.17871,4.85693-4.85693,4.85693ZM2,11v1.14307c0,1.5752,1.28174,2.85693,2.85693,2.85693h8.28613c1.5752,0,2.85693-1.28174,2.85693-2.85693v-1.14307H2Z" />
        <path d="M7,5c-.55225,0-1-.44775-1-1,0-1.10303-.89697-2-2-2s-2,.89697-2,2c0,.55225-.44775,1-1,1s-1-.44775-1-1C0,1.79443,1.79443,0,4,0s4,1.79443,4,4c0,.55225-.44775,1-1,1Z" />
        <path d="M2,18c-.25586,0-.51172-.09766-.70703-.29297-.39062-.39062-.39062-1.02344,0-1.41406l1-1c.39062-.39062,1.02344-.39062,1.41406,0s.39062,1.02344,0,1.41406l-1,1c-.19531.19531-.45117.29297-.70703.29297Z" />
        <path d="M16,18c-.25586,0-.51172-.09766-.70703-.29297l-1-1c-.39062-.39062-.39062-1.02344,0-1.41406s1.02344-.39062,1.41406,0l1,1c.39062.39062.39062,1.02344,0,1.41406-.19531.19531-.45117.29297-.70703.29297Z" />
        <path d="M9,6.8291c-.25586,0-.51172-.09766-.70703-.29297-.69141-.69141-1.89453-.69141-2.58594,0-.39062.39062-1.02344.39062,1.41406,0s-.39062-1.02344,0-1.41406c1.49219-1.49316,3.92188-1.49316,5.41406,0,.39062.39062.39062,1.02344,0,1.41406-.19531.19531-.45117.29297-.70703.29297Z" />
    </svg>
);

export default function PropertyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImg, setMainImg] = useState<string | undefined>(undefined);
    const [selectedRoommateIds, setSelectedRoommateIds] = useState<string[]>([]);
    const [selectedRoommate, setSelectedRoommate] = useState<RoommateProfile | null>(null);
    const [showRoommateModal, setShowRoommateModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [position, setPosition] = useState<[number, number]>([10.762622, 106.660172]);

    const { data: property, isLoading: propertyLoading } = useQuery({
        queryKey: ['property', id],
        queryFn: () => getPropertyDetail(id!),
        enabled: !!id,
    });

    const { data: allRoommates } = useQuery({
        queryKey: ['roommates'],
        queryFn: () => browseRoommates(),
        enabled: !!property,
    });

    const potentialRoommates = useMemo(() => {
        if (!property || !allRoommates) return [];
        const roommates = allRoommates.profiles || [];
        const propertyPrice = property.price || 0;
        return roommates
            .filter(r => (r.matchScore || 0) >= 40)
            .filter(r => (r.budgetMax || 0) >= (propertyPrice * 0.4))
            .slice(0, 6);
    }, [property, allRoommates]);

    useEffect(() => {
        if (property) {
            const images = property.images && property.images.length > 0 
                ? property.images.map(img => img.startsWith('http') ? img : `${UPLOADS_BASE_URL}/${img}`)
                : FALLBACK_IMAGES;
            setMainImg(images[0]);
            
            if (property.lat && property.lng) {
                setPosition([property.lat, property.lng]);
            }
        }
    }, [property]);

    if (propertyLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: COLORS.primary }} />
            </Box>
        );
    }

    if (!property) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h5">Property not found</Typography>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </Box>
        );
    }

    // Use the same fallback logic for the hero gallery
    const images = property.images && property.images.length > 0 
        ? property.images.map(img => img.startsWith('http') ? img : `${UPLOADS_BASE_URL}/${img}`)
        : FALLBACK_IMAGES;

    const handleImageError = (index: number) => {
        // Simple fallback to a default image if even Unsplash fails or if local is broken
        if (index === 0) setMainImg(FALLBACK_IMAGES[0]);
    };

    const handleRoommateClick = (profile: RoommateProfile) => {
        setSelectedRoommate(profile);
        setShowRoommateModal(true);
    };

    const toggleRoommateSelection = (profile: RoommateProfile) => {
        const userId = typeof profile.userId === 'object' ? (profile.userId as any)._id : profile.userId;
        if (!userId) return;

        setSelectedRoommateIds(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    return (
        <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
            <Header />
            
            <Container maxWidth="xl" sx={{ mt: 4, pb: 10 }}>
                {/* Title and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontFamily: 'var(--font-serif)', fontWeight: 700, mb: 1 }}>
                            {property.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {property.location}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <IconButton><Share sx={{ fontSize: 20 }} /></IconButton>
                        <IconButton><FavoriteBorder sx={{ fontSize: 20 }} /></IconButton>
                    </Stack>
                </Box>

                {/* Hero Gallery */}
                <Grid container spacing={1} sx={{ borderRadius: 4, overflow: 'hidden', mb: 6 }}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ height: 500, overflow: 'hidden' }}>
                            {mainImg ? (
                                <img 
                                    src={mainImg || undefined} 
                                    alt="Property" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={() => handleImageError(0)}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5' }} />
                            )}
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={1} sx={{ height: 500 }}>
                            <Box sx={{ height: '50%', overflow: 'hidden' }}>
                                <img src={images[1] || images[0] || FALLBACK_IMAGES[0]} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                            <Box sx={{ height: '50%', overflow: 'hidden', position: 'relative' }}>
                                <img src={images[2] || images[0] || FALLBACK_IMAGES[1]} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Button 
                                    sx={{ 
                                        position: 'absolute', bottom: 20, right: 20, 
                                        bgcolor: 'white', color: 'black', 
                                        '&:hover': { bgcolor: '#f5f5f5' },
                                        textTransform: 'none', fontWeight: 600, px: 2, borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                    startIcon={<Description />}
                                >
                                    Show all photos
                                </Button>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Main Content Area */}
                <Grid container spacing={8}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* Summary Highlights */}
                        <Box sx={{ mb: 4 }}>
                            <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <BedIcon />
                                    <Typography fontWeight={600}>{property.bedrooms} Bedrooms</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <BathIcon />
                                    <Typography fontWeight={600}>{property.bathrooms} Bathrooms</Typography>
                                </Box>
                            </Stack>
                            <Divider />
                        </Box>

                        {/* Description */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', fontSize: '1.1rem', mb: 4 }}>
                                {property.description || "A spacious, sociable student home in the heart of the city. Close to campus and all major transportation links."}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 4 }}>
                                <Star sx={{ color: COLORS.primary }} />
                                <Typography fontWeight={700}>5.0</Typography>
                                <Typography color="text.secondary" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>15 reviews</Typography>
                            </Stack>
                            <Divider />
                        </Box>

                        {/* Amenities */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>What this place offers</Typography>
                            <Grid container spacing={2}>
                                {['WiFi', 'Kitchen', 'Washing Machine', 'Heating', 'Carbon Monoxide Alarm', 'Dedicated Workspace', 'Iron', 'Hair Dryer'].map((item) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={item}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <CheckCircleOutline sx={{ color: 'text.secondary' }} />
                                            <Typography variant="body1">{item}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 6 }} />

                        {/* Location */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Where you'll be</Typography>
                            <Box sx={{ height: 400, borderRadius: 4, overflow: 'hidden', bgcolor: '#f5f5f5', position: 'relative' }}>
                                {property.lat && property.lng ? (
                                    <LeafletMap
                                        position={position}
                                        setPosition={setPosition}
                                        setAddress={() => {}}
                                        radiusKm={0}
                                        properties={[]}
                                        readOnly
                                        usePropertyLocationIcon
                                    />
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                                        Location coordinates not available
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* Sidebar Action Card */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ 
                            position: 'sticky', 
                            top: 100, 
                            p: 4, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 4, 
                            boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
                            transition: 'box-shadow 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 20px 50px rgba(0,0,0,0.12)'
                            }
                        }}>
                            {/* Pricing Section */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h4" component="div" fontWeight={800} sx={{ 
                                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 0.5
                                }}>
                                    {property.price?.toLocaleString('vi-VN')}₫
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    per month • Utilities included
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                                    Deposit: {((property.price || 0) * 0.5).toLocaleString('vi-VN')}₫
                                </Typography>
                            </Box>

                            {/* Primary CTA */}
                            <Button 
                                fullWidth 
                                variant="contained"
                                onClick={() => setShowContactModal(true)}
                                sx={{ 
                                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)`,
                                    py: 2, 
                                    borderRadius: 2.5, 
                                    fontWeight: 700, 
                                    mb: 3,
                                    textTransform: 'none', 
                                    fontSize: '1.05rem',
                                    boxShadow: '0 4px 20px rgba(255, 90, 95, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        background: `linear-gradient(135deg, ${COLORS.primaryHover} 0%, #E91E63 100%)`,
                                        boxShadow: '0 6px 30px rgba(255, 90, 95, 0.4)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Contact Owner
                            </Button>

                            <Divider sx={{ mb: 3 }} />

                            {/* Simplified Landlord Info */}
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ 
                                    width: 44, 
                                    height: 44, 
                                    bgcolor: '#64748b',
                                    fontSize: '1.2rem',
                                    fontWeight: 700
                                }}>
                                    O
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        Landlord Owner
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Star sx={{ fontSize: 14, color: '#FFB400' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>4.9</Typography>
                                        <Typography variant="caption" color="text.secondary">(23 reviews)</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            {/* Potential Roommates Section */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <PeopleIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                                    <Typography variant="caption" sx={{ 
                                        fontWeight: 700, 
                                        color: '#222',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.75rem'
                                    }}>
                                        Potential Roommates
                                    </Typography>
                                    {selectedRoommateIds.length > 0 && (
                                        <Chip 
                                            label={`${selectedRoommateIds.length} selected`} 
                                            size="small" 
                                            color="primary"
                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                                            onDelete={() => setSelectedRoommateIds([])}
                                        />
                                    )}
                                </Box>
                                
                                <Typography variant="body2" sx={{ color: '#717171', fontSize: '0.85rem', mb: 2 }}>
                                    These students also like this area and match your vibe.
                                </Typography>

                                <Stack spacing={1.5}>
                                    {potentialRoommates.length > 0 ? (
                                        potentialRoommates.map(roommate => (
                                            <RoommateCard 
                                                key={roommate._id}
                                                profile={roommate}
                                                variant="compact"
                                                selectable={false}
                                                selected={selectedRoommateIds.includes(typeof roommate.userId === 'object' ? (roommate.userId as any)._id : roommate.userId)}
                                                onToggleSelect={() => toggleRoommateSelection(roommate)}
                                                onViewDetails={() => handleRoommateClick(roommate)}
                                            />
                                        ))
                                    ) : (
                                        <Box sx={{ 
                                            textAlign: 'center', 
                                            py: 2.5, 
                                            px: 2, 
                                            bgcolor: '#f8f9fa', 
                                            borderRadius: 4, 
                                            border: '1px dashed #e0e0e0' 
                                        }}>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, fontStyle: 'italic', lineHeight: 1.4 }}>
                                                Setting up your profile helps us find perfect roommates for this home.
                                            </Typography>
                                            <Button 
                                                size="small"
                                                variant="outlined"
                                                onClick={() => navigate('/profile?tab=roommate')}
                                                sx={{ 
                                                    borderRadius: 50, 
                                                    textTransform: 'none', 
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    px: 3,
                                                    borderColor: '#ddd',
                                                    color: '#222',
                                                    '&:hover': { borderColor: COLORS.primary, color: COLORS.primary, bgcolor: 'white' }
                                                }}
                                            >
                                                Complete Profile
                                            </Button>
                                        </Box>
                                    )}
                                </Stack>
                                
                                {potentialRoommates.length > 0 && (
                                    <Button 
                                        fullWidth 
                                        onClick={() => navigate(`/roommates/browse?fromProperty=${id}&propertyTitle=${encodeURIComponent(property.title)}`)}
                                        sx={{ 
                                            mt: 2, 
                                            textTransform: 'none', 
                                            color: COLORS.primary, 
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        Explore all compatible souls
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <RoommateDetailModal 
                profile={selectedRoommate}
                open={showRoommateModal}
                onClose={() => setShowRoommateModal(false)}
                contextPropertyUrl={window.location.href}
                isSelected={selectedRoommate ? selectedRoommateIds.includes(typeof selectedRoommate.userId === 'object' ? (selectedRoommate.userId as any)._id : selectedRoommate.userId) : false}
                onToggleSelect={selectedRoommate ? (() => toggleRoommateSelection(selectedRoommate)) : undefined}
            />

            <ContactOwnerModal
                open={showContactModal}
                onClose={() => setShowContactModal(false)}
                property={property}
                initialSelectedRoommateIds={selectedRoommateIds}
                potentialRoommates={potentialRoommates}
                onSuccess={() => {
                    // Optional: Show a success snackbar or refresh data
                    console.log('Inquiry submitted successfully!');
                }}
            />
        </Box>
    );
}
