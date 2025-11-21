import React, { useState } from 'react';
import { Phone, DollarSign, MessageSquare, Shield, CheckCircle, ArrowLeft, Smartphone, Building, CreditCard } from 'lucide-react';
import { sendBluePay, sendMobileMoney, sendBankTransfer } from '../services/paymentService';
import toast from 'react-hot-toast';

const SendMoney = () => {
  const [activeTab, setActiveTab] = useState('bluepay');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [pin, setPin] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const tabs = [
    { id: 'bluepay', label: 'BluePay', icon: Smartphone },
    { id: 'momo', label: 'Mobile Money', icon: Phone },
    { id: 'bank', label: 'Bank Transfer', icon: Building },
  ];

  const banks = [
    'Bank of Kigali',
    'I&M Bank',
    'Equity Bank',
    'Access Bank',
    'BPR Bank',
    'Ecobank',
    'KCB Bank',
    'NCBA Bank',
    'GT Bank',
    'Cogebanque',
  ];

  const resetForm = () => {
    setPhone('');
    setAmount('');
    setMessage('');
    setPin('');
    setBankName('');
    setAccountNumber('');
    setSuccess(false);
    setTransactionData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!pin || pin.length < 4) {
      toast.error('Please enter your PIN');
      return;
    }

    if (activeTab === 'bank') {
      if (!bankName || !accountNumber) {
        toast.error('Please fill in bank details');
        return;
      }
    } else {
      if (!phone) {
        toast.error('Please enter a phone number');
        return;
      }
    }

    setLoading(true);

    let result;

    try {
      switch (activeTab) {
        case 'bluepay':
          result = await sendBluePay(phone, parseFloat(amount), pin, message);
          break;
        case 'momo':
          result = await sendMobileMoney(phone, parseFloat(amount), pin, message);
          break;
        case 'bank':
          result = await sendBankTransfer(bankName, accountNumber, parseFloat(amount), pin, message);
          break;
        default:
          break;
      }

      setLoading(false);

      if (result?.success) {
        setSuccess(true);
        setTransactionData(result.data);
        toast.success('Payment successful!');
      } else {
        toast.error(result?.error || 'Payment failed');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Payment failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>
            <CheckCircle size={64} color="#10b981" />
          </div>
          <h2 style={styles.successTitle}>Payment Successful!</h2>
          <p style={styles.successAmount}>
            {parseFloat(amount).toLocaleString()} Rwf
          </p>
          <div style={styles.successDetails}>
            {activeTab === 'bank' ? (
              <>
                <p style={styles.successDetail}>Bank: {bankName}</p>
                <p style={styles.successDetail}>Account: {accountNumber}</p>
              </>
            ) : (
              <p style={styles.successDetail}>To: {phone}</p>
            )}
            {transactionData?.transaction_id && (
              <p style={styles.successDetail}>
                Transaction ID: {transactionData.transaction_id}
              </p>
            )}
          </div>
          <button style={styles.newPaymentButton} onClick={resetForm}>
            <ArrowLeft size={20} />
            <span>New Payment</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Send Money</h1>
        <p style={styles.subtitle}>Choose a payment method</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {activeTab === 'bank' ? (
            <>
              {/* Bank Selection */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Bank</label>
                <div style={styles.selectWrapper}>
                  <Building size={20} color="#666" />
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Number */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Account Number</label>
                <div style={styles.inputWrapper}>
                  <CreditCard size={20} color="#666" />
                  <input
                    type="text"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Phone Number */
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                {activeTab === 'bluepay' ? 'BluePay Phone Number' : 'Mobile Money Number'}
              </label>
              <div style={styles.inputWrapper}>
                <Phone size={20} color="#666" />
                <input
                  type="tel"
                  placeholder="+250XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount (Rwf)</label>
            <div style={styles.inputWrapper}>
              <DollarSign size={20} color="#666" />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                min="1"
              />
            </div>
          </div>

          {/* Message (Optional) */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Message (Optional)</label>
            <div style={styles.inputWrapper}>
              <MessageSquare size={20} color="#666" />
              <input
                type="text"
                placeholder="Add a note"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* PIN */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Transaction PIN</label>
            <div style={styles.inputWrapper}>
              <Shield size={20} color="#666" />
              <input
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={styles.input}
                maxLength={6}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <span>Send Money</span>
            )}
          </button>
        </form>
      </div>
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
  formCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '20px',
    padding: '28px',
  },
  inputGroup: {
    marginBottom: '20px',
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
    transition: 'border-color 0.2s ease',
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
  selectWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#111',
    border: '2px solid #222',
    borderRadius: '12px',
    padding: '0 16px',
  },
  select: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '14px 12px',
    fontSize: '16px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    transition: 'transform 0.2s ease',
  },
  successCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '24px',
    padding: '48px 32px',
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 16px 0',
  },
  successAmount: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#10b981',
    margin: '0 0 24px 0',
  },
  successDetails: {
    marginBottom: '32px',
  },
  successDetail: {
    color: '#888',
    fontSize: '15px',
    margin: '8px 0',
  },
  newPaymentButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default SendMoney;
