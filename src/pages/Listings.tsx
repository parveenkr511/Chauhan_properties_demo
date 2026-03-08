import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, Search, X } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { propertyService } from '../services/propertyService';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
  });

  useEffect(() => {
    setLoading(true);
    propertyService.getProperties(filters)
      .then(data => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[ListingsPage] Error loading properties:', err);
        setProperties([]);
        setLoading(false);
      });
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSearchParams(prev => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      return prev;
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-navy/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-navy/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-navy">Filters</h3>
                <Filter size={20} className="text-emerald" />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-navy/60 mb-2 uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                    <input
                      type="text"
                      placeholder="Search city..."
                      className="w-full pl-10 pr-4 py-3 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20 transition-all"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy/60 mb-2 uppercase tracking-wider">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20 appearance-none"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy/60 mb-2 uppercase tracking-wider">Property Type</label>
                  <div className="space-y-2">
                    {['Apartment', 'Villa', 'Plot', 'Commercial'].map((type) => (
                      <label key={type} className="flex items-center group cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          className="hidden"
                          checked={filters.type === type}
                          onChange={() => handleFilterChange('type', type)}
                        />
                        <div className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${
                          filters.type === type ? 'bg-emerald border-emerald' : 'border-navy/20 group-hover:border-emerald'
                        }`}>
                          {filters.type === type && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className={`font-medium ${filters.type === type ? 'text-navy' : 'text-navy/60'}`}>{type}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => handleFilterChange('type', '')}
                      className="text-xs text-emerald font-bold hover:underline mt-2"
                    >
                      Clear Type
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-display font-bold text-navy">
                {properties.length} Properties Found
              </h1>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 btn-outline py-2 px-4 text-sm"
              >
                <Filter size={18} /> Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-[450px] animate-pulse" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-navy/20" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">No Properties Found</h3>
                <p className="text-navy/60 mb-8">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={() => setFilters({ type: '', category: '', location: '' })}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-navy">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-navy/40">
                <X size={24} />
              </button>
            </div>
            {/* Same filter content as sidebar */}
            <div className="space-y-8">
              {/* ... (repeat filter sections for mobile) */}
              <div>
                <label className="block text-sm font-bold text-navy/60 mb-2 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  placeholder="Search city..."
                  className="w-full px-4 py-3 bg-navy/5 rounded-xl outline-none"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy/60 mb-2 uppercase tracking-wider">Category</label>
                <select
                  className="w-full px-4 py-3 bg-navy/5 rounded-xl outline-none"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full btn-primary mt-8"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
