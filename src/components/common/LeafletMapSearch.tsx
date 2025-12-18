import { useRef, useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import L from 'leaflet';
import { Button, TextField, Box, Typography, CircularProgress, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { getPropertiesNearby } from '../../service/properties/getPropertiesNearby.service';
import type { Property } from '../../service/properties/getProperties.service';

const DEFAULT_POSITION: [number, number] = [10.762622, 106.660172]; // Ho Chi Minh City
const DEFAULT_RADIUS_KM = 2; // Default search radius in kilometers

// Custom icon for user's selected location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for properties
const propertyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type DraggableMarkerProps = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  setAddress: (addr: string) => void;
};


import React from 'react';

type DraggableMarkerPropsExtended = DraggableMarkerProps & {
  onLocationChange?: (lat: number, lng: number, address: string) => void;
};

const DraggableMarker = React.memo(function DraggableMarker({ position, setPosition, setAddress, onLocationChange }: DraggableMarkerPropsExtended) {
  const markerRef = useRef<LeafletMarker>(null);

  useMapEvents({
    click(e) {
      console.log('Clicked position - Lat:', e.latlng.lat, 'Lng:', e.latlng.lng);
      setPosition([e.latlng.lat, e.latlng.lng]);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setPosition([latlng.lat, latlng.lng]);
        fetchAddress(latlng.lat, latlng.lng);
      }
    },
  };

  const fetchAddress = useCallback((lat: number, lng: number) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        const addr = data.display_name || 'Address not found';
        setAddress(addr);
        if (onLocationChange) {
          onLocationChange(lat, lng, addr);
        }
      });
  }, [setAddress, onLocationChange]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={userIcon}
    >
      <Popup>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">Your Selected Location</Typography>
          <Typography variant="body2">{position[0].toFixed(6)}, {position[1].toFixed(6)}</Typography>
        </Box>
      </Popup>
    </Marker>
  );
});

type LeafletMapSearchProps = {
  onLocationChange?: (lat: number, lng: number, address: string) => void;
};

export default function LeafletMapSearch({ onLocationChange }: LeafletMapSearchProps) {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [address, setAddress] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);
  const inputRef = useRef<HTMLInputElement>(null);
  const latInputRef = useRef<HTMLInputElement>(null);
  const lngInputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  const debounceRef = useRef<number | null>(null);

  // Fetch nearby properties when position changes
  const fetchNearbyProperties = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const nearbyProps = await getPropertiesNearby({ lat, lng, radiusKm });
      setProperties(nearbyProps);
      console.log(`Found ${nearbyProps.length} properties within ${radiusKm}km`);
    } catch (error) {
      console.error('Error fetching nearby properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  // Update properties when position or radius changes
  useEffect(() => {
    fetchNearbyProperties(position[0], position[1]);
  }, [position, radiusKm, fetchNearbyProperties]);

  // Custom hook to pan map when position changes
  function MapPanTo({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      const currentZoom = map.getZoom();
      map.setView(position, currentZoom, { animate: true });
    }, [position, map]);
    return null;
  }

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const latValue = latInputRef.current?.value || '';
    const lngValue = lngInputRef.current?.value || '';
    const addressQuery = inputRef.current?.value || '';
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Nếu có lat và lng thì ưu tiên dùng lat/lng
    if (latValue && lngValue) {
      const latNum = parseFloat(latValue);
      const lngNum = parseFloat(lngValue);
      
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setPosition([latNum, lngNum]);
        // Fetch address từ lat/lng
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latNum}&lon=${lngNum}`)
          .then(res => res.json())
          .then(data => {
            const addr = data.display_name || 'Address not found';
            setAddress(addr);
            if (onLocationChange) {
              onLocationChange(latNum, lngNum, addr);
            }
          });
      }
    } else if (addressQuery) {
      // Nếu không có lat/lng thì search bằng address
      debounceRef.current = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`)
          .then(res => res.json())
          .then((results: any[]) => {
            if (results && results.length > 0) {
              const { lat, lon, display_name } = results[0];
              const latNum = parseFloat(lat);
              const lngNum = parseFloat(lon);
              setPosition([latNum, lngNum]);
              setAddress(display_name);
              if (onLocationChange) {
                onLocationChange(latNum, lngNum, display_name);
              }
              // Update lat/lng inputs
              if (latInputRef.current) latInputRef.current.value = latNum.toFixed(6);
              if (lngInputRef.current) lngInputRef.current.value = lngNum.toFixed(6);
            } else {
              setAddress('Address not found');
            }
          });
      }, 400);
    }
  }, [onLocationChange]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, margin: '0 auto', px: 2 }}>
      <Box 
        component="form" 
        onSubmit={handleSearch} 
        sx={{ 
          mb: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField 
            inputRef={inputRef}
            type="text" 
            placeholder="Enter address..." 
            variant="outlined"
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'center' }}>
          <TextField 
            inputRef={latInputRef}
            type="text" 
            placeholder="Latitude (e.g., 10.762622)" 
            variant="outlined"
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          <TextField 
            inputRef={lngInputRef}
            type="text" 
            placeholder="Longitude (e.g., 106.660172)" 
            variant="outlined"
            fullWidth
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#f8f9fa'
              }
            }}
          />
          <Button 
            type="submit" 
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ 
              bgcolor: '#FF5A5F',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              minWidth: 120,
              '&:hover': { 
                bgcolor: '#FF385C', 
                boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)' 
              }
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
      <Box 
        sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: '#f8f9fa', 
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          minHeight: 90
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
              // wordBreak: 'break-word'
            }}
          >
            {address || 'Select a location on the map'}
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center', 
          flexWrap: 'wrap',
          flexShrink: 0 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
            <Typography variant="body2" fontWeight={600}>Radius:</Typography>
            <TextField
              size="small"
              type="number"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value) || 2)}
              inputProps={{ min: 0.5, max: 10, step: 0.5 }}
              sx={{ width: 80 }}
            />
            <Typography variant="body2">km</Typography>
          </Box>
          <Chip 
            icon={<HomeIcon />}
            label={`${properties.length} found`}
            color={properties.length > 0 ? "success" : "default"}
            size="small"
          />
          {loading && <CircularProgress size={20} />}
        </Box>
      </Box>
      <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <MapContainer center={position as [number, number]} zoom={14} style={{ height: 500, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapPanTo position={position} />
          <DraggableMarker position={position} setPosition={setPosition} setAddress={setAddress} onLocationChange={onLocationChange} />
          
          {/* Circle showing search radius */}
          <Circle 
            center={position} 
            radius={radiusKm * 1000} 
            pathOptions={{ 
              color: '#FF5A5F', 
              fillColor: '#FF5A5F', 
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '5, 5'
            }} 
          />
          
          {/* Property markers */}
          {properties.map((property) => (
            property.lat && property.lng && (
              <Marker
                key={property._id}
                position={[property.lat, property.lng]}
                icon={propertyIcon}
              >
                <Popup>
                  <Box sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {property.title}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                      ${property.price.toLocaleString()}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {property.location}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label={`${property.bedrooms} beds`} size="small" />
                      <Chip label={`${property.bathrooms} baths`} size="small" />
                      <Chip label={`${property.area}m²`} size="small" />
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}
