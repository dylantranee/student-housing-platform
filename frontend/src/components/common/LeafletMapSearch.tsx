import { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { getPropertiesNearby } from '../../service/properties/getPropertiesNearby.service';
import type { Property } from '../../service/properties/getProperties.service';
import LeafletMap from './LeafletMap';
import InformationOfMap from './InformationOfMap';
import React from 'react';

const DEFAULT_POSITION: [number, number] = [10.762622, 106.660172]; // Ho Chi Minh City
const DEFAULT_RADIUS_KM = 2; // Default search radius in kilometers

type LeafletMapSearchProps = {
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  readOnly?: boolean;
  initialLat?: number;
  initialLng?: number;
};

export default function LeafletMapSearch({ onLocationChange, readOnly = false, initialLat, initialLng }: LeafletMapSearchProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_POSITION
  );
  const [address, setAddress] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);

  // Calculate price statistics
  const priceStats = React.useMemo(() => {
    if (properties.length === 0) return null;
    
    const avgPrice = properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
    
    const lowestProp = properties.reduce((min, p) => p.price < min.price ? p : min);
    const highestProp = properties.reduce((max, p) => p.price > max.price ? p : max);
    
    const closestToAvg = properties.reduce((closest, p) => {
      const currentDiff = Math.abs(p.price - avgPrice);
      const closestDiff = Math.abs(closest.price - avgPrice);
      return currentDiff < closestDiff ? p : closest;
    });
    
    return {
      avgPrice: Math.round(avgPrice),
      lowest: lowestProp,
      highest: highestProp,
      closestToAvg: closestToAvg
    };
  }, [properties]);

  // Fetch nearby properties when position changes
  const fetchNearbyProperties = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const nearbyProps = await getPropertiesNearby({ lat, lng, radiusKm });
      setProperties(nearbyProps);
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

  return (
    <Box>
      <LeafletMap
        position={position}
        setPosition={setPosition}
        setAddress={setAddress}
        radiusKm={radiusKm}
        properties={properties}
        onLocationChange={onLocationChange}
        readOnly={readOnly}
      />
      
      <InformationOfMap
        position={position}
        address={address}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        properties={properties}
        loading={loading}
        priceStats={priceStats}
        readOnly={readOnly}
      />
    </Box>
  );
}
