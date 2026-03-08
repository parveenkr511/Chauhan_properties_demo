import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award, Users, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-32 bg-navy text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
            alt=""
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8"
          >
            Redefining <br /> <span className="text-emerald">Real Estate</span> in India
          </motion.h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            Chauhan Properties is a premier real estate consultancy firm dedicated to providing exceptional property solutions. With over 15 years of experience, we have helped thousands of clients find their perfect homes and high-yield investments.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-navy/5 rounded-[40px] space-y-6">
              <div className="w-16 h-16 bg-emerald rounded-2xl flex items-center justify-center shadow-lg shadow-emerald/20">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-navy">Our Mission</h2>
              <p className="text-navy/60 text-lg leading-relaxed">
                To simplify the property buying process by providing transparent, data-driven, and personalized consultancy services that empower our clients to make informed decisions.
              </p>
            </div>
            <div className="p-12 bg-navy rounded-[40px] space-y-6 text-white">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-white/10">
                <Eye size={32} className="text-navy" />
              </div>
              <h2 className="text-3xl font-display font-bold">Our Vision</h2>
              <p className="text-white/60 text-lg leading-relaxed">
                To be India's most trusted real estate platform, known for our integrity, innovation, and commitment to delivering excellence in every transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-emerald">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
            {[
              { label: 'Properties Sold', value: '2,500+' },
              { label: 'Happy Clients', value: '1,800+' },
              { label: 'Cities Covered', value: '12+' },
              { label: 'Years Experience', value: '15+' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-display font-bold mb-2">{stat.value}</p>
                <p className="text-white/70 font-medium uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Core Values</h2>
            <p className="text-navy/60">The principles that guide every interaction and decision we make.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Integrity', desc: 'We believe in complete transparency and honesty in all our dealings.', icon: Award },
              { title: 'Customer First', desc: 'Your goals are our priority. We tailor our services to meet your unique needs.', icon: Users },
              { title: 'Excellence', desc: 'We strive for perfection in every detail, from property selection to documentation.', icon: CheckCircle2 },
            ].map((value, i) => (
              <div key={i} className="text-center space-y-6">
                <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto">
                  <value.icon size={40} className="text-emerald" />
                </div>
                <h3 className="text-2xl font-bold text-navy">{value.title}</h3>
                <p className="text-navy/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
