import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Maximize, BedDouble, CheckCircle2, Phone, Send, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, Inquiry } from '../types';
import { propertyService } from '../services/propertyService';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState<Inquiry>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (id) {
      propertyService.getPropertyById(id)
        .then(data => {
          setProperty(data);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, property_id: Number(id) }),
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      setFormStatus('idle');
    }
  };

  if (loading) return <div className="pt-40 text-center">Loading property details...</div>;
  if (!property) return <div className="pt-40 text-center">Property not found.</div>;

  const whatsappUrl = `https://wa.me/919876543210?text=I'm interested in ${property.title} (${property.location})`;

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Gallery Section */}
      <section className="bg-navy/5 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center text-emerald font-bold mb-8 hover:underline">
            <ChevronLeft size={20} /> Back to Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={property.images[currentImage]}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  onClick={() => setCurrentImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald hover:text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  onClick={() => setCurrentImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald hover:text-white transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {property.images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-32 lg:h-40 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                    currentImage === i ? 'border-emerald shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-emerald/10 text-emerald text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {property.category}
                  </span>
                  <span className="bg-navy/5 text-navy/60 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">{property.title}</h1>
                <div className="flex items-center text-navy/60 text-lg">
                  <MapPin size={24} className="mr-2 text-emerald" />
                  {property.location}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-navy/5 rounded-3xl">
                <div className="space-y-1">
                  <p className="text-navy/40 text-sm font-bold uppercase tracking-wider">Price</p>
                  <p className="text-2xl font-bold text-navy">{property.price}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-navy/40 text-sm font-bold uppercase tracking-wider">Area</p>
                  <div className="flex items-center text-2xl font-bold text-navy">
                    <Maximize size={24} className="mr-2 text-emerald" />
                    {property.size}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-navy/40 text-sm font-bold uppercase tracking-wider">Configuration</p>
                  <div className="flex items-center text-2xl font-bold text-navy">
                    <BedDouble size={24} className="mr-2 text-emerald" />
                    {property.bhk > 0 ? `${property.bhk} BHK` : 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-navy mb-6">Description</h3>
                <p className="text-navy/70 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-navy mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.amenities.map((item, i) => (
                    <div key={i} className="flex items-center text-navy/70">
                      <CheckCircle2 size={20} className="mr-3 text-emerald" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Form */}
            <aside className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-navy/5 sticky top-24">
                <h3 className="text-2xl font-bold text-navy mb-8">Enquire Now</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full px-5 py-4 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-5 py-4 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="w-full px-5 py-4 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-5 py-4 bg-navy/5 rounded-xl outline-none focus:ring-2 ring-emerald/20 resize-none"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : (
                      <>
                        <Send size={18} /> Send Inquiry
                      </>
                    )}
                  </button>
                  {formStatus === 'success' && (
                    <p className="text-emerald text-center font-bold text-sm">Thank you! We'll contact you soon.</p>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-navy/5 space-y-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    <MessageCircle size={20} /> Chat on WhatsApp
                  </a>
                  <a
                    href="tel:+919876543210"
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-navy/10 text-navy rounded-xl font-bold hover:bg-navy hover:text-white transition-all"
                  >
                    <Phone size={20} /> Call Agent
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
