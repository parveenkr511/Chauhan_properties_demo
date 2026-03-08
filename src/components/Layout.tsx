import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-navy/90 backdrop-blur-md text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">C</span>
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Chauhan Properties</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald ${
                  location.pathname === link.path ? 'text-emerald' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://wa.me/919818389758" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary py-2 px-5 text-sm"
            >
              Enquire Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-white/80 hover:text-emerald hover:bg-white/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/919818389758"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary mt-4"
              >
                Enquire Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">C</span>
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">Chauhan Properties</span>
            </Link>
            <p className="text-white/60 leading-relaxed">
              Premium real estate solutions for discerning clients. We specialize in luxury residential and high-yield commercial properties across Gurugram.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link to="/" className="hover:text-emerald transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-emerald transition-colors">Properties</Link></li>
              <li><Link to="/about" className="hover:text-emerald transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-emerald transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Property Types</h4>
            <ul className="space-y-4 text-white/60">
              <li><Link to="/properties?type=Apartment" className="hover:text-emerald transition-colors">Apartments</Link></li>
              <li><Link to="/properties?type=Villa" className="hover:text-emerald transition-colors">Villas</Link></li>
              <li><Link to="/properties?type=Commercial" className="hover:text-emerald transition-colors">Commercial</Link></li>
              <li><Link to="/properties?type=Plot" className="hover:text-emerald transition-colors">Plots</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-emerald shrink-0" />
                <span>Shop No.1, Tulip Purple, Darbaripur Rd, Sector 69, Gurugram, Haryana 122103</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-emerald shrink-0" />
                <span>+91 9818389758</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-emerald shrink-0" />
                <span>info@chauhanproperties.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Chauhan Properties. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
