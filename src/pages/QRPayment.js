import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Download, RefreshCw, DollarSign, CheckCircle, Loader, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateQRCode as generateQRAPI } from '../services/qrService';
import toast from 'react-hot-toast';

const QRPayment = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrData, setQrData] = useState(null);
  const [qrSignature, setQrSignature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('receive');
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    generateQRCode();
  }, [user, amount]);

  useEffect(() => {
    // Update timer every second
    if (expiresAt) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = expiresAt - now;
        
        if (diff <= 0) {
          setTimeRemaining('Expired');
          toast.error('QR Code expired, generating new one...');
          generateQRCode();
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [expiresAt]);

  const generateQRCode = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Call backend API to generate proper QR code format
      const result = await generateQRAPI(amount ? parseFloat(amount) : null);
      
      if (result.success) {
        const { qr_data, signature, expires_at } = result.data;
        
        // Store the backend-generated QR data (proper format)
        setQrData(JSON.stringify(qr_data));
        setQrSignature(signature);
        setExpiresAt(new Date(expires_at));
      } else {
        // Fallback to manual format if API fails
        const fallbackData = {
          type: 'payment_request',
          qr_token: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          receiver_id: user.id || 0,
          receiver_name: user.name,
          receiver_phone: user.phone,
          amount: amount ? parseFloat(amount) : null,
          timestamp: new Date().toISOString(),
          expires_at: new Date(Date.now() + 300000).toISOString() // 5 minutes
        };
        setQrData(JSON.stringify(fallbackData));
        setExpiresAt(new Date(Date.now() + 300000));
        toast.error('Using offline QR code');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      
      // Fallback format matching backend expectations
      const fallbackData = {
        type: 'payment_request',
        qr_token: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        receiver_id: user.id || 0,
        receiver_name: user.name,
        receiver_phone: user.phone,
        amount: amount ? parseFloat(amount) : null,
        timestamp: new Date().toISOString(),
        expires_at: new Date(Date.now() + 300000).toISOString()
      };
      setQrData(JSON.stringify(fallbackData));
      setExpiresAt(new Date(Date.now() + 300000));
      toast.error('Generated offline QR code');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData);
      toast.success('Payment info copied to clipboard');
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `bluepay-qr-${user?.phone || 'code'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('QR Code downloaded');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  // BluePay logo as base64 SVG for embedding in QR code
  const bluePayLogo = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#3b82f6"/>
      <text x="50" y="65" font-family="Arial, sans-serif" font-size="45" font-weight="bold" fill="white" text-anchor="middle">B</text>
    </svg>
  `)}`;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>QR Payment</h1>
        <p style={styles.subtitle}>Send or receive money with QR code</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'receive' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('receive')}
        >
          <QrCode size={20} />
          <span>My QR Code</span>
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'scan' ? styles.tabActive : {})
          }}
          onClick={() => setActiveTab('scan')}
        >
          <QrCode size={20} />
          <span>Scan QR</span>
        </button>
      </div>

      {activeTab === 'receive' ? (
        <div style={styles.receiveContainer}>
          {/* QR Code Display */}
          <div style={styles.qrCard}>
            {/* Expiry Timer */}
            {expiresAt && timeRemaining && timeRemaining !== 'Expired' && (
              <div style={styles.expiryBadge}>
                <Clock size={16} />
                <span>Expires in {timeRemaining}</span>
              </div>
            )}

            <div style={styles.qrWrapper}>
              {loading ? (
                <div style={styles.qrPlaceholder}>
                  <Loader size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>Generating...</p>
                </div>
              ) : qrData ? (
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={250}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  imageSettings={{
                    src: bluePayLogo,
                    x: undefined,
                    y: undefined,
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
              ) : (
                <div style={styles.qrPlaceholder}>
                  <QrCode size={64} color="#333" />
                </div>
              )}
            </div>

            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{user?.name}</h3>
              <p style={styles.userPhone}>{user?.phone}</p>
              {amount && (
                <div style={styles.amountBadge}>
                  Request: <strong>{parseFloat(amount).toLocaleString()} Rwf</strong>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={styles.qrActions}>
              <button style={styles.qrAction} onClick={copyToClipboard} disabled={!qrData}>
                <Copy size={18} />
                <span>Copy</span>
              </button>
              <button style={styles.qrAction} onClick={downloadQR} disabled={!qrData}>
                <Download size={18} />
                <span>Download</span>
              </button>
              <button style={styles.qrAction} onClick={generateQRCode} disabled={loading}>
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Amount Input (Optional) */}
          <div style={styles.optionsCard}>
            <h4 style={styles.optionsTitle}>Request Specific Amount (Optional)</h4>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (Rwf)</label>
              <div style={styles.inputWrapper}>
                <DollarSign size={20} color="#666" />
                <input
                  type="number"
                  placeholder="Enter amount to request"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={styles.input}
                  min="0"
                />
              </div>
              <p style={styles.inputHint}>Leave empty to allow any amount</p>
            </div>
          </div>

          {/* Instructions */}
          <div style={styles.instructionsCard}>
            <h4 style={styles.instructionsTitle}>How it works</h4>
            <div style={styles.instruction}>
              <div style={styles.instructionNumber}>1</div>
              <p style={styles.instructionText}>Share your QR code with the sender</p>
            </div>
            <div style={styles.instruction}>
              <div style={styles.instructionNumber}>2</div>
              <p style={styles.instructionText}>They scan it using BluePay app</p>
            </div>
            <div style={styles.instruction}>
              <div style={styles.instructionNumber}>3</div>
              <p style={styles.instructionText}>Confirm and receive your payment instantly</p>
            </div>
          </div>

          {/* Security Info */}
          <div style={styles.securityCard}>
            <div style={styles.securityIcon}>🔒</div>
            <div>
              <h5 style={styles.securityTitle}>Secure Payment</h5>
              <p style={styles.securityText}>
                QR codes expire after 5 minutes for your security. Generate a new code if expired.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.scanContainer}>
          <div style={styles.scanCard}>
            <div style={styles.scanIcon}>
              <QrCode size={64} color="#3b82f6" />
            </div>
            <h3 style={styles.scanTitle}>Scan QR Code</h3>
            <p style={styles.scanDescription}>
              To scan a QR code, please use the BluePay mobile app.
              The web version currently supports displaying your QR code for receiving payments.
            </p>
            <div style={styles.featureList}>
              <div style={styles.feature}>
                <CheckCircle size={18} color="#10b981" />
                <span>Download the BluePay mobile app</span>
              </div>
              <div style={styles.feature}>
                <CheckCircle size={18} color="#10b981" />
                <span>Use camera to scan QR codes</span>
              </div>
              <div style={styles.feature}>
                <CheckCircle size={18} color="#10b981" />
                <span>Instant and secure payments</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    background: '#0a0a0a',
    padding: '8px',
    borderRadius: '16px',
    border: '1px solid #222',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    borderRadius: '12px',
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: '#fff',
  },
  receiveContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  qrCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '24px',
    padding: '32px',
    textAlign: 'center',
    position: 'relative',
  },
  expiryBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '20px',
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: '600',
  },
  qrWrapper: {
    display: 'inline-block',
    padding: '20px',
    background: '#fff',
    borderRadius: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  qrPlaceholder: {
    width: '250px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    borderRadius: '12px',
  },
  userInfo: {
    marginBottom: '20px',
  },
  userName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 4px 0',
  },
  userPhone: {
    fontSize: '15px',
    color: '#888',
    margin: '0 0 12px 0',
  },
  amountBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '20px',
    color: '#10b981',
    fontSize: '14px',
    fontWeight: '500',
  },
  qrActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  qrAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: '#111',
    border: '1px solid #222',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  optionsCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '20px',
    padding: '24px',
  },
  optionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 20px 0',
  },
  inputGroup: {
    marginBottom: '0',
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
    borderRadius: '12px',
    padding: '0 16px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '14px 12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
  },
  inputHint: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
  },
  instructionsCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '20px',
    padding: '24px',
  },
  instructionsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 20px 0',
  },
  instruction: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '14px',
  },
  instructionNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  instructionText: {
    color: '#aaa',
    fontSize: '14px',
    margin: 0,
  },
  securityCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    padding: '20px',
  },
  securityIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  securityTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 6px 0',
  },
  securityText: {
    fontSize: '13px',
    color: '#aaa',
    margin: 0,
    lineHeight: '1.5',
  },
  scanContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  scanCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '24px',
    padding: '48px 32px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  scanIcon: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(59, 130, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  scanTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 12px 0',
  },
  scanDescription: {
    fontSize: '15px',
    color: '#888',
    margin: '0 0 28px 0',
    lineHeight: '1.6',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textAlign: 'left',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#aaa',
    fontSize: '14px',
  },
};

export default QRPayment;