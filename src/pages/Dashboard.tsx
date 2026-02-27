import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Trash2, Edit, Check, Download, Globe,
  Settings as SettingsIcon, BarChart3, LayoutDashboard,
  Gamepad2, Smartphone, Wrench, LogOut, Search,
  ShieldCheck, Activity, Menu, X, ChevronRight, Save, User
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteContext';
import { useContent } from '../context/ContentContext';
import { useAnalytics } from '../context/AnalyticsContext';
import type { Game, AppItem } from '../context/ContentContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

function generateId(prefix = '') {
  return `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function Admin() {
  const navigate = useNavigate();
  const { siteName, footerText, downloadTimer, adPlacements, homeHero, footerPages, updateSettings, updateAdPlacement, language, headCode, footerCode } = useSiteSettings();
  const { games, apps, addGame, updateGame, deleteGame, addApp, updateApp, deleteApp } = useContent();
  const { logs, clearLogs } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'analytics' | 'tools'>('content');
  const [statsPeriod, setStatsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    footerText: '',
    downloadTimer: 15,
    language: 'en' as 'en' | 'es',
    headCode: '',
    footerCode: ''
  });
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [pagesForm, setPagesForm] = useState<any[]>([]);
  const [editingPageSlug, setEditingPageSlug] = useState<string | null>(null);
  const [pageContentForm, setPageContentForm] = useState({ title: '', content: '' });

  useEffect(() => {
    setSettingsForm({ siteName, footerText, downloadTimer, language: language || 'en', headCode, footerCode });
    setHeroForm({ title: homeHero.title, subtitle: homeHero.subtitle });
    setPagesForm([...footerPages]);
  }, [siteName, footerText, downloadTimer, homeHero, footerPages, language, headCode, footerCode]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Games handlers
  const openNewGameForm = () => {
    setEditingGameId(null);
    setGameForm({
      title: '', slug: '', description: '', image: '', rating: 4.0, downloads: '', size: '',
      category: '', version: '', developer: '', requirements: '', releaseDate: '',
      downloadUrl: '', sourceUrl: '', seoTitle: '', metaDescription: '', focusKeywords: ''
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
    if (editingGameId) {
      updateGame({ ...(gameForm as Game), id: editingGameId, slug: gameForm.slug || slugify(gameForm.title || '') });
    } else {
      const title = gameForm.title || '';
      const newGame: Game = {
        ...gameForm,
        id: generateId('game-'),
        slug: gameForm.slug || slugify(title),
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
      title: '', slug: '', description: '', image: '', rating: 4.0, downloads: '0', size: '0MB',
      appCategory: 'Tools', version: '1.0', developer: 'Unknown', requirements: 'Android 5.0+',
      releaseDate: '', downloadUrl: '', seoTitle: '', metaDescription: '', focusKeywords: ''
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
    if (editingAppId) {
      updateApp({ ...(appForm as AppItem), id: editingAppId, slug: appForm.slug || slugify(appForm.title || '') });
    } else {
      const title = appForm.title || '';
      const newApp: AppItem = {
        ...appForm,
        id: generateId('app-'),
        slug: appForm.slug || slugify(title),
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
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || doc.querySelector('title')?.textContent || '';
      const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

      if (showAppForm) {
        setAppForm(prev => ({ ...prev, title, description, image, sourceUrl: scrapeUrl }));
      } else {
        setGameForm(prev => ({ ...prev, title, description, image, sourceUrl: scrapeUrl }));
        setShowGameForm(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsScraping(false);
      setScrapeUrl('');
    }
  };

  // Analytics
  const getDailyStats = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return days.map(d => ({
      label: d,
      visits: logs.filter(l => l.type === 'visit' && l.timestamp > new Date(d).getTime()).length
    }));
  };

  return (
    <div className="flex h-screen bg-[#050b18] text-slate-300 font-inter overflow-hidden">
      {/* Sidebar navigation */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0a1120] border-r border-slate-800/50 flex flex-col transition-all duration-300 relative z-20 shadow-2xl shadow-black/50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter">MAXI<span className="text-blue-500">OS</span></span>
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Panel Central</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarLink active={activeTab === 'analytics'} icon={<BarChart3 />} label="Dashboard" onClick={() => setActiveTab('analytics')} collapsed={!isSidebarOpen} />
          <SidebarLink active={activeTab === 'content'} icon={<LayoutDashboard />} label="Gestión de Apps" onClick={() => setActiveTab('content')} collapsed={!isSidebarOpen} />
          <SidebarLink active={activeTab === 'settings'} icon={<SettingsIcon />} label="Configuración" onClick={() => setActiveTab('settings')} collapsed={!isSidebarOpen} />
          <SidebarLink active={activeTab === 'tools'} icon={<Wrench />} label="Herramientas" onClick={() => setActiveTab('tools')} collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-800/50 space-y-2">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-white/5 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <User className="w-4 h-4" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{auth.currentUser?.email || 'Administrador'}</span>
                <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050b18]">
        <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#050b18]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            <h2 className="text-lg font-bold text-white">
              {activeTab === 'analytics' && 'Resumen Estadístico'}
              {activeTab === 'content' && 'Gestión de Contenido'}
              {activeTab === 'settings' && 'Personalización del Sitio'}
              {activeTab === 'tools' && 'Kit de Herramientas'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servidor Activo</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Visitas Totales" value={logs.filter(l => l.type === 'visit').length} color="blue" icon={<BarChart3 />} />
                <StatCard label="Juegos" value={games.length} color="purple" icon={<Gamepad2 />} />
                <StatCard label="Aplicaciones" value={apps.length} color="pink" icon={<Smartphone />} />
                <StatCard label="Descargas" value={logs.filter(l => l.type === 'download').length} color="green" icon={<Download />} />
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Tráfico de Red</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getDailyStats()}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="visits" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisits)" />
                      <Tooltip contentStyle={{ backgroundColor: '#0a1120', border: '1px solid #1e293b', borderRadius: '12px' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5" />
                  <input
                    placeholder="Importar vía URL..."
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex gap-4 shrink-0">
                  <button onClick={handleScrape} disabled={isScraping} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                    {isScraping ? 'Procesando...' : 'Scrapear'}
                  </button>
                  <button onClick={openNewGameForm} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Nuevo Juego</button>
                  <button onClick={openNewAppForm} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Nueva App</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ContentList title="Juegos" data={games} onEdit={openEditGameForm} onDelete={deleteGame} accent="blue" />
                <ContentList title="Aplicaciones" data={apps} onEdit={openEditAppForm} onDelete={deleteApp} accent="purple" />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
              <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-500" /> Metadatos del Sitio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Nombre del Sitio" value={settingsForm.siteName} onChange={v => setSettingsForm({ ...settingsForm, siteName: v })} />
                  <Input label="Temporizador (Segundos)" type="number" value={settingsForm.downloadTimer} onChange={v => setSettingsForm({ ...settingsForm, downloadTimer: parseInt(v) })} />
                  <div className="md:col-span-2">
                    <Input label="Texto del Footer" value={settingsForm.footerText} onChange={v => setSettingsForm({ ...settingsForm, footerText: v })} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateSettings(settingsForm);
                    alert('¡Configuración Actualizada!');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20"
                >
                  Guardar Cambios Globales
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Forms Modals could go here, but for now let's keep it simple */}
      {(showGameForm || showAppForm) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
          <div className="bg-[#0a1120] border border-white/5 w-full max-w-4xl p-10 rounded-[3rem] shadow-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white">{editingGameId || editingAppId ? 'Editar' : 'Crear'} {showGameForm ? 'Juego' : 'App'}</h2>
              <button onClick={() => { setShowGameForm(false); setShowAppForm(false); }} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-400"><X /></button>
            </div>
            <form onSubmit={showGameForm ? saveGame : saveApp} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Título" value={showGameForm ? gameForm.title : appForm.title} onChange={v => showGameForm ? setGameForm({ ...gameForm, title: v }) : setAppForm({ ...appForm, title: v })} />
                <Input label="Imagen URL" value={showGameForm ? gameForm.image : appForm.image} onChange={v => showGameForm ? setGameForm({ ...gameForm, image: v }) : setAppForm({ ...appForm, image: v })} />
                <Input label="Categoría" value={showGameForm ? gameForm.category : appForm.appCategory} onChange={v => showGameForm ? setGameForm({ ...gameForm, category: v }) : setAppForm({ ...appForm, appCategory: v })} />
                <Input label="Descargas" value={showGameForm ? gameForm.downloads : appForm.downloads} onChange={v => showGameForm ? setGameForm({ ...gameForm, downloads: v }) : setAppForm({ ...appForm, downloads: v })} />
                <Input label="Tamaño" value={showGameForm ? gameForm.size : appForm.size} onChange={v => showGameForm ? setGameForm({ ...gameForm, size: v }) : setAppForm({ ...appForm, size: v })} />
                <Input label="URL de Descarga" value={showGameForm ? gameForm.downloadUrl : appForm.downloadUrl} onChange={v => showGameForm ? setGameForm({ ...gameForm, downloadUrl: v }) : setAppForm({ ...appForm, downloadUrl: v })} />
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Descripción</label>
                  <textarea
                    value={showGameForm ? gameForm.description : appForm.description}
                    onChange={e => showGameForm ? setGameForm({ ...gameForm, description: e.target.value }) : setAppForm({ ...appForm, description: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white min-h-[150px] outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20">
                {editingGameId || editingAppId ? 'Guardar Cambios' : 'Publicar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarLink({ active, icon, label, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative group
        ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}
        ${collapsed && 'justify-center'}
      `}
    >
      <div className={`transition-transform duration-300 ${!active && 'group-hover:scale-110'}`}>{React.cloneElement(icon, { size: 22 })}</div>
      {!collapsed && <span className="text-sm font-bold tracking-tight">{label}</span>}
      {active && !collapsed && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>}
    </button>
  );
}

function StatCard({ label, value, color, icon }: any) {
  const colors: any = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    pink: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    green: 'text-green-500 bg-green-500/10 border-green-500/20'
  };
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4 shadow-xl group hover:border-blue-500/20 transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-bold ${colors[color]}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-white mt-1 group-hover:text-blue-400 transition-colors uppercase">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ContentList({ title, data, onEdit, onDelete, accent }: any) {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-[500px]">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        {accent === 'blue' ? <Gamepad2 className="text-blue-500" /> : <Smartphone className="text-purple-500" />}
        {title}
      </h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {data.map((item: any) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-950/30 rounded-[1.5rem] border border-white/5 hover:border-blue-500/20 transition-all group">
            <img src={item.image} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/5" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate text-sm">{item.title}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{item.category || item.appCategory}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(item)} className="p-2 hover:bg-blue-500/20 rounded-xl text-blue-500 transition-colors"><Edit size={16} /></button>
              <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-red-500/20 rounded-xl text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:border-blue-500 transition-all"
      />
    </div>
  );
}
