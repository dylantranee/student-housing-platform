import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import type { Property } from "./getProperties.service";

const API_URL = `${API_BASE_URL}/houseDetail`;

export const getPropertyDetail = async (id: string): Promise<Property> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property detail for ID ${id}:`, error);
    throw error;
  }
};
