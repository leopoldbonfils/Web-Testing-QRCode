import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Send,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Smartphone,
  QrCode,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/send-money', icon: Send, label: 'Send Money' },
    { path: '/qr-payment', icon: QrCode, label: 'QR Payment' },
    { path: '/transactions', icon: History, label: 'Transactions' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      <div style={styles.mobileHeader} className="mobile-header">
        <button style={styles.menuButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div style={styles.logoMobile}>
          <Smartphone size={24} color="#3b82f6" />
          <span style={styles.logoTextMobile}>BluePay</span>
        </div>
        <div style={styles.userAvatar}>
          <User size={20} />
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        style={styles.sidebar} 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div style={styles.sidebarContent}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Smartphone size={32} color="#fff" />
            </div>
            <span style={styles.logoText}>BluePay</span>
          </div>

          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.userAvatarLarge}>
              <User size={28} />
            </div>
            <div style={styles.userDetails}>
              <p style={styles.userName}>{user?.name || 'User'}</p>
              <p style={styles.userPhone}>{user?.phone || ''}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {})
                })}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout Button */}
          <button style={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main} className="main-content">
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#000',
  },
  mobileHeader: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: '#0a0a0a',
    borderBottom: '1px solid #222',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 100,
  },
  menuButton: {
    background: 'transparent',
    color: '#fff',
    padding: '8px',
  },
  logoMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoTextMobile: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 199,
  },
  sidebar: {
    width: '260px',
    background: '#0a0a0a',
    borderRight: '1px solid #222',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 200,
    transition: 'transform 0.3s ease',
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '24px 16px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#fff',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#111',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  userAvatarLarge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
    overflow: 'hidden',
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userPhone: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    color: '#888',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  navItemActive: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: '#fff',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    fontSize: '15px',
    fontWeight: '500',
    border: 'none',
    width: '100%',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    minHeight: '100vh',
    background: '#000',
  },
};

export default Layout;
