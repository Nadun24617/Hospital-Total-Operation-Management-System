import React from 'react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-r from-blue-50 to-green-50 mt-10">
    <Separator />
    <div className="py-8 px-4 text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="font-bold text-xl text-blue-800 tracking-wide">ABC Hospital</span>
          </div>
          <div className="text-gray-600">123 Health Avenue, City, Country</div>
          <div className="text-gray-600">Phone: <a href="tel:+12345678900" className="text-blue-600 hover:underline">+1 (234) 567-8900</a></div>
          <div className="text-gray-600">Email: <a href="mailto:info@abchospital.com" className="text-blue-600 hover:underline">info@abchospital.com</a></div>
          <div className="text-red-500 font-semibold mt-1">Emergency Hotline: 1990</div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-4">
            <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0"/></svg> Facebook</a>
            <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161c-.542.929-.855 2.01-.855 3.17 0 2.188 1.115 4.118 2.823 5.254a4.904 4.904 0 01-2.229-.616c-.054 1.98 1.388 3.837 3.444 4.255a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.418A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.212c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z"/></svg> Twitter</a>
            <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.093-1.272 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.292 2.394 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.394-.292 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.292-2.394-1.272-3.374-.98-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0z"/><circle cx="12" cy="12" r="3.5"/></svg> Instagram</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition">Terms of Service</a>
          </div>
          <div className="text-xs text-gray-400 mt-2">&copy; {new Date().getFullYear()} ABC Hospital. All rights reserved.</div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
