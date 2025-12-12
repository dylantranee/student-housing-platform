import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Property } from '../../service/properties/getProperties.service';



const BedroomIcon = () => (
    <svg width="14" height="14" viewBox="0 0 18 16" fill="currentColor" style={{ marginRight: 12, marginTop: -2 }}>
        <path d="M17,16h-3c-.37891,0-.7251-.21387-.89453-.55273l-.72363-1.44727h-6.76367l-.72363,1.44727c-.16943.33887-.51562.55273-.89453.55273H1c-.55225,0-1-.44775-1-1v-6c0-.55225.44775-1,1-1h16c.55225,0,1,.44775,1,1v6c0,.55225-.44775,1-1,1ZM14.61816,14h1.38184v-4H2v4h1.38184l.72363-1.44727c.16943-.33887.51562-.55273.89453-.55273h8c.37891,0,.7251.21387.89453.55273l.72363,1.44727Z" />
        <path d="M16,10c-.55225,0-1-.44775-1-1V3c0-.55127-.44873-1-1-1H4c-.55127,0-1,.44873-1,1v6c0,.55225-.44775,1-1,1s-1-.44775-1-1V3C1,1.3457,2.3457,0,4,0h10c1.6543,0,3,1.3457,3,3v6c0,.55225-.44775,1-1,1Z" />
        <path d="M9,10c-.55225,0-1-.44775-1-1v-2h-2v2c0,.55225-.44775,1-1,1s-1-.44775-1-1v-2c0-1.10303.89697-2,2-2h2c1.10303,0,2,.89697,2,2v2c0,.55225-.44775,1-1,1Z" />
        <path d="M13,10c-.55225,0-1-.44775-1-1v-2h-2v2c0,.55225-.44775,1-1,1s-1-.44775-1-1v-2c0-1.10303.89697-2,2-2h2c1.10303,0,2,.89697,2,2v2c0,.55225-.44775,1-1,1Z" />
    </svg>
);

const BathroomIcon = () => (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="currentColor" style={{ marginRight: 12, marginTop: -2 }}>
        <path d="M13.14307,17H4.85693c-2.67822,0-4.85693-2.17871-4.85693-4.85693V4c0-.55225.44775-1,1-1s1,.44775,1,1v5h15c.55225,0,1,.44775,1,1v2.14307c0,2.67822-2.17871,4.85693-4.85693,4.85693ZM2,11v1.14307c0,1.5752,1.28174,2.85693,2.85693,2.85693h8.28613c1.5752,0,2.85693-1.28174,2.85693-2.85693v-1.14307H2Z" />
        <path d="M7,5c-.55225,0-1-.44775-1-1,0-1.10303-.89697-2-2-2s-2,.89697-2,2c0,.55225-.44775,1-1,1s-1-.44775-1-1C0,1.79443,1.79443,0,4,0s4,1.79443,4,4c0,.55225-.44775,1-1,1Z" />
        <path d="M2,18c-.25586,0-.51172-.09766-.70703-.29297-.39062-.39062-.39062-1.02344,0-1.41406l1-1c.39062-.39062,1.02344-.39062,1.41406,0s.39062,1.02344,0,1.41406l-1,1c-.19531.19531-.45117.29297-.70703.29297Z" />
        <path d="M16,18c-.25586,0-.51172-.09766-.70703-.29297l-1-1c-.39062-.39062-.39062-1.02344,0-1.41406s1.02344-.39062,1.41406,0l1,1c.39062.39062.39062,1.02344,0,1.41406-.19531.19531-.45117.29297-.70703.29297Z" />
        <path d="M9,6.8291c-.25586,0-.51172-.09766-.70703-.29297-.69141-.69141-1.89453-.69141-2.58594,0-.39062.39062-1.02344.39062-1.41406,0s-.39062-1.02344,0-1.41406c1.49219-1.49316,3.92188-1.49316,5.41406,0,.39062.39062.39062,1.02344,0,1.41406-.19531.19531-.45117.29297-.70703.29297Z" />
    </svg>
);

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-2a4d04774c13?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18cf6b343?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
];

const FALLBACK_DESCRIPTIONS = [
    "Experience luxury living in this spacious student accommodation, featuring modern amenities and close proximity to campus.",
    "Cozy and affordable unit perfect for students, offering a quiet environment for study and relaxation.",
    "Modern design meets comfort in this centrally located apartment, walking distance to local cafes and universities.",
    "Spacious rooms with natural light, fully furnished and ready for you to move in immediately.",
    "Premium student housing with high-speed internet, gym access, and a vibrant community atmosphere.",
    "Secure and stylish living space designed specifically for students, with 24/7 security and maintenance."
];

const getFallbackImage = (id: string = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash += id.charCodeAt(i);
    }
    return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
};

const getFallbackDescription = (id: string = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash += id.charCodeAt(i);
    }
    return FALLBACK_DESCRIPTIONS[hash % FALLBACK_DESCRIPTIONS.length];
};

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const navigate = useNavigate();
    const propertyId = property._id || ''; 
    const fallbackImage = getFallbackImage(propertyId);
    const displayDescription = getFallbackDescription(propertyId);
    
    // Helper to get correct image URL
    const getInitialImage = () => {
        if (!property.images || property.images.length === 0) return fallbackImage;
        const firstImage = property.images[0];
        // If it's an object with filename (legacy/upload middleware format), use .filename
        // If it's a string (Unsplash URL or filename string), use it directly
        const imagePath = typeof firstImage === 'object' && (firstImage as any).filename 
            ? (firstImage as any).filename 
            : firstImage;
            
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        return `http://127.0.0.1:8080/uploads/${imagePath}`;
    };

    const [imgSrc, setImgSrc] = useState(getInitialImage());

    const handleImageError = () => {
        if (imgSrc !== fallbackImage) {
            setImgSrc(fallbackImage);
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                bgcolor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                cursor: 'pointer',
                '&:hover .property-title': { textDecoration: 'underline', textDecorationColor: '#222' }
            }}
            onClick={() => navigate(`/property/${property._id}`)}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3 }}>
                <CardMedia
                    component="img"
                    image={imgSrc}
                    alt={property.title}
                    sx={{
                        width: '100%',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.03)' }
                    }}
                    onError={handleImageError}
                />
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        bgcolor: 'white',
                        padding: '6px',
                        '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle shortlist/favorite
                    }}
                >
                    <FavoriteBorder sx={{ fontSize: 18, color: '#222' }} />
                </IconButton>

            </Box>

            <CardContent sx={{ pt: 3, px: 0, pb: 0 }}>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#222', mb: 0.5 }}>
                    {property.location || 'United Kingdom'}
                </Typography>
                
                <Typography className="property-title" variant="h6" sx={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.1rem', color: '#222', mb: 1, lineHeight: 1.3 }}>
                    {property.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 1.5, color: '#222', fontSize: '0.8rem', fontWeight: 600 }}>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BedroomIcon />
                        {property.bedrooms || 3} {(property.bedrooms === 1) ? 'Bedroom' : 'Bedrooms'}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BathroomIcon />
                        {property.bathrooms || 2} {(property.bathrooms === 1) ? 'Bathroom' : 'Bathrooms'}
                    </Box>
                </Box>
                
                 <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {displayDescription}
                </Typography>

                <Box sx={{ display: 'flex', gap: 4, pt: 1, borderTop: '0px solid #eee' }}>
                    <Box>
                         <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#222' }}>
                            Monthly rent
                        </Typography>
                         <Typography variant="body2" sx={{ color: '#222' }}>
                            From <Box component="span" sx={{ fontWeight: 600 }}>{property.price ? property.price.toLocaleString('vi-VN') : 0}₫</Box>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
