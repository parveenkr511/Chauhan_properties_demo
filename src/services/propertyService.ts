import { Property } from '../types';
import { DUMMY_PROPERTIES } from '../data/mockData';

export const propertyService = {
  async getProperties(filters?: { type?: string; category?: string; location?: string }): Promise<Property[]> {
    try {
      const query = new URLSearchParams(filters as any).toString();
      const response = await fetch(`/api/properties?${query}`);
      
      if (!response.ok) throw new Error('API not available');
      
      const data = await response.json();
      
      // If API returns empty array, fallback to dummy data
      if (Array.isArray(data) && data.length === 0) {
        return this.getFilteredDummyData(filters);
      }
      
      return data;
    } catch (error) {
      console.warn('Backend API not reachable, falling back to dummy data');
      return this.getFilteredDummyData(filters);
    }
  },

  async getPropertyById(id: string | number): Promise<Property | null> {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) throw new Error('Property not found');
      return await response.json();
    } catch (error) {
      console.warn('Backend API not reachable, searching in dummy data');
      const prop = DUMMY_PROPERTIES.find(p => p.id === Number(id));
      return prop || null;
    }
  },

  getFilteredDummyData(filters?: { type?: string; category?: string; location?: string }): Property[] {
    let filtered = [...DUMMY_PROPERTIES];
    if (filters?.type) filtered = filtered.filter(p => p.type === filters.type);
    if (filters?.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(p => p.location.toLowerCase().includes(loc) || p.title.toLowerCase().includes(loc));
    }
    return filtered;
  }
};
