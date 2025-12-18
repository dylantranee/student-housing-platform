/**
 * Generate a random number between min and max
 */
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random coordinates within Ho Chi Minh City area
 */
export function generateRandomCoordinates(): { lat: number; lng: number } {
  // Ho Chi Minh City approximate bounds
  const minLat = 10.6;
  const maxLat = 10.9;
  const minLng = 106.5;
  const maxLng = 106.9;

  return {
    lat: randomBetween(minLat, maxLat),
    lng: randomBetween(minLng, maxLng),
  };
}

/**
 * Generate random coordinates within a specific area
 */
export function generateRandomCoordinatesInArea(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 5
): { lat: number; lng: number } {
  // Approximate conversion: 1 degree ≈ 111 km
  const radiusDeg = radiusKm / 111;

  return {
    lat: randomBetween(centerLat - radiusDeg, centerLat + radiusDeg),
    lng: randomBetween(centerLng - radiusDeg, centerLng + radiusDeg),
  };
}

/**
 * Generate multiple random coordinates
 */
export function generateMultipleRandomCoordinates(count: number): Array<{ lat: number; lng: number }> {
  return Array.from({ length: count }, () => generateRandomCoordinates());
}

/**
 * Print random coordinates to console
 */
export function printRandomCoordinates(count: number = 20): void {
  console.log(`Generating ${count} random coordinates:\n`);
  const coordinates = generateMultipleRandomCoordinates(count);
  
  coordinates.forEach((coord, index) => {
    console.log(`${index + 1}. Lat: ${coord.lat.toFixed(6)}, Lng: ${coord.lng.toFixed(6)}`);
  });
  
  console.log('\nJSON format:');
  console.log(JSON.stringify(coordinates, null, 2));
}

// Auto-run when file is executed directly
printRandomCoordinates(100);
