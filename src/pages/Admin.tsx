import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LayoutDashboard, LogOut, Key, Image as ImageIcon, MapPin, Tag, Home, Maximize, BedDouble, MessageSquare, User, Mail as MailIcon, Phone as PhoneIcon } from 'lucide-react';
import { Property, Inquiry } from '../types';
import { propertyService } from '../services/propertyService';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'properties' | 'messages'>('properties');
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
    if (isLoggedIn) {
      fetchProperties();
      fetchInquiries();
    }
  }, [isLoggedIn]);

  const fetchProperties = async () => {
    const data = await propertyService.getProperties();
    setProperties(data);
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setLoginError('Invalid admin password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setLoginError('Connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
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
      alert(`Error: ${err.error}${err.message ? ` - ${err.message}` : ''}`);
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
                className={`w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 transition-all ${
                  loginError ? 'ring-red-500/20 border border-red-500/50' : 'ring-emerald/20'
                }`}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError('');
                }}
              />
              {loginError && (
                <p className="text-red-500 text-xs font-bold mt-2 ml-1">{loginError}</p>
              )}
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-navy/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald/20">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-3xl font-display font-bold text-navy">Admin Panel</h1>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-navy/5 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'properties' ? 'bg-navy text-white shadow-lg' : 'text-navy/40 hover:text-navy'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                  activeTab === 'messages' ? 'bg-navy text-white shadow-lg' : 'text-navy/40 hover:text-navy'
                }`}
              >
                Messages {inquiries.length > 0 && (
                  <span className="bg-emerald text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-navy/40 font-bold hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {activeTab === 'properties' ? (
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
        ) : (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="bg-white p-20 rounded-[40px] text-center border border-navy/5">
                <MessageSquare size={48} className="text-navy/10 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy">No messages yet</h3>
                <p className="text-navy/40">Inquiries from the contact form will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inquiries.map((msg, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-navy/5 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center">
                          <User className="text-navy/40" size={24} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-navy">{msg.name}</h4>
                          <p className="text-sm text-navy/40">{new Date(msg.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="bg-emerald/10 text-emerald text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        New Inquiry
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-navy/5">
                      <div className="flex items-center gap-2 text-navy/60">
                        <MailIcon size={16} className="text-emerald" />
                        <span className="text-sm font-medium truncate">{msg.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-navy/60">
                        <PhoneIcon size={16} className="text-emerald" />
                        <span className="text-sm font-medium">{msg.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Subject</p>
                      <p className="font-bold text-navy">{msg.subject || 'Property Inquiry'}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">Message</p>
                      <p className="text-navy/70 leading-relaxed">{msg.message}</p>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <a 
                        href={`mailto:${msg.email}`}
                        className="flex-1 py-3 bg-navy text-white rounded-xl font-bold text-center hover:opacity-90 transition-all"
                      >
                        Reply via Email
                      </a>
                      <a 
                        href={`https://wa.me/91${msg.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold text-center hover:opacity-90 transition-all"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
