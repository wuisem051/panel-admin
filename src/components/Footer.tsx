import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { translations } from '../data/translations';

export default function Footer() {
  const { footerText, language } = useSiteSettings();
  const t = translations[language] || translations['en'];

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold text-white uppercase tracking-tight">APKVault</span>
            </div>
            <p className="text-slate-400 text-sm">
              {t.footer.trustedSource}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">{t.header.home}</Link></li>
              <li><Link to="/games" className="hover:text-purple-400 transition-colors">{t.header.games}</Link></li>
              <li><Link to="/apps" className="hover:text-purple-400 transition-colors">{t.header.apps}</Link></li>
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">{t.footer.about}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.legal}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/p/privacy" className="hover:text-purple-400 transition-colors">{t.footer.privacy}</Link></li>
              <li><Link to="/p/terms" className="hover:text-purple-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link to="/p/dmca" className="hover:text-purple-400 transition-colors">{t.footer.dmca}</Link></li>
              <li><Link to="/p/contact" className="hover:text-purple-400 transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.connect}</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors text-white">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center sm:flex sm:justify-between sm:text-left">
          <p className="text-slate-400 text-sm">
            {footerText}
          </p>
          <div className="mt-4 sm:mt-0">
            <p className="text-slate-500 text-xs">
              {t.footer.designedWith} <span className="text-red-500">♥</span> {t.footer.forUsers}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}