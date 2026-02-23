import { request } from "../../util/request";

const API_URL = "/api/houseDetail";

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
  return request<Property[]>(API_URL);
};
