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
  const [uploading, setUploading] = useState(false);
  
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
      images: newProperty.images.split(',').filter(s => s.trim()).map(s => s.trim()),
      amenities: newProperty.amenities.split(',').filter(s => s.trim()).map(s => s.trim()),
      featured: Number(newProperty.featured)
    };

    if (payload.images.length === 0) {
      alert('Please add at least one image URL or upload an image.');
      setLoading(false);
      return;
    }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const { url } = await res.json();
        const currentImages = newProperty.images ? newProperty.images + ', ' + url : url;
        setNewProperty({ ...newProperty, images: currentImages });
      } else {
        const err = await res.json();
        alert(`Upload Error: ${err.message || err.error}`);
      }
    } catch (err) {
      alert('Failed to upload image. Check your connection.');
    } finally {
      setUploading(false);
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
    <div className="pt-24 min-h-screen bg-[#0a0e1a]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald/20">
                <LayoutDashboard size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">Admin Console</h1>
                <p className="text-white/50 text-sm font-medium">Manage your real estate portfolio</p>
              </div>
            </div>
            
            <div className="flex bg-[#111827] p-1.5 rounded-2xl shadow-sm border border-white/10 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('properties')}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all duration-200 ${
                  activeTab === 'properties' ? 'bg-emerald text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 ${
                  activeTab === 'messages' ? 'bg-emerald text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                Inquiries {inquiries.length > 0 && (
                  <span className="bg-white text-emerald text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 text-white/40 font-bold hover:text-red-500 transition-all px-5 py-3 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {activeTab === 'properties' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Add Form */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-[#111827] p-8 rounded-[32px] shadow-2xl border border-white/10 sticky top-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-emerald/20 rounded-xl flex items-center justify-center">
                    <Plus className="text-emerald" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Add New Project</h3>
                </div>
                
                <form onSubmit={handleAddProperty} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Project Title</label>
                    <input
                      type="text" placeholder="e.g. Skyview Residency" required
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                      value={newProperty.title}
                      onChange={e => setNewProperty({...newProperty, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Description</label>
                    <textarea
                      placeholder="Describe the property highlights..." rows={3}
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all resize-none placeholder:text-white/20"
                      value={newProperty.description}
                      onChange={e => setNewProperty({...newProperty, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Price</label>
                      <input
                        type="text" placeholder="₹1.2 Cr" required
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                        value={newProperty.price}
                        onChange={e => setNewProperty({...newProperty, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Location</label>
                      <input
                        type="text" placeholder="Sector 42, GGN" required
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                        value={newProperty.location}
                        onChange={e => setNewProperty({...newProperty, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Type</label>
                      <select
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                        value={newProperty.type}
                        onChange={e => setNewProperty({...newProperty, type: e.target.value})}
                      >
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>Plot</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Category</label>
                      <select
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all appearance-none cursor-pointer [&>option]:bg-[#111827]"
                        value={newProperty.category}
                        onChange={e => setNewProperty({...newProperty, category: e.target.value})}
                      >
                        <option>Residential</option>
                        <option>Commercial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">BHK</label>
                      <input
                        type="number" placeholder="3"
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                        value={newProperty.bhk}
                        onChange={e => setNewProperty({...newProperty, bhk: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Size</label>
                      <input
                        type="text" placeholder="1800 sqft"
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                        value={newProperty.size}
                        onChange={e => setNewProperty({...newProperty, size: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Project Images</label>
                    <div className="flex flex-col gap-3">
                      <label className="cursor-pointer group">
                        <div className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald text-white rounded-xl font-bold shadow-lg shadow-emerald/20 hover:bg-emerald-dark transition-all">
                          <ImageIcon size={18} />
                          {uploading ? 'Uploading...' : 'Upload Image'}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                      <input
                        type="text" placeholder="Or paste image URLs (comma separated)"
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                        value={newProperty.images}
                        onChange={e => setNewProperty({...newProperty, images: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-wider ml-1">Amenities</label>
                    <input
                      type="text" placeholder="Pool, Gym, Parking..."
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald/20 focus:border-emerald transition-all placeholder:text-white/20"
                      value={newProperty.amenities}
                      onChange={e => setNewProperty({...newProperty, amenities: e.target.value})}
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer py-2 group">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${newProperty.featured === 1 ? 'bg-emerald border-emerald' : 'border-white/20 group-hover:border-emerald'}`}>
                      {newProperty.featured === 1 && <Plus size={16} className="text-white rotate-45" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={newProperty.featured === 1}
                      onChange={e => setNewProperty({...newProperty, featured: e.target.checked ? 1 : 0})}
                    />
                    <span className="text-sm font-bold text-white/60">Mark as Featured Project</span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald/20 hover:bg-emerald-dark transition-all disabled:opacity-50"
                  >
                    {loading ? 'Publishing...' : 'Publish Project'}
                  </button>
                </form>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Active Listings ({properties.length})</h3>
              </div>
              
              {properties.length === 0 ? (
                <div className="bg-[#111827] p-20 rounded-[32px] text-center border border-white/10 border-dashed">
                  <Home size={48} className="text-white/10 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white/20">No properties found</h3>
                  <p className="text-white/20 text-sm">Start by adding your first project.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {properties.map(prop => (
                    <div key={prop.id} className="bg-[#111827] p-5 rounded-[32px] shadow-sm border border-white/10 flex flex-col md:flex-row gap-6 items-center group hover:bg-white/5 transition-all">
                      <div className="relative w-full md:w-48 h-40 rounded-2xl overflow-hidden">
                        <img 
                          src={prop.images[0]} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-navy/80 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                          {prop.type}
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">{prop.title}</h4>
                            <div className="flex items-center gap-1.5 text-white/40 text-sm font-medium">
                              <MapPin size={14} />
                              {prop.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald font-bold text-xl">{prop.price}</p>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{prop.size}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <div className="px-3 py-1.5 bg-white/5 rounded-lg flex items-center gap-2 text-xs font-bold text-white/60">
                            <BedDouble size={14} className="text-emerald" /> {prop.bhk} BHK
                          </div>
                          <div className="px-3 py-1.5 bg-white/5 rounded-lg flex items-center gap-2 text-xs font-bold text-white/60">
                            <Tag size={14} className="text-emerald" /> {prop.category}
                          </div>
                          {prop.featured === 1 && (
                            <div className="px-3 py-1.5 bg-emerald/10 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald border border-emerald/10">
                              Featured
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => handleDelete(prop.id)}
                          className="flex-1 md:flex-none p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          title="Delete Property"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Customer Inquiries</h3>
              <div className="px-4 py-2 bg-emerald/20 text-emerald rounded-xl text-sm font-bold border border-emerald/10">
                {inquiries.length} Messages
              </div>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-[#111827] p-24 rounded-[40px] text-center border border-white/10 border-dashed">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare size={32} className="text-white/10" />
                </div>
                <h3 className="text-2xl font-bold text-white/20">No messages yet</h3>
                <p className="text-white/20">Inquiries from the contact form will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inquiries.map((msg, i) => (
                  <div key={i} className="bg-[#111827] p-8 rounded-[40px] shadow-sm border border-white/10 space-y-6 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                          <User className="text-white/40" size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{msg.name}</h4>
                          <p className="text-sm text-white/40 font-medium">{new Date(msg.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <span className="bg-emerald/10 text-emerald text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-emerald/10">
                        New Lead
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-white/10">
                      <div className="flex items-center gap-3 text-white/60">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <MailIcon size={14} className="text-emerald" />
                        </div>
                        <span className="text-sm font-bold truncate">{msg.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/60">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <PhoneIcon size={14} className="text-emerald" />
                        </div>
                        <span className="text-sm font-bold">{msg.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald"></div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Subject</p>
                      </div>
                      <p className="font-bold text-white text-lg">{msg.subject || 'Property Inquiry'}</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Message Content</p>
                      <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                        <p className="text-white/60 leading-relaxed text-sm italic">"{msg.message}"</p>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <a 
                        href={`mailto:${msg.email}`}
                        className="flex-1 py-4 bg-emerald text-white rounded-xl font-bold text-center hover:bg-emerald-dark transition-all shadow-lg shadow-emerald/20"
                      >
                        Reply via Email
                      </a>
                      <a 
                        href={`https://wa.me/91${msg.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-4 bg-[#25D366] text-white rounded-xl font-bold text-center hover:opacity-90 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                      >
                        WhatsApp Lead
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
