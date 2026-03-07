export interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  type: 'Apartment' | 'Villa' | 'Plot' | 'Commercial';
  category: 'Residential' | 'Commercial';
  bhk: number;
  size: string;
  status: string;
  images: string[];
  amenities: string[];
  featured: number;
}

export interface Inquiry {
  property_id?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}
