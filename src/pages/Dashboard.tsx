import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdBanner from '../components/AdBanner';
import { Lock, User, Eye, EyeOff, PlusCircle, Trash2, Edit, Check, Download, Globe, Settings as SettingsIcon, Save, TrendingUp } from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { useAnalytics } from '../context/AnalyticsContext';
import type { Game, AppItem } from '../context/ContentContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ ...ADMIN_CREDENTIALS });

  const { siteName, footerText, downloadTimer, adPlacements, homeHero, footerPages, updateSettings, updateAdPlacement, language, headCode, footerCode } = useSiteSettings();
  const { games, apps, addGame, updateGame, deleteGame, addApp, updateApp, deleteApp } = useContent();
  const { logs, clearLogs } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'analytics' | 'tools'>('content');
  const [statsPeriod, setStatsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // UI state
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [gameForm, setGameForm] = useState<Partial<Game>>({});

  const [showAppForm, setShowAppForm] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appForm, setAppForm] = useState<Partial<AppItem>>({});

  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // Settings state
  const [settingsForm, setSettingsForm] = useState<{
    siteName: string;
    footerText: string;
    downloadTimer: number;
    language?: 'en' | 'es';
    headCode?: string;
    footerCode?: string;
  }>({ siteName: '', footerText: '', downloadTimer: 15, language: 'en', headCode: '', footerCode: '' });
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [pagesForm, setPagesForm] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [editingPageSlug, setEditingPageSlug] = useState<string | null>(null);
  const [pageContentForm, setPageContentForm] = useState({ title: '', content: '' });
  const [editingPlacementId, setEditingPlacementId] = useState<string | null>(null);
  const [placementForm, setPlacementForm] = useState<Partial<any>>({});

  useEffect(() => {
    setSettingsForm({ siteName, footerText, downloadTimer, language: language || 'en', headCode, footerCode });
    setHeroForm({ title: homeHero.title, subtitle: homeHero.subtitle });
    setPagesForm([...footerPages]);
  }, [siteName, footerText, downloadTimer, homeHero, footerPages, showSettings, language, headCode, footerCode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === ADMIN_CREDENTIALS.username && credentials.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
    } else {
      alert(`Invalid credentials. Demo credentials are shown below.\nUsername: ${ADMIN_CREDENTIALS.username}\nPassword: ${ADMIN_CREDENTIALS.password}`);
    }
  };

  // Games handlers
  const openNewGameForm = () => {
    setEditingGameId(null);
    setGameForm({
      title: '',
      slug: '',
      description: '',
      image: '',
      rating: 4.0,
      downloads: '',
      size: '',
      category: '',
      version: '',
      developer: '',
      requirements: '',
      releaseDate: '',
      downloadUrl: '',
      sourceUrl: '',
      seoTitle: '',
      metaDescription: '',
      focusKeywords: ''
    });
    setShowGameForm(true);
  };

  const openEditGameForm = (game: Game) => {
    setEditingGameId(game.id);
    setGameForm({ ...game });
    setShowGameForm(true);
  };

  const saveGame = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!gameForm.title || !gameForm.downloadUrl) {
      alert('Please provide at least title and download URL for the game.');
      return;
    }
    if (editingGameId) {
      updateGame({ ...(gameForm as Game), id: editingGameId, slug: gameForm.slug || slugify(gameForm.title || '') });
    } else {
      const title = gameForm.title || '';
      const newGame: Game = {
        title: '',
        slug: gameForm.slug || slugify(title),
        description: '',
        image: '',
        rating: 4.0,
        downloads: '0',
        size: '0MB',
        category: 'Action',
        version: '1.0',
        developer: 'Unknown',
        requirements: 'Android 5.0+',
        downloadUrl: '',
        ...gameForm,
        id: generateId('game-'),
        createdAt: Date.now()
      } as Game;
      addGame(newGame);
    }
    setShowGameForm(false);
    setEditingGameId(null);
    setGameForm({});
  };

  // Apps handlers
  const openNewAppForm = () => {
    setEditingAppId(null);
    setAppForm({
      title: '',
      slug: '',
      description: '',
      image: '',
      rating: 4.0,
      downloads: '0',
      size: '0MB',
      appCategory: 'Tools',
      version: '1.0',
      developer: 'Unknown',
      requirements: 'Android 5.0+',
      releaseDate: '',
      downloadUrl: '',
      seoTitle: '',
      metaDescription: '',
      focusKeywords: ''
    });
    setShowAppForm(true);
  };

  const openEditAppForm = (app: AppItem) => {
    setEditingAppId(app.id);
    setAppForm({ ...app });
    setShowAppForm(true);
  };

  const saveApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appForm.title || !appForm.downloadUrl) {
      alert('Please provide at least title and download URL for the app.');
      return;
    }
    if (editingAppId) {
      updateApp({ ...(appForm as AppItem), id: editingAppId, slug: appForm.slug || slugify(appForm.title || '') });
    } else {
      const title = appForm.title || '';
      const newApp: AppItem = {
        title: '',
        slug: appForm.slug || slugify(title),
        description: '',
        image: '',
        rating: 4.0,
        downloads: '0',
        size: '0MB',
        appCategory: 'Tools',
        version: '1.0',
        developer: 'Unknown',
        requirements: 'Android 5.0+',
        downloadUrl: '',
        ...appForm,
        id: generateId('app-'),
        createdAt: Date.now()
      } as AppItem;
      addApp(newApp);
    }
    setShowAppForm(false);
    setEditingAppId(null);
    setAppForm({});
  };

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    setIsScraping(true);
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(scrapeUrl)}`);
      if (!response.ok) throw new Error('Failed to fetch URL');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
        doc.querySelector('title')?.textContent || '';
      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

      console.log('Scraped Data:', { title, description, image });

      if (!showGameForm && !showAppForm) {
        console.log('Opening new game form with scraped data');
        const slug = slugify(title);
        setGameForm({ title, slug, description, image, sourceUrl: scrapeUrl, downloadUrl: '', seoTitle: title, metaDescription: description });
        setShowGameForm(true);
        alert('Content scraped! Reference link saved. Please add the Direct Download link (Mediafire).');
      } else if (showGameForm) {
        console.log('Updating existing game form with scraped data');
        const slug = gameForm.slug || slugify(title);
        setGameForm(prev => ({ ...prev, title, slug, description, image, sourceUrl: scrapeUrl, seoTitle: title, metaDescription: description }));
        alert('Content scraped successfully! Reference link updated.');
      } else if (showAppForm) {
        console.log('Updating existing app form with scraped data');
        const slug = appForm.slug || slugify(title);
        setAppForm(prev => ({ ...prev, title, slug, description, image, sourceUrl: scrapeUrl, seoTitle: title, metaDescription: description }));
        alert('Content scraped successfully! Reference link updated.');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      alert('Failed to scrape content.');
    } finally {
      setIsScraping(false);
      setScrapeUrl('');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert('Site settings saved successfully!');
    setShowSettings(false);
  };

  // Analytics Helpers
  const getDailyStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayLogs = logs.filter(l => new Date(l.timestamp).toISOString().split('T')[0] === date);
      return {
        label: date,
        visits: dayLogs.filter(l => l.type === 'visit').length,
        downloads: dayLogs.filter(l => l.type === 'download').length
      };
    });
  };

  const getMonthlyStats = () => {
    const months: Record<string, { visits: number; downloads: number }> = {};

    logs.forEach(l => {
      const date = new Date(l.timestamp);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = { visits: 0, downloads: 0 };
      }

      if (l.type === 'visit') months[monthKey].visits++;
      if (l.type === 'download') months[monthKey].downloads++;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, stats]) => ({
        label,
        ...stats
      }))
      .slice(-6); // Last 6 months
  };

  const getWeeklyStats = () => {
    const weeks: Record<string, { visits: number; downloads: number }> = {};
    const today = new Date();

    // Generate keys for last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - (i * 7));
      // Get the Monday of that week
      const monday = new Date(d);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      const key = monday.toISOString().split('T')[0]; // Use Monday's date as key
      if (!weeks[key]) weeks[key] = { visits: 0, downloads: 0 };
    }

    logs.forEach(l => {
      const d = new Date(l.timestamp);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d);
      monday.setDate(diff);
      const key = monday.toISOString().split('T')[0];

      if (weeks[key]) {
        if (l.type === 'visit') weeks[key].visits++;
        if (l.type === 'download') weeks[key].downloads++;
      }
    });

    return Object.entries(weeks)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, stats]) => ({
        label: `Week of ${label}`,
        ...stats
      }));
  };

  const getTopContent = (type: 'view' | 'download' = 'view') => {
    const counts: Record<string, { title: string; count: number }> = {};
    logs.filter(l => l.type === type && l.itemTitle).forEach(l => {
      counts[l.itemTitle!] = {
        title: l.itemTitle!,
        count: (counts[l.itemTitle!]?.count || 0) + 1
      };
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  };

  const getGeoData = () => {
    const countries: Record<string, number> = {};
    logs.filter(l => l.type === 'visit').forEach(l => {
      const c = l.geo.country || 'Unknown';
      countries[c] = (countries[c] || 0) + 1;
    });
    return Object.entries(countries).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  };

  const getDeviceData = () => {
    const os: Record<string, number> = {};
    logs.filter(l => l.type === 'visit').forEach(l => {
      const name = l.device.os || 'Unknown';
      os[name] = (os[name] || 0) + 1;
    });
    return Object.entries(os).map(([name, value]) => ({ name, value }));
  };

  const { isLoading: contentLoading } = useContent();
  const { isLoading: settingsLoading } = useSiteSettings();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-lg border border-slate-300 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Admin Login</h1>
                <p className="text-slate-600">Access the admin panel to manage content</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                  Login to Admin Panel
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Admin Dashboard</h1>
            <p className="text-slate-600">Manage games, apps, and monetization settings</p>
          </div>

          <div className="flex gap-4 mb-8 border-b pb-4 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'content' ? 'border-b-4 border-purple-600 text-purple-600' : 'text-slate-400'}`}
            >
              Content Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'settings' ? 'border-b-4 border-slate-600 text-slate-800' : 'text-slate-400'}`}
            >
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'analytics' ? 'border-b-4 border-orange-600 text-orange-600' : 'text-slate-400'}`}
            >
              Real-time Analytics
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`pb-2 px-4 font-bold text-sm transition-all ${activeTab === 'tools' ? 'border-b-4 border-green-600 text-green-600' : 'text-slate-400'}`}
            >
              Script Tools
            </button>
          </div>

          {(contentLoading || settingsLoading) ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Synchronizing Data...</p>
            </div>
          ) : activeTab === 'content' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Games</h3>
                  <p className="text-3xl font-black text-purple-600">{games.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Apps</h3>
                  <p className="text-3xl font-black text-pink-500">{apps.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Visits</h3>
                  <p className="text-3xl font-black text-blue-500">{logs.filter(l => l.type === 'visit').length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Downloads</h3>
                  <p className="text-3xl font-black text-green-500">
                    {(() => {
                      const parseDownloads = (str: string) => {
                        if (!str) return 0;
                        const lower = str.toLowerCase();
                        if (lower.includes('m')) return parseFloat(lower) * 1000000;
                        if (lower.includes('k')) return parseFloat(lower) * 1000;
                        return parseInt(str.replace(/[^0-9]/g, '')) || 0;
                      };
                      const contentDownloads = [...games, ...apps].reduce((acc, item) => acc + parseDownloads(item.downloads), 0);
                      const sessionDownloads = logs.filter(l => l.type === 'download').length;
                      // Avoid double counting if logs are already updating content items (which simplified logic assumes no for now)
                      // For now, let's just show the content aggregate as it's "All Time" implied by the fields
                      return (contentDownloads + sessionDownloads).toLocaleString();
                    })()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <PlusCircle className="w-6 h-6 text-purple-600" /> Content Portal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-slate-700">Web Scraper Import</h3>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={scrapeUrl}
                        onChange={(e) => setScrapeUrl(e.target.value)}
                        placeholder="Paste URL to import..."
                        className="flex-1 text-sm border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={handleScrape}
                        disabled={isScraping || !scrapeUrl}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                      >
                        {isScraping ? 'WAIT...' : 'IMPORT'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={openNewGameForm} className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-3 transition-all">
                      <PlusCircle className="w-5 h-5" /> Game
                    </button>
                    <button onClick={openNewAppForm} className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-3 transition-all">
                      <PlusCircle className="w-5 h-5" /> App
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-purple-600" /> Manage Games
                  </h3>
                  <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                    {games.map(g => (
                      <li key={g.id} className="py-3 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <img src={g.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-800">{g.title}</p>
                            <p className="text-[10px] font-black text-purple-500 uppercase">{g.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditGameForm(g)}><Edit className="w-4 h-4 text-slate-600" /></button>
                          <button onClick={() => deleteGame(g.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-pink-500" /> Manage Apps
                  </h3>
                  <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                    {apps.map(a => (
                      <li key={a.id} className="py-3 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                          <img src={a.image} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                          <div>
                            <p className="font-bold text-slate-800">{a.title}</p>
                            <p className="text-[10px] font-black text-pink-500 uppercase">{a.appCategory}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditAppForm(a)}><Edit className="w-4 h-4 text-slate-600" /></button>
                          <button onClick={() => deleteApp(a.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-slate-400" /> Ad Inventory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adPlacements && Object.values(adPlacements).map((p: any) => (
                    <div key={p.id} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{p.name}</span>
                          <span className={`text-[10px] font-black uppercase ${p.active ? 'text-green-500' : 'text-slate-400'}`}>
                            {p.active ? 'Online' : 'Paused'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPlacementId(p.id);
                              setPlacementForm({ ...p });
                            }}
                            className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-purple-600 transition-colors"
                            title="Configure Ad"
                          >
                            <SettingsIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const active = !p.active;
                              updateAdPlacement(p.id, { active });
                              alert(`Ad ${active ? 'Enabled' : 'Disabled'}`);
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${p.active ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-400'}`}
                            title={p.active ? 'Deactivate' : 'Activate'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-200/50 rounded-lg px-3 py-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>Type</span>
                          <span className="text-slate-700">{p.type}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mt-1">
                          <span>Value</span>
                          <span className="text-slate-700 truncate max-w-[120px]">{p.value || 'None'}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mt-1 border-t border-slate-300/50 pt-1">
                          <span>Size</span>
                          <span className="text-purple-600">{p.width} x {p.height}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-indigo-600" /> Site Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Name</label>
                      <input value={settingsForm.siteName} onChange={e => setSettingsForm({ ...settingsForm, siteName: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Footer Text</label>
                      <input value={settingsForm.footerText} onChange={e => setSettingsForm({ ...settingsForm, footerText: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Download Timer (sec)</label>
                      <input type="number" value={settingsForm.downloadTimer} onChange={e => setSettingsForm({ ...settingsForm, downloadTimer: parseInt(e.target.value) })} className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Language</label>
                      <select
                        value={settingsForm.language || 'en'}
                        onChange={e => setSettingsForm({ ...settingsForm, language: e.target.value as 'en' | 'es' })}
                        className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" /> Custom Injections
                      </h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Head Code (Analytics, etc)</label>
                        <textarea
                          value={settingsForm.headCode || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, headCode: e.target.value })}
                          className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-mono text-xs h-32"
                          placeholder="<script>...</script>"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Footer Code (Chat widgets, etc)</label>
                        <textarea
                          value={settingsForm.footerCode || ''}
                          onChange={e => setSettingsForm({ ...settingsForm, footerCode: e.target.value })}
                          className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all font-mono text-xs h-32"
                          placeholder="<script>...</script>"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-slate-200">Save General Settings</button>
                  </form>

                  <div className="space-y-4 border-l pl-8 border-slate-100">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Home Hero Content</h4>
                    <div className="space-y-3">
                      <input value={heroForm.title} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm" placeholder="Hero Title" />
                      <textarea value={heroForm.subtitle} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl font-bold text-sm h-24" placeholder="Hero Subtitle" />
                      <button onClick={() => updateSettings({ homeHero: heroForm })} className="bg-pink-600 text-white px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all hover:bg-pink-700">Update Hero</button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-orange-500" /> Legal Pages Content
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      {footerPages.map(page => (
                        <button key={page.slug} onClick={() => { setEditingPageSlug(page.slug); setPageContentForm({ title: page.title, content: page.content }); }} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${editingPageSlug === page.slug ? 'border-orange-500 bg-orange-50' : 'border-slate-50 bg-slate-50'}`}>
                          <span className="font-bold text-slate-700">{page.title}</span>
                        </button>
                      ))}
                    </div>
                    {editingPageSlug && (
                      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <input value={pageContentForm.title} onChange={e => setPageContentForm({ ...pageContentForm, title: e.target.value })} className="w-full border p-3 rounded-xl font-bold" />
                        <textarea value={pageContentForm.content} onChange={e => setPageContentForm({ ...pageContentForm, content: e.target.value })} className="w-full border p-3 rounded-xl font-mono text-sm h-48" />
                        <button onClick={() => {
                          const newPages = footerPages.map(p => p.slug === editingPageSlug ? { ...p, ...pageContentForm } : p);
                          updateSettings({ footerPages: newPages });
                          setEditingPageSlug(null);
                          alert("Page Updated!");
                        }} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest">Update Resource</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
          }

          {
            activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Traffic & Interaction</h3>
                      <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => setStatsPeriod('daily')}
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${statsPeriod === 'daily' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Daily
                        </button>
                        <button
                          onClick={() => setStatsPeriod('weekly')}
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${statsPeriod === 'weekly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Weekly
                        </button>
                        <button
                          onClick={() => setStatsPeriod('monthly')}
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${statsPeriod === 'monthly' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          Monthly
                        </button>
                      </div>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={statsPeriod === 'daily' ? getDailyStats() : statsPeriod === 'weekly' ? getWeeklyStats() : getMonthlyStats()}>
                          <XAxis dataKey="label" hide />
                          <defs>
                            <linearGradient id="cV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                            <linearGradient id="cD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                          </defs>
                          <Tooltip contentStyle={{ borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#cV)" />
                          <Area type="monotone" dataKey="downloads" stroke="#10b981" fillOpacity={1} fill="url(#cD)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
                    <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4">Device OS Distribution</h3>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={getDeviceData()} innerRadius={50} outerRadius={70} dataKey="value">
                            {getDeviceData().map((_, i) => <Cell key={i} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {getDeviceData().map((d, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{d.name}</p>
                          <p className="text-lg font-black">{d.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-6">Top Viewed Content</h3>
                    <div className="space-y-4">
                      {getTopContent('view').map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors truncate max-w-[80%]">{item.title}</span>
                          <span className="text-xs font-black text-slate-400">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-6">Top Downloaded Content</h3>
                    <div className="space-y-4">
                      {getTopContent('download').map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-green-600 transition-colors truncate max-w-[80%]">{item.title}</span>
                          <span className="text-xs font-black text-slate-400">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-blue-500 opacity-20" />
                    <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm">Geographic Origin</h4>
                      <p className="text-xs text-slate-400 font-bold">Top Countries: {getGeoData().map(g => g.name).slice(0, 5).join(', ') || 'Waiting for data...'}</p>
                    </div>
                  </div>
                  <button onClick={() => { if (confirm("Are you sure?")) clearLogs(); }} className="text-xs font-black uppercase text-red-400 hover:text-red-600 transition-colors">Wipe Data</button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest mb-6">Detailed Redirection Logs (Mega & Mediafire)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                          <th className="pb-3 pl-4">Time</th>
                          <th className="pb-3">Target Link</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Country</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {logs.filter(l => l.type === 'redirect').slice(0, 50).map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 pl-4 font-mono text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                            <td className="py-3 max-w-[200px] truncate text-slate-600 font-medium" title={log.itemTitle}>{log.itemTitle || 'Unknown'}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide
                              ${log.itemId === 'step_4' ? 'bg-green-100 text-green-700' :
                                  log.itemId === 'step_1' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                                {log.itemId?.replace('_', ' ') || 'Started'}
                              </span>
                            </td>
                            <td className="py-3 text-slate-600 font-bold text-xs">{log.geo.country}</td>
                          </tr>
                        ))}
                        {logs.filter(l => l.type === 'redirect').length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">No redirection activity recorded yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }

          {
            activeTab === 'tools' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-green-600" /> Redirect Script Generator
                  </h3>
                  <p className="text-slate-600 mb-6 font-medium">
                    Paste this script into your Blogger or external website's <code>&lt;head&gt;</code> or before the <code>&lt;/body&gt;</code> tag.
                    It will automatically detect all <strong>Mediafire</strong> and <strong>Mega.nz</strong> links and redirect them through your site's countdown page.
                  </p>

                  <div className="bg-slate-900 rounded-2xl p-6 relative group border border-slate-800 shadow-2xl">
                    <pre className="text-blue-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                      {`<script>
  (function() {
    document.addEventListener("DOMContentLoaded", function() {
      // Automatic redirection script for Mediafire links
      var siteUrl = "${window.location.origin}";
      var links = document.querySelectorAll('a[href*="mediafire.com"], a[href*="mega.nz"]');
      links.forEach(function(link) {
        var originalUrl = link.href;
        if (!originalUrl.includes(siteUrl)) {
          link.href = siteUrl + "/redirect?url=" + encodeURIComponent(originalUrl);
          link.target = "_blank";
        }
      });
    });
  })();
</script>`}
                    </pre>
                    <button
                      onClick={() => {
                        const script = `<script>
  (function() {
    document.addEventListener("DOMContentLoaded", function() {
      // Automatic redirection script for Mediafire links
      var siteUrl = "${window.location.origin}";
      var links = document.querySelectorAll('a[href*="mediafire.com"], a[href*="mega.nz"]');
      links.forEach(function(link) {
        var originalUrl = link.href;
        if (!originalUrl.includes(siteUrl)) {
          link.href = siteUrl + "/redirect?url=" + encodeURIComponent(originalUrl);
          link.target = "_blank";
        }
      });
    });
  })();
</script>`;
                        navigator.clipboard.writeText(script);
                        alert("Script copied to clipboard!");
                      }}
                      className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-white/10"
                    >
                      Copy Script
                    </button>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                      <Check className="w-4 h-4" /> How it works:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside font-medium">
                      <li>Finds all links containing "mediafire.com".</li>
                      <li>Rewrites them to point to your <code>/redirect</code> page.</li>
                      <li>Encodes the original URL for safety.</li>
                      <li>Ensures links open in a new tab.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          }
        </div >
      </main >

      {showGameForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{editingGameId ? 'Edit Game' : 'Add Game'}</h2>
            <form onSubmit={saveGame} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                  <input value={gameForm.title || ''} onChange={e => {
                    const newTitle = e.target.value;
                    setGameForm(prev => ({ ...prev, title: newTitle, slug: prev.slug || slugify(newTitle) }));
                  }} placeholder="Title" className="w-full border p-2 rounded" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Slug (URL)</label>
                  <input value={gameForm.slug || ''} onChange={e => setGameForm({ ...gameForm, slug: slugify(e.target.value) })} placeholder="URL character-name" className="w-full border p-2 rounded" required />
                </div>
              </div>
              <textarea value={gameForm.description || ''} onChange={e => setGameForm({ ...gameForm, description: e.target.value })} placeholder="Description" className="w-full border p-2 rounded" />
              <input value={gameForm.image || ''} onChange={e => setGameForm({ ...gameForm, image: e.target.value })} placeholder="Image URL" className="w-full border p-2 rounded" />
              <input value={gameForm.category || ''} onChange={e => setGameForm({ ...gameForm, category: e.target.value })} placeholder="Category" className="w-full border p-2 rounded" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1 col-span-full">
                  <h4 className="text-xs font-black text-slate-800 uppercase mb-2">SEO Optimization</h4>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">SEO Title</label>
                  <input value={gameForm.seoTitle || ''} onChange={e => setGameForm({ ...gameForm, seoTitle: e.target.value })} placeholder="Meta title" className="w-full border p-2 rounded text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Meta Description</label>
                  <input value={gameForm.metaDescription || ''} onChange={e => setGameForm({ ...gameForm, metaDescription: e.target.value })} placeholder="Search snippet" className="w-full border p-2 rounded text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Keywords</label>
                  <input value={gameForm.focusKeywords || ''} onChange={e => setGameForm({ ...gameForm, focusKeywords: e.target.value })} placeholder="game, mod, apk" className="w-full border p-2 rounded text-xs" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Direct Download URL (Mediafire, etc.)</label>
                <input value={gameForm.downloadUrl || ''} onChange={e => setGameForm({ ...gameForm, downloadUrl: e.target.value })} placeholder="Paste direct link here..." className="w-full border p-2 rounded" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Source/Web URL (Reference)</label>
                <input value={gameForm.sourceUrl || ''} onChange={e => setGameForm({ ...gameForm, sourceUrl: e.target.value })} placeholder="Reference website URL" className="w-full border p-2 rounded" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setShowGameForm(false)} className="border px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {
        showAppForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4">{editingAppId ? 'Edit App' : 'Add App'}</h2>
              <form onSubmit={saveApp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                    <input value={appForm.title || ''} onChange={e => {
                      const newTitle = e.target.value;
                      setAppForm(prev => ({ ...prev, title: newTitle, slug: prev.slug || slugify(newTitle) }));
                    }} placeholder="Title" className="w-full border p-2 rounded" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Slug (URL)</label>
                    <input value={appForm.slug || ''} onChange={e => setAppForm({ ...appForm, slug: slugify(e.target.value) })} placeholder="URL character-name" className="w-full border p-2 rounded" required />
                  </div>
                </div>
                <textarea value={appForm.description || ''} onChange={e => setAppForm({ ...appForm, description: e.target.value })} placeholder="Description" className="w-full border p-2 rounded" />
                <input value={appForm.image || ''} onChange={e => setAppForm({ ...appForm, image: e.target.value })} placeholder="Image URL" className="w-full border p-2 rounded" />
                <input value={appForm.appCategory || ''} onChange={e => setAppForm({ ...appForm, appCategory: e.target.value })} placeholder="Category" className="w-full border p-2 rounded" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1 col-span-full">
                    <h4 className="text-xs font-black text-slate-800 uppercase mb-2">SEO Optimization</h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">SEO Title</label>
                    <input value={appForm.seoTitle || ''} onChange={e => setAppForm({ ...appForm, seoTitle: e.target.value })} placeholder="Meta title" className="w-full border p-2 rounded text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Meta Description</label>
                    <input value={appForm.metaDescription || ''} onChange={e => setAppForm({ ...appForm, metaDescription: e.target.value })} placeholder="Search snippet" className="w-full border p-2 rounded text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Keywords</label>
                    <input value={appForm.focusKeywords || ''} onChange={e => setAppForm({ ...appForm, focusKeywords: e.target.value })} placeholder="app, utility, tool" className="w-full border p-2 rounded text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Direct Download URL (Mediafire, etc.)</label>
                  <input value={appForm.downloadUrl || ''} onChange={e => setAppForm({ ...appForm, downloadUrl: e.target.value })} placeholder="Paste direct link here..." className="w-full border p-2 rounded" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Source/Web URL (Reference)</label>
                  <input value={appForm.sourceUrl || ''} onChange={e => setAppForm({ ...appForm, sourceUrl: e.target.value })} placeholder="Reference website URL" className="w-full border p-2 rounded" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setShowAppForm(false)} className="border px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {
        editingPlacementId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Configure Ad Placement</h2>
                <button onClick={() => setEditingPlacementId(null)} className="text-slate-400 hover:text-slate-600">
                  <PlusCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                updateAdPlacement(editingPlacementId, placementForm);
                setEditingPlacementId(null);
                alert('Ad placement updated successfully!');
              }} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Editing Placement</p>
                  <p className="text-lg font-black text-purple-600">{placementForm.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Type</label>
                    <select
                      value={placementForm.type}
                      onChange={e => setPlacementForm({ ...placementForm, type: e.target.value as any })}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all font-bold"
                    >
                      <option value="zone">Adsterra Zone</option>
                      <option value="script">Custom Script / HTML</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-slate-100 rounded-xl">
                      <input
                        type="checkbox"
                        checked={placementForm.active}
                        onChange={e => setPlacementForm({ ...placementForm, active: e.target.checked })}
                        className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-slate-700 text-sm">{placementForm.active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {placementForm.type === 'zone' ? 'Zone ID / Key' : 'Script Code / HTML'}
                  </label>
                  {placementForm.type === 'zone' ? (
                    <input
                      value={placementForm.value || ''}
                      onChange={e => setPlacementForm({ ...placementForm, value: e.target.value })}
                      placeholder="e.g. 1234567890abcdef"
                      className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all font-mono text-sm"
                    />
                  ) : (
                    <textarea
                      value={placementForm.value || ''}
                      onChange={e => setPlacementForm({ ...placementForm, value: e.target.value })}
                      placeholder="Paste your ad script here..."
                      className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all font-mono text-sm h-32"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width (px)</label>
                    <input
                      type="number"
                      value={placementForm.width || ''}
                      onChange={e => setPlacementForm({ ...placementForm, width: parseInt(e.target.value) })}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (px)</label>
                    <input
                      type="number"
                      value={placementForm.height || ''}
                      onChange={e => setPlacementForm({ ...placementForm, height: parseInt(e.target.value) })}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-purple-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPlacementId(null)}
                    className="px-6 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-black uppercase text-xs tracking-widest rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      <Footer />
    </div >
  );
}
