export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  type: 'apartment' | 'house' | 'studio';
  featured?: boolean;
}
