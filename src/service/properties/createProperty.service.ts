import { API_BASE_URL } from "../../config/apiConfig";

export const createProperty = async (propertyData: any) => {
  const response = await fetch(`${API_BASE_URL}/houseDetail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) throw new Error('Failed to create property');
  return response.json();
};

export const updateProperty = async (id: string, propertyData: any) => {
  let body;
  let headers: Record<string, string> = {};
  if (propertyData instanceof FormData) {
    body = propertyData;
  } else {
    body = JSON.stringify(propertyData);
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${API_BASE_URL}/houseDetail/${id}`, {
    method: 'PUT',
    headers: headers,
    body: body,
  });
  if (!response.ok) throw new Error('Failed to update property');
  return response.json();
};
