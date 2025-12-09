export const createProperty = async (propertyData: any) => {
  const response = await fetch('http://localhost:3000/api/houseDetail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) throw new Error('Failed to create property');
  return response.json();
};