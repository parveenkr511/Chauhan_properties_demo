import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      setFormStatus('idle');
    }
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-navy py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Get in <span className="text-emerald">Touch</span>
          </motion.h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Have questions about a property or want to discuss an investment? Our team is here to help you 24/7.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-navy/5 p-10 rounded-[40px] space-y-8">
                <h3 className="text-2xl font-bold text-navy">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="text-emerald" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy/40 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="text-lg font-bold text-navy">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="text-emerald" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy/40 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="text-lg font-bold text-navy">info@luxeestate.in</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="text-emerald" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy/40 uppercase tracking-widest mb-1">Visit Us</p>
                      <p className="text-lg font-bold text-navy">123 Business Hub, BKC, Mumbai, Maharashtra 400051</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock className="text-emerald" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy/40 uppercase tracking-widest mb-1">Working Hours</p>
                      <p className="text-lg font-bold text-navy">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-navy/10">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                  >
                    <MessageCircle size={20} /> WhatsApp Support
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-navy/5">
                <h3 className="text-3xl font-display font-bold text-navy mb-8">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/60 uppercase tracking-wider ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/60 uppercase tracking-wider ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/60 uppercase tracking-wider ml-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-navy/60 uppercase tracking-wider ml-1">Subject</label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20 transition-all"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-navy/60 uppercase tracking-wider ml-1">Your Message</label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-navy/5 rounded-2xl outline-none focus:ring-2 ring-emerald/20 transition-all resize-none"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full md:w-auto btn-primary py-5 px-12 text-lg flex items-center justify-center gap-3"
                    >
                      {formStatus === 'submitting' ? 'Sending...' : (
                        <>
                          <Send size={20} /> Send Message
                        </>
                      )}
                    </button>
                    {formStatus === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald font-bold mt-4 text-center md:text-left"
                      >
                        Message sent successfully! We will get back to you shortly.
                      </motion.p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[500px] w-full bg-navy/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="text-emerald mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-navy">Interactive Map Location</h3>
            <p className="text-navy/60">BKC Business Hub, Mumbai</p>
          </div>
        </div>
        {/* In a real app, you would embed a Google Map here */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.796324204581!2d72.8644558!3d19.0726887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123f8d27d%3A0x7ef0cf7f329547d7!2sBandra%20Kurla%20Complex%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1646635200000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        ></iframe>
      </section>
    </div>
  );
}
