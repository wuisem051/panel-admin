import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { ALL_GAMES } from '../data/mockData';
import { useSiteSettings } from '../context/SiteContext';
import { translations } from '../data/translations';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { siteName, language } = useSiteSettings();
  const t = translations[language] || translations['en'];

  const navigation = [
    { name: t.header.home, href: '/' },
    { name: t.header.games, href: '/games' },
    { name: t.header.apps, href: '/apps' },
    { name: t.header.categories, href: '/categories' }
  ];

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = ALL_GAMES.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (id: string) => {
    navigate(`/game/${id}`);
    setSearchQuery('');
    setShowResults(false);
    setIsMenuOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-white border-b border-slate-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-slate-800 uppercase tracking-tight">{siteName}</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? 'text-purple-600 bg-purple-50 translate-y-[-1px]'
                  : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
                placeholder={t.header.searchPlaceholder}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all focus:w-80"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t.header.searchResults}
                  </div>
                  {searchResults.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleResultClick(game.id)}
                      className="w-full flex items-center p-3 hover:bg-purple-50 transition-colors text-left group"
                    >
                      <img src={game.image} alt={game.title} className="w-10 h-10 rounded-lg object-cover mr-3 shadow-sm" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">{game.title}</div>
                        <div className="text-xs text-slate-500">{game.category}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-purple-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200 animate-in slide-in-from-top-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.href)
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {showResults && searchResults.length > 0 && (
                    <div className="mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                      {searchResults.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => handleResultClick(game.id)}
                          className="w-full flex items-center p-3 hover:bg-purple-50 transition-colors text-left"
                        >
                          <img src={game.image} alt={game.title} className="w-8 h-8 rounded object-cover mr-3" />
                          <span className="text-sm font-medium text-slate-800">{game.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
