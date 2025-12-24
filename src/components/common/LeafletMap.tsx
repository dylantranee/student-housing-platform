import { useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Circle } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import L from 'leaflet';
import { Button, TextField, Box, Typography, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import type { Property } from '../../service/properties/getProperties.service';
import React from 'react';

// Fix for Leaflet default icon issues with modern build tools
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icon for user's selected location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Green marker for property location (read-only)
const propertyLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for properties
const propertyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type DraggableMarkerProps = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  setAddress: (addr: string) => void;
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  readOnly?: boolean;
  usePropertyLocationIcon?: boolean;
};

const DraggableMarker = React.memo(function DraggableMarker({ 
  position, 
  setPosition, 
  setAddress, 
  onLocationChange, 
  readOnly,
  usePropertyLocationIcon = false
}: DraggableMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null);

  useMapEvents({
    click(e) {
      if (!readOnly) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      }
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

  const markerIcon = usePropertyLocationIcon ? propertyLocationIcon : userIcon;

  return (
    <Marker
      draggable={!readOnly}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
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

function MapPanTo({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const currentZoom = map.getZoom();
    map.setView(position, currentZoom, { animate: true });
  }, [position, map]);
  return null;
}

type LeafletMapProps = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  setAddress: (addr: string) => void;
  radiusKm: number;
  properties: Property[];
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  readOnly?: boolean;
  usePropertyLocationIcon?: boolean;
};

export default function LeafletMap({
  position,
  setPosition,
  setAddress,
  radiusKm,
  properties,
  onLocationChange,
  readOnly = false,
  usePropertyLocationIcon = false
}: LeafletMapProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const latInputRef = useRef<HTMLInputElement>(null);
  const lngInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const latValue = latInputRef.current?.value || '';
    const lngValue = lngInputRef.current?.value || '';
    const addressQuery = inputRef.current?.value || '';
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (latValue && lngValue) {
      const latNum = parseFloat(latValue);
      const lngNum = parseFloat(lngValue);
      
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setPosition([latNum, lngNum]);
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
              if (latInputRef.current) latInputRef.current.value = latNum.toFixed(6);
              if (lngInputRef.current) lngInputRef.current.value = lngNum.toFixed(6);
            } else {
              setAddress('Address not found');
            }
          });
      }, 400);
    }
  }, [onLocationChange, setAddress, setPosition]);

  return (
    <Box sx={{ width: '100%', maxWidth: 1000, margin: '1rem auto', px: readOnly ? 0 : 2 }}>
      {!readOnly && (
        <Box 
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e as any);
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#FCFCFC'
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e as any);
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#FCFCFC'
                }
              }}
            />
            <TextField 
              inputRef={lngInputRef}
              type="text" 
              placeholder="Longitude (e.g., 106.660172)" 
              variant="outlined"
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(e as any);
                }
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#FCFCFC'
                }
              }}
            />
            <Button 
              onClick={(e) => {
                e.preventDefault();
                handleSearch(e as any);
              }}
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
      )}

      <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: readOnly ? 'none' : '0 4px 12px rgba(0,0,0,0.15)' }}>
        <MapContainer center={position} zoom={14} style={{ height: readOnly ? 400 : 500, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapPanTo position={position} />
          <DraggableMarker 
            position={position} 
            setPosition={setPosition} 
            setAddress={setAddress} 
            onLocationChange={onLocationChange} 
            readOnly={readOnly}
            usePropertyLocationIcon={usePropertyLocationIcon}
          />
          
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
          
          {properties.map((property) => (
            property.lat && property.lng && (
              <Marker
                key={property._id}
                position={[property.lat, property.lng]}
                icon={propertyIcon}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {property.title}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                      ${property.price.toLocaleString()}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {property.location}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1}}>
                      <Chip label={`${property.bedrooms} beds`} size="small" />
                      <Chip label={`${property.bathrooms} baths`} size="small" />
                      <Chip label={`${property.area}m²`} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/property/${property._id}`)}
                        sx={{
                          bgcolor: '#FF5A5F',
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#FF385C'
                          }
                        }}
                      >
                        Detail
                      </Button>
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
