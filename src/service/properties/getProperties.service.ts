import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const API_URL = `${API_BASE_URL}/houseDetail`;

export interface Property {
  area: any;
  _id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
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
