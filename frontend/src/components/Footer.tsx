import React from 'react';
import { Heart, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => (
  <footer className="mt-auto bg-white border-t border-border">
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand + About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">ABC Hospital</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Providing compassionate, world-class healthcare to our community since 1985. Your health is our priority.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2.5">
            {['About Us', 'Our Doctors', 'Appointments', 'Privacy Policy', 'Terms of Service'].map(link => (
              <li key={link}>
                <a href="#" className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">123 Health Avenue, City, Country</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href="tel:+12345678900" className="text-sm text-muted-foreground hover:text-primary transition-colors">+1 (234) 567-8900</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href="mailto:info@abchospital.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@abchospital.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">Mon – Sat: 8:00 AM – 8:00 PM</span>
            </li>
          </ul>
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">Emergency Hotline: 1990</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Separator />

    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ABC Hospital. All rights reserved.</p>
      <p className="text-xs text-muted-foreground">Designed with care for better healthcare.</p>
    </div>
  </footer>
);

export default Footer;
