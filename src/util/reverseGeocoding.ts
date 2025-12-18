type Coordinate = {
  lat: number;
  lng: number;
};

type LocationResult = Coordinate & {
  address: string;
  error?: string;
};

/**
 * Reverse geocoding: Get address from lat/lng using Nominatim OpenStreetMap API
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || 'Address not found';
  } catch (error) {
    console.error(`Error geocoding ${lat}, ${lng}:`, error);
    return 'Error fetching address';
  }
}

/**
 * Process multiple coordinates with delay to respect API rate limits
 */
async function reverseGeocodeMultiple(
  coordinates: Coordinate[],
  delayMs: number = 1000
): Promise<LocationResult[]> {
  const results: LocationResult[] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const coord = coordinates[i];
    console.log(`Processing ${i + 1}/${coordinates.length}...`);
    
    const address = await reverseGeocode(coord.lat, coord.lng);
    results.push({
      ...coord,
      address,
    });

    // Add delay to respect API rate limits (Nominatim: max 1 request/sec)
    if (i < coordinates.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Print results in a readable format
 */
function printResults(results: LocationResult[]): void {
  console.log('\n=== REVERSE GEOCODING RESULTS ===\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}.`);
    console.log(`   Lat: ${result.lat.toFixed(6)}, Lng: ${result.lng.toFixed(6)}`);
    console.log(`   Address: ${result.address}`);
    console.log('');
  });

  console.log('\n=== JSON FORMAT ===\n');
  console.log(JSON.stringify(results, null, 2));
}

// Sample coordinates
const coordinates: Coordinate[] = [

];

// Auto-run when file is executed
(async () => {
  console.log(`Starting reverse geocoding for ${coordinates.length} coordinates...`);
  console.log('This will take about', Math.ceil(coordinates.length * 1.1), 'seconds\n');
  
  const results = await reverseGeocodeMultiple(coordinates);
  printResults(results);
})();

export { reverseGeocode, reverseGeocodeMultiple };
