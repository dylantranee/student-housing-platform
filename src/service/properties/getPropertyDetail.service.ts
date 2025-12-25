import { request } from "../../util/request";
import type { Property } from "./getProperties.service";

const API_URL = "/api/houseDetail";

export const getPropertyDetail = async (id: string): Promise<Property> => {
  return request<Property>(`${API_URL}/${id}`);
};
