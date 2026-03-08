import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Home, Building2, Palmtree, Map, ArrowRight, Star, ShieldCheck, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { propertyService } from '../services/propertyService';

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    propertyService.getProperties()
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProperties(data.filter((p: Property) => p.featured === 1));
        } else {
          console.error('[HomePage] Received non-array data for properties:', data);
          setFeaturedProperties([]);
        }
      })
      .catch(err => {
        console.error('[HomePage] Error loading properties:', err);
        setFeaturedProperties([]);
      });
  }, []);

  const categories = [
    { name: 'Apartments', icon: Home, count: '120+', type: 'Apartment' },
    { name: 'Villas', icon: Palmtree, count: '45+', type: 'Villa' },
    { name: 'Commercial', icon: Building2, count: '80+', type: 'Commercial' },
    { name: 'Plots', icon: Map, count: '60+', type: 'Plot' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/properties?location=${searchQuery}`);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Home"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Find Your <span className="text-emerald">Dream Space</span> <br /> in India's Prime Locations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
          >
            Discover handpicked residential and commercial properties that define luxury and high returns.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-[#111827]/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 border border-white/10"
          >
            <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
              <Search className="text-emerald mr-3" size={24} />
              <input
                type="text"
                placeholder="Enter location, city or project..."
                className="w-full outline-none text-white placeholder:text-white/40 font-medium bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3">
              <Home className="text-emerald mr-3" size={24} />
              <select className="w-full outline-none text-white font-medium bg-transparent [&>option]:text-black">
                <option>Property Type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Commercial</option>
              </select>
            </div>
            <button type="submit" className="btn-primary py-4 px-10 rounded-xl">
              Search Now
            </button>
          </motion.form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-to-b from-[#0a0e1a] to-[#05070a] relative overflow-hidden">
        {/* Decorative background blobs for depth */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Explore by Category</h2>
            <p className="text-white/50 text-lg">Find the perfect property type that suits your lifestyle or business needs.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/properties?type=${cat.type}`}
                className="group p-8 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 hover:bg-emerald/10 hover:border-emerald/50 transition-all duration-500 text-center shadow-2xl flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-[#111827] rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:bg-emerald transition-all duration-500 border border-white/10">
                  <cat.icon className="text-emerald group-hover:text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-white/40 group-hover:text-white/70 font-medium">{cat.count} Properties</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-navy/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="text-navy/60">Our most exclusive and high-demand properties currently available.</p>
            </div>
            <Link to="/properties" className="flex items-center text-emerald font-bold hover:underline">
              View All Properties <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Modern Office"
                className="rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-emerald p-8 rounded-3xl shadow-xl hidden md:block">
                <p className="text-4xl font-bold text-white mb-1">15+</p>
                <p className="text-white/80 font-medium">Years of Excellence</p>
              </div>
            </div>
            <div>
              <h2 className="section-title mb-8">Why LuxeEstate is Your Best Partner</h2>
              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: 'Verified Properties', desc: 'Every listing on our platform undergoes a rigorous 50-point verification process.' },
                  { icon: Clock, title: 'Zero Brokerage', desc: 'We connect you directly with developers and owners, saving you lakhs in commissions.' },
                  { icon: Users, title: 'Expert Guidance', desc: 'Our team of real estate veterans provides personalized investment advice.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 bg-emerald/10 rounded-2xl flex items-center justify-center shrink-0">
                      <item.icon className="text-emerald" size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-navy mb-2">{item.title}</h4>
                      <p className="text-navy/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What Our Clients Say</h2>
            <p className="text-white/60">Trusted by thousands of homeowners and investors across India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul Sharma', role: 'Investor', content: 'LuxeEstate helped me find a high-yield commercial property in Gurgaon. Their market analysis was spot on.', rating: 5 },
              { name: 'Priya Verma', role: 'Homeowner', content: 'The process of buying our first villa was so smooth. No hidden charges and complete transparency.', rating: 5 },
              { name: 'Amit Patel', role: 'Business Owner', content: 'Found the perfect office space for my startup. The team was extremely professional and helpful.', rating: 4 },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} className="fill-emerald text-emerald" />)}
                </div>
                <p className="text-lg text-white/80 italic mb-8">"{t.content}"</p>
                <div>
                  <p className="font-bold text-white">{t.name}</p>
                  <p className="text-white/40 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
