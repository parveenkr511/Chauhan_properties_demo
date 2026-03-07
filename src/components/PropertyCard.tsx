import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Maximize, BedDouble, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-navy/5 group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-emerald text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {property.category}
          </span>
          {property.featured === 1 && (
            <span className="bg-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl flex justify-between items-center">
            <span className="text-navy font-bold text-lg">{property.price}</span>
            <span className="text-navy/60 text-xs font-medium uppercase">{property.type}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-navy mb-2 group-hover:text-emerald transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center text-navy/60 text-sm mb-4">
          <MapPin size={16} className="mr-1 text-emerald" />
          {property.location}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-navy/5">
          <div className="flex items-center text-navy/70 text-sm">
            <BedDouble size={18} className="mr-2 text-emerald" />
            {property.bhk > 0 ? `${property.bhk} BHK` : 'N/A'}
          </div>
          <div className="flex items-center text-navy/70 text-sm">
            <Maximize size={18} className="mr-2 text-emerald" />
            {property.size}
          </div>
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="flex items-center justify-center w-full py-3 text-emerald font-bold border-2 border-emerald rounded-xl hover:bg-emerald hover:text-white transition-all"
        >
          View Details
          <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </motion.div>
  );
};
