import axios from "axios";

const API_URL = "http://localhost:8080/api/houseDetail";

export interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  lat?: number;
  lng?: number;
}

export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
