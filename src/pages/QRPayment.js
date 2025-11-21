import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Download, RefreshCw, DollarSign, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QRPayment = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrData, setQrData] = useState(null);
  const [activeTab, setActiveTab] = useState('receive');

  useEffect(() => {
    generateQRCode();
  }, [user, amount, message]);

  const generateQRCode = () => {
    if (!user) return;

    const data = {
      type: 'bluepay',
      action: 'payment',
      recipient: {
        phone: user.phone,
        name: user.name,
      },
      amount: amount ? parseFloat(amount) : null,
      message: message || null,
      timestamp: Date.now(),
    };

    setQrData(JSON.stringify(data));
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `bluepay-qr-${user?.phone || 'code'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    toast.success('QR Code downloaded');
  };

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
            <div style={styles.qrWrapper}>
              {qrData ? (
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={220}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
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
            </div>

            {/* Actions */}
            <div style={styles.qrActions}>
              <button style={styles.qrAction} onClick={copyToClipboard}>
                <Copy size={18} />
                <span>Copy</span>
              </button>
              <button style={styles.qrAction} onClick={downloadQR}>
                <Download size={18} />
                <span>Download</span>
              </button>
              <button style={styles.qrAction} onClick={generateQRCode}>
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
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Message (Optional)</label>
              <div style={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Add a note"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={styles.input}
                />
              </div>
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
              <p style={styles.instructionText}>Confirm and receive your payment</p>
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
                <span>Instant payments</span>
              </div>
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
  },
  qrWrapper: {
    display: 'inline-block',
    padding: '16px',
    background: '#fff',
    borderRadius: '20px',
    marginBottom: '20px',
  },
  qrPlaceholder: {
    width: '220px',
    height: '220px',
    display: 'flex',
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
    margin: 0,
  },
  qrActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
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
