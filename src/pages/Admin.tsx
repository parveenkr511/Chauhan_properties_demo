import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LayoutDashboard, LogOut, Key, Image as ImageIcon, MapPin, Tag, Home, Maximize, BedDouble } from 'lucide-react';
import { Property } from '../types';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'Apartment',
    category: 'Residential',
    bhk: 0,
    size: '',
    images: '', // Comma separated
    amenities: '', // Comma separated
    featured: 0
  });

  useEffect(() => {
    if (isLoggedIn) fetchProperties();
  }, [isLoggedIn]);

  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    const data = await res.json();
    setProperties(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check. 
    // For this demo, we'll use a simple state check.
    // The server will still validate the password on every POST/DELETE.
    setIsLoggedIn(true);
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...newProperty,
      password,
      images: newProperty.images.split(',').map(s => s.trim()),
      amenities: newProperty.amenities.split(',').map(s => s.trim()),
      featured: Number(newProperty.featured)
    };

    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert('Property added successfully!');
      setNewProperty({
        title: '', description: '', price: '', location: '',
        type: 'Apartment', category: 'Residential', bhk: 0, size: '',
        images: '', amenities: '', featured: 0
      });
      fetchProperties();
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (res.ok) {
      fetchProperties();
    } else {
      alert('Error deleting property. Check your password.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-40 bg-navy/5 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full border border-navy/5"
        >
          <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Key className="text-emerald" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-navy text-center mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-navy/40 uppercase tracking-widest mb-2 ml-1">Admin Password</label>
              <input
                type="password"
                required
                className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full btn-primary py-5 text-lg">
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-navy/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-navy">Property Management</h1>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-navy/40 font-bold hover:text-red-500 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-navy/5 sticky top-24">
              <h3 className="text-2xl font-bold text-navy mb-8 flex items-center gap-2">
                <Plus className="text-emerald" /> Add New Project
              </h3>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <input
                  type="text" placeholder="Project Title" required
                  className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                  value={newProperty.title}
                  onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                />
                <textarea
                  placeholder="Description" rows={3}
                  className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none resize-none"
                  value={newProperty.description}
                  onChange={e => setNewProperty({...newProperty, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text" placeholder="Price (e.g. ₹1.2 Cr)" required
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.price}
                    onChange={e => setNewProperty({...newProperty, price: e.target.value})}
                  />
                  <input
                    type="text" placeholder="Location" required
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.location}
                    onChange={e => setNewProperty({...newProperty, location: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.type}
                    onChange={e => setNewProperty({...newProperty, type: e.target.value})}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Plot</option>
                    <option>Commercial</option>
                  </select>
                  <select
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.category}
                    onChange={e => setNewProperty({...newProperty, category: e.target.value})}
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number" placeholder="BHK"
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.bhk}
                    onChange={e => setNewProperty({...newProperty, bhk: Number(e.target.value)})}
                  />
                  <input
                    type="text" placeholder="Size (e.g. 1800 sqft)"
                    className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                    value={newProperty.size}
                    onChange={e => setNewProperty({...newProperty, size: e.target.value})}
                  />
                </div>
                <input
                  type="text" placeholder="Image URLs (comma separated)"
                  className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                  value={newProperty.images}
                  onChange={e => setNewProperty({...newProperty, images: e.target.value})}
                />
                <input
                  type="text" placeholder="Amenities (comma separated)"
                  className="w-full px-5 py-3 bg-navy/5 rounded-xl outline-none"
                  value={newProperty.amenities}
                  onChange={e => setNewProperty({...newProperty, amenities: e.target.value})}
                />
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={newProperty.featured === 1}
                    onChange={e => setNewProperty({...newProperty, featured: e.target.checked ? 1 : 0})}
                  />
                  <span className="text-sm font-bold text-navy/60">Mark as Featured</span>
                </label>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-4"
                >
                  {loading ? 'Adding...' : 'Publish Project'}
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-6">
            {properties.map(prop => (
              <div key={prop.id} className="bg-white p-6 rounded-3xl shadow-sm border border-navy/5 flex flex-col md:flex-row gap-6 items-center">
                <img 
                  src={prop.images[0]} 
                  className="w-32 h-32 rounded-2xl object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-bold text-navy">{prop.title}</h4>
                  <p className="text-navy/40 text-sm mb-2">{prop.location}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-navy/60">
                    <span className="flex items-center gap-1"><Tag size={14} className="text-emerald" /> {prop.price}</span>
                    <span className="flex items-center gap-1"><Home size={14} className="text-emerald" /> {prop.type}</span>
                    <span className="flex items-center gap-1"><Maximize size={14} className="text-emerald" /> {prop.size}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(prop.id)}
                  className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
