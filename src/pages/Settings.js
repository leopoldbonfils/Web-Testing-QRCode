import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  Info,
  ChevronRight,
  LogOut,
  Eye,
  EyeOff,
  Save,
  X,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePin, updateSettings } from '../services/userService';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setNotificationsEnabled(user.notifications_enabled !== false);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name || !email || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    setSavingProfile(true);
    const result = await updateProfile(name, email, phone);
    setSavingProfile(false);

    if (result.success) {
      updateUser({ name, email, phone });
      setEditingProfile(false);
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      toast.error('New PINs do not match');
      return;
    }

    setSavingPin(true);
    const result = await changePin(currentPin, newPin);
    setSavingPin(false);

    if (result.success) {
      setShowPinModal(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      toast.success('PIN changed successfully');
    } else {
      toast.error(result.error || 'Failed to change PIN');
    }
  };

  const handleToggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    const result = await updateSettings({ notifications_enabled: newValue });
    
    if (result.success) {
      updateUser({ notifications_enabled: newValue });
      toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
    } else {
      setNotificationsEnabled(!newValue);
      toast.error('Failed to update settings');
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const showAbout = () => {
    alert('BluePay App v1.0\n\nA modern contactless payment solution using NFC technology.\n\nMade with ❤️ by Dream Weavers');
  };

  const showSupport = () => {
    alert('Contact Support\n\nEmail: support@bluepay.rw\nPhone: +250 788 123 456\n\nWe\'re here to help 24/7!');
  };

  const showPrivacy = () => {
    alert('Privacy Policy\n\nYour privacy is important to us. We use encryption to protect your data and never share your information without permission.\n\nFor full privacy policy, visit: www.bluepay.rw/privacy');
  };

  const showTerms = () => {
    alert('Terms of Service\n\nBy using BluePay, you agree to our terms and conditions.\n\nFor full terms, visit: www.bluepay.rw/terms');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Manage your account</p>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileAvatar}>
          <User size={32} color="#fff" />
        </div>
        <div style={styles.profileInfo}>
          <h3 style={styles.profileName}>{user?.name}</h3>
          <p style={styles.profilePhone}>{user?.phone}</p>
        </div>
      </div>

      {/* Account Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Account</h3>
        
        {/* Personal Information */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <div style={{ ...styles.iconContainer, background: '#3b82f6' }}>
                <User size={18} color="#fff" />
              </div>
              <div>
                <p style={styles.cardTitle}>Personal Information</p>
                <p style={styles.cardDescription}>Update your profile details</p>
              </div>
            </div>
            <button 
              style={styles.editButton}
              onClick={() => setEditingProfile(!editingProfile)}
            >
              {editingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingProfile && (
            <div style={styles.cardContent}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} color="#666" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="#666" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone</label>
                <div style={styles.inputWrapper}>
                  <Phone size={18} color="#666" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <button 
                style={styles.saveButton}
                onClick={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Change PIN */}
        <button style={styles.settingItem} onClick={() => setShowPinModal(true)}>
          <div style={{ ...styles.iconContainer, background: '#f97316' }}>
            <Lock size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>Change PIN</p>
            <p style={styles.settingDescription}>Update your transaction PIN</p>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>
      </div>

      {/* Preferences Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Preferences</h3>

        {/* Notifications */}
        <div style={styles.settingItem}>
          <div style={{ ...styles.iconContainer, background: '#8b5cf6' }}>
            <Bell size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>Push Notifications</p>
            <p style={styles.settingDescription}>Payment alerts & updates</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
            />
            <span className="switch-slider"></span>
          </label>
        </div>
      </div>

      {/* Support Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Support & About</h3>

        <button style={styles.settingItem} onClick={showSupport}>
          <div style={{ ...styles.iconContainer, background: '#14b8a6' }}>
            <HelpCircle size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>Contact Support</p>
            <p style={styles.settingDescription}>Get help 24/7</p>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>

        <button style={styles.settingItem} onClick={showAbout}>
          <div style={{ ...styles.iconContainer, background: '#6366f1' }}>
            <Info size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>About BluePay</p>
            <p style={styles.settingDescription}>Version 1.0</p>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>

        <button style={styles.settingItem} onClick={showPrivacy}>
          <div style={{ ...styles.iconContainer, background: '#a855f7' }}>
            <Shield size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>Privacy Policy</p>
            <p style={styles.settingDescription}>How we protect your data</p>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>

        <button style={styles.settingItem} onClick={showTerms}>
          <div style={{ ...styles.iconContainer, background: '#f97316' }}>
            <FileText size={18} color="#fff" />
          </div>
          <div style={styles.settingContent}>
            <p style={styles.settingLabel}>Terms of Service</p>
            <p style={styles.settingDescription}>Read our terms</p>
          </div>
          <ChevronRight size={20} color="#666" />
        </button>
      </div>

      {/* Logout Button */}
      <button style={styles.logoutButton} onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPinModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Change PIN</h3>
              <button style={styles.modalClose} onClick={() => setShowPinModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current PIN</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#666" />
                  <input
                    type={showPins ? 'text' : 'password'}
                    placeholder="Enter current PIN"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={styles.input}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPins(!showPins)}
                    style={styles.eyeButton}
                  >
                    {showPins ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
                  </button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>New PIN</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#666" />
                  <input
                    type={showPins ? 'text' : 'password'}
                    placeholder="Enter new PIN (4-6 digits)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={styles.input}
                    maxLength={6}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm New PIN</label>
                <div style={styles.inputWrapper}>
                  <Lock size={18} color="#666" />
                  <input
                    type={showPins ? 'text' : 'password'}
                    placeholder="Confirm new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={styles.input}
                    maxLength={6}
                  />
                </div>
              </div>

              <button 
                style={styles.modalButton}
                onClick={handleChangePin}
                disabled={savingPin}
              >
                {savingPin ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <Check size={18} />
                    <span>Change PIN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888',
    margin: 0,
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '28px',
  },
  profileAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 4px 0',
  },
  profilePhone: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 14px 0',
  },
  card: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '16px',
    marginBottom: '10px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 2px 0',
  },
  cardDescription: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  editButton: {
    padding: '8px 16px',
    background: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cardContent: {
    padding: '0 16px 16px',
    borderTop: '1px solid #222',
    paddingTop: '16px',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    width: '100%',
    padding: '16px',
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '14px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    textAlign: 'left',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 2px 0',
  },
  settingDescription: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#aaa',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#111',
    border: '2px solid #222',
    borderRadius: '10px',
    padding: '0 14px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '12px 10px',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
  },
  eyeButton: {
    background: 'transparent',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    marginTop: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #222',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
  },
  modalClose: {
    background: 'transparent',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    padding: '4px',
  },
  modalBody: {
    padding: '24px',
  },
  modalButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default Settings;
