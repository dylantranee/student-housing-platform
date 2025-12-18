/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter properties within a given radius from a center point
 * @param centerLat Center point latitude
 * @param centerLng Center point longitude
 * @param properties Array of properties with lat/lng
 * @param radiusKm Radius in kilometers
 * @returns Filtered properties within radius
 */
export function filterPropertiesInRadius<T extends { lat?: number; lng?: number }>(
  centerLat: number,
  centerLng: number,
  properties: T[],
  radiusKm: number = 2
): T[] {
  return properties.filter(property => {
    if (!property.lat || !property.lng) return false;
    
    const distance = calculateDistance(
      centerLat,
      centerLng,
      property.lat,
      property.lng
    );
    
    return distance <= radiusKm;
  });
}
