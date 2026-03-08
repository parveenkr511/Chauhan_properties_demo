import { Property } from '../types';
import { DUMMY_PROPERTIES } from '../data/mockData';

export const propertyService = {
  async getProperties(filters?: { type?: string; category?: string; location?: string }): Promise<Property[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds for slow cold starts

    try {
      console.log('[PropertyService] Fetching properties...', filters || 'all');
      const query = new URLSearchParams(filters as any).toString();
      const response = await fetch(`/api/properties?${query}`, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`[PropertyService] API returned ${response.status}, falling back to dummy data`);
        return this.getFilteredDummyData(filters);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn('[PropertyService] API returned non-JSON response, falling back to dummy data');
        return this.getFilteredDummyData(filters);
      }

      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log('[PropertyService] API returned empty or invalid data, using dummy data');
        return this.getFilteredDummyData(filters);
      }
      
      console.log(`[PropertyService] Successfully fetched ${data.length} properties from API`);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn('[PropertyService] Fetch timed out after 10s, falling back to dummy data');
      } else {
        console.error('[PropertyService] Fetch error:', error.message);
      }
      return this.getFilteredDummyData(filters);
    }
  },

  async getPropertyById(id: string | number): Promise<Property | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log(`[PropertyService] Fetching property ${id}...`);
      const response = await fetch(`/api/properties/${id}`, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[PropertyService] API returned ${response.status} for property ${id}, checking dummy data`);
        return DUMMY_PROPERTIES.find(p => p.id === Number(id)) || null;
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn('[PropertyService] API returned non-JSON response, checking dummy data');
        return DUMMY_PROPERTIES.find(p => p.id === Number(id)) || null;
      }

      const data = await response.json();
      console.log(`[PropertyService] Successfully fetched property ${id} from API`);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.warn(`[PropertyService] API error for property ${id}:`, error.message);
      return DUMMY_PROPERTIES.find(p => p.id === Number(id)) || null;
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
