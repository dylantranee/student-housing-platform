export const updateProperty = async (id: string, propertyData: any) => {
  let body;
  let headers: Record<string, string> = {};
  if (propertyData instanceof FormData) {
    body = propertyData;
  } else {
    body = JSON.stringify(propertyData);
    headers['Content-Type'] = 'application/json';
  }
  const response = await fetch(`http://localhost:3000/api/houseDetail/${id}`, {
    method: 'PUT',
    headers,
    body,
  });
  if (!response.ok) throw new Error('Failed to update property');
  return response.json();
};