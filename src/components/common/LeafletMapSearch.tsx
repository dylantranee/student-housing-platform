
import { useRef, useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const DEFAULT_POSITION: [number, number] = [10.762622, 106.660172]; // Ho Chi Minh City

type DraggableMarkerProps = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  setAddress: (addr: string) => void;
};


import React from 'react';

const DraggableMarker = React.memo(function DraggableMarker({ position, setPosition, setAddress }: DraggableMarkerProps) {
  const markerRef = useRef<LeafletMarker>(null);

  useMapEvents({
    click(e) {
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
        setAddress(data.display_name || 'Address not found');
      });
  }, [setAddress]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <span>{position[0].toFixed(6)}, {position[1].toFixed(6)}</span>
      </Popup>
    </Marker>
  );
});

export default function LeafletMapSearch() {
  const [position, setPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [address, setAddress] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  const debounceRef = useRef<number | null>(null);

  // Custom hook to pan map when position changes
  function MapPanTo({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      const currentZoom = map.getZoom();
      map.setView(position, currentZoom, { animate: true });
    }, [position, map]);
    return null;
  }

  const searchAddress = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current?.value || '';
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then((results: any[]) => {
          if (results && results.length > 0) {
            const { lat, lon, display_name } = results[0];
            setPosition([parseFloat(lat), parseFloat(lon)]);
            setAddress(display_name);
          } else {
            setAddress('Address not found');
          }
        });
    }, 400); // 400ms debounce
  }, [setPosition, setAddress]);

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <form onSubmit={searchAddress} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <input ref={inputRef} type="text" placeholder="Enter address..." style={{ flex: 1, padding: 8, fontSize: 16 }} />
        <button type="submit" style={{ padding: '8px 16px', fontSize: 16 }}>Search</button>
      </form>
      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Address: {address}</div>
      <MapContainer center={position as [number, number]} zoom={16} style={{ height: 400, width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPanTo position={position} />
        <DraggableMarker position={position} setPosition={setPosition} setAddress={setAddress} />
      </MapContainer>
    </div>
  );
}
