import React, { useState, useContext } from 'react'; // Importar useContext
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext'; // Importar ThemeContext
import { useAuth } from '../context/AuthContext'; // Importar useAuth

import VIPMemberManagement from '../admin/components/VIPMemberManagement';
import ContentManagement from '../admin/components/ContentManagement';
import UserManagement from '../admin/components/UserManagement';
import Backup from '../admin/components/Backup';
import NewsManagement from '../admin/components/NewsManagement';
import ContactRequestsManagement from '../admin/components/ContactRequestsManagement';
import SiteSettingsContent from '../admin/components/SiteSettingsContent';
import ColorPaletteSettings from '../admin/components/ColorPaletteSettings';
import TradingSignalManagement from '../admin/components/TradingSignalManagement';
import WithdrawalRequestsManagement from '../admin/components/WithdrawalRequestsManagement';
import BalanceManagement from '../user/components/BalanceManagement';
import VIPPlansManagement from '../admin/components/VIPPlansManagement';
import TradingHistoryManagement from '../admin/components/TradingHistoryManagement';
import DepositManagement from '../admin/components/DepositManagement';
import DepositAddressSettings from '../admin/components/DepositAddressSettings';
import ChatManagement from '../admin/components/ChatManagement';
import UpdateManagement from '../admin/components/UpdateManagement';
import CollectiveFundManagement from '../admin/components/CollectiveFundManagement';


const AdminPanel = () => {
  const { darkMode } = useContext(ThemeContext); // Usar ThemeContext
  const { logout } = useAuth(); // Usar useAuth

  const location = useLocation();
  const [unreadContactRequests, setUnreadContactRequests] = useState(0);
  const [unreadWithdrawalRequests, setUnreadWithdrawalRequests] = useState(0);
  const [unreadMinersCount, setUnreadMinersCount] = useState(0); // Nuevo estado para notificaciones de mineros

  const handleUnreadContactRequestsChange = (count) => {
    setUnreadContactRequests(count);
  };

  const handleUnreadWithdrawalRequestsChange = (count) => {
    setUnreadWithdrawalRequests(count);
  };

  const handleNewMinerNotification = (count) => {
    setUnreadMinersCount(prevCount => {
      const newCount = prevCount + count;
      console.log("AdminPanel: handleNewMinerNotification llamado. Nuevos mineros:", count, "Total no leídos:", newCount);
      return newCount;
    });
  };

  const handleClearMinerNotification = () => {
    console.log("AdminPanel: Limpiando notificación de mineros.");
    setUnreadMinersCount(0);
  };

  console.log("AdminPanel: Renderizando. unreadMinersCount:", unreadMinersCount);

  return (
    <div className="flex h-screen text-main" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Sidebar de Navegación */}
      <aside className="w-64 p-2 shadow-lg overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
        <div className="text-xl font-bold text-yellow-500 mb-6">Admin Dashboard</div>
        <nav>
          <ul>
            <li className="mb-0.5">
              <Link
                to="/miners"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/miners'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                onClick={handleClearMinerNotification}
              >
                Gestión de Miembros VIP
                {unreadMinersCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadMinersCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/users"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/users'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Gestión de Usuarios
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/backup"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/backup'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Respaldo de Datos
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/news"
                className={`flex items-center py-1.5 rounded-lg text-sm font-medium ${location.pathname === '/news'

                  ? 'bg-accent text-white'
                  : (darkMode ? 'text-light_text hover:bg-dark_border' : 'text-gray-300 hover:bg-gray-700')
                  }`}
              >
                Gestión de Noticias
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/content"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/content'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Gestión de Contenido
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/contact-requests"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/contact-requests'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Solicitudes de Contacto
                {unreadContactRequests > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadContactRequests}
                  </span>
                )}
              </Link>
            </li>
            <li className="mb-0.5"> {/* Nuevo enlace para Solicitudes de Pago */}
              <Link
                to="/withdrawal-requests"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/withdrawal-requests'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Solicitudes de Pago
                {unreadWithdrawalRequests > 0 && ( // Añadir notificación numérica
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadWithdrawalRequests}
                  </span>
                )}
              </Link>
            </li>
            <li className="mb-0.5"> {/* Nuevo enlace para Gestión de Balance */}
              <Link
                to="/balance-management"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/balance-management'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Gestión de Balance
              </Link>
            </li>
            <li className="mb-0.5"> {/* Nuevo enlace para Configuración del Sitio */}
              <Link
                to="/site-settings"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/site-settings'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Configuración del Sitio
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/trading-history"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/trading-history'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Historial de Operaciones
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/trading-signal-management"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/trading-signal-management'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Enviar Señales VIP
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/vip-plans"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/vip-plans'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                Configuración de Planes VIP
              </Link>
            </li>
            <li className="mb-0.5"> {/* Nuevo enlace para Paletas de Colores */}
              <Link
                to="/color-palettes"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/color-palettes'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                🎨 Paletas de Colores
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/deposit-management"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/deposit-management'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                💰 Gestión de Depósitos
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/deposit-addresses"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/deposit-addresses'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                🔑 Direcciones de Depósito
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/updates"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/updates'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                📢 Historial de Mejoras
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/chat-vip"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/chat-vip'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                💬 Chat VIP (Público/Privado)
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/collective-fund"
                className={`flex items-center py-1.5 px-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/collective-fund'

                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                📊 Gestión Fondo Colectivo
              </Link>
            </li>
            <li className="mt-8 pt-4 border-t border-white/5">
              <button
                onClick={async () => {
                  if (window.confirm('¿Cerrar sesión del Panel Administrativo?')) {
                    await logout();
                    window.location.href = '/login';
                  }
                }}
                className="w-full flex items-center py-2 px-3 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                🚪 Cerrar Sesión
              </button>
            </li>


          </ul>
        </nav>
      </aside >

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: 'var(--bg-main)' }}>
        <h1 className="text-4xl font-bold mb-8 text-white">Panel de Administración</h1>
        <Routes>
          <Route
            path="miners"
            element={<VIPMemberManagement onNewMinerAdded={handleNewMinerNotification} />}
          />
          <Route path="users" element={<UserManagement />} />
          <Route path="backup" element={<Backup />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route
            path="contact-requests"
            element={<ContactRequestsManagement onUnreadCountChange={handleUnreadContactRequestsChange} />}
          />
          <Route
            path="withdrawal-requests"
            element={<WithdrawalRequestsManagement onUnreadCountChange={handleUnreadWithdrawalRequestsChange} />}
          />
          <Route path="balance-management" element={<BalanceManagement />} />
          <Route path="trading-signal-management" element={<TradingSignalManagement />} /> {/* Nueva ruta para Gestión de Señales de Trading */}
          <Route path="site-settings" element={<SiteSettingsContent />} /> {/* Nueva ruta para Configuración del Sitio */}
          <Route path="vip-plans" element={<VIPPlansManagement />} />
          <Route path="trading-history" element={<TradingHistoryManagement />} />
          <Route path="color-palettes" element={<ColorPaletteSettings />} /> {/* Nueva ruta para Paletas de Colores */}
          <Route path="deposit-management" element={<DepositManagement />} /> {/* Nueva ruta para Gestión de Depósitos */}
          <Route path="deposit-addresses" element={<DepositAddressSettings />} /> {/* Nueva ruta para Direcciones de Depósito */}
          <Route path="chat-vip" element={<ChatManagement />} />
          <Route path="updates" element={<UpdateManagement />} />
          <Route path="collective-fund" element={<CollectiveFundManagement />} />
          {/* Ruta por defecto o dashboard overview */}
          <Route path="/" element={
            <div className={`p-6 rounded-2xl shadow-xl`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h2 className="text-2xl font-semibold mb-4">Bienvenido al Panel de Administración</h2>
              <p>Selecciona una opción del menú lateral para empezar a administrar el sitio.</p>
            </div>
          } />
        </Routes>
      </main >
    </div >
  );
};

export default AdminPanel;
