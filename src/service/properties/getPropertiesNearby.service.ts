import axios from "axios";
import type { Property } from "./getProperties.service";
import { filterPropertiesInRadius } from "../../util/calculateArea";

const API_URL = "http://localhost:3000/api/houseDetail";

export interface NearbyPropertiesParams {
  lat: number;
  lng: number;
  radiusKm?: number; // Default to 2km
}

/**
 * Get properties near a specific location
 * @param params Location and radius parameters
 * @returns Properties within the specified radius
 */
export const getPropertiesNearby = async (
  params: NearbyPropertiesParams
): Promise<Property[]> => {
  try {
    // Fetch all properties from the API
    const response = await axios.get(API_URL);
    const allProperties: Property[] = response.data;
    
    // Filter properties within the specified radius
    const radiusKm = params.radiusKm || 2; // Default 2km
    const nearbyProperties = filterPropertiesInRadius(
      params.lat,
      params.lng,
      allProperties,
      radiusKm
    );
    
    return nearbyProperties;
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    throw error;
  }
};
