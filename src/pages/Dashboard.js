import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, ArrowRight, RefreshCw, Send, QrCode, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBalance } from '../services/paymentService';
import { getTransactions } from '../services/transactionService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const balanceResult = await getBalance();
      if (balanceResult.success) {
        setBalance(balanceResult.balance);
      }

      const transactionsResult = await getTransactions(1, 10);
      if (transactionsResult.success) {
        setTransactions(transactionsResult.data.transactions || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Load data error:', error);
      setLoading(false);
      toast.error('Failed to load data');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'in' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'out' && t.status === 'completed')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner-large"></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Welcome back,</h1>
          <h2 style={styles.userName}>{user?.name || 'User'}</h2>
        </div>
        <button 
          style={styles.refreshButton} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={20} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
        </button>
      </div>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div style={styles.balanceHeader}>
          <span style={styles.balanceLabel}>Total Balance</span>
        </div>
        <h2 style={styles.balanceAmount}>
          {balance.toLocaleString()} <span style={styles.currency}>Rwf</span>
        </h2>
        <div style={styles.quickActions}>
          <button style={styles.quickAction} onClick={() => navigate('/send-money')}>
            <Send size={20} />
            <span>Send</span>
          </button>
          <button style={styles.quickAction} onClick={() => navigate('/qr-payment')}>
            <QrCode size={20} />
            <span>QR Pay</span>
          </button>
          <button style={styles.quickAction} onClick={() => navigate('/transactions')}>
            <History size={20} />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
            <ArrowDown size={24} color="#10b981" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Income</span>
            <span style={{ ...styles.statAmount, color: '#10b981' }}>
              {totalIncome.toLocaleString()} Rwf
            </span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
            <ArrowUp size={24} color="#ef4444" />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Expenses</span>
            <span style={{ ...styles.statAmount, color: '#ef4444' }}>
              {totalExpense.toLocaleString()} Rwf
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={styles.transactionsSection}>
        <div style={styles.transactionsHeader}>
          <h3 style={styles.sectionTitle}>Recent Transactions</h3>
          <button 
            style={styles.seeAllButton}
            onClick={() => navigate('/transactions')}
          >
            See All <ArrowRight size={16} />
          </button>
        </div>

        {transactions.length > 0 ? (
          <div style={styles.transactionsList}>
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} style={styles.transactionCard}>
                <div style={{
                  ...styles.transactionIcon,
                  background: transaction.type === 'in' 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'rgba(239, 68, 68, 0.15)'
                }}>
                  {transaction.type === 'in' ? (
                    <ArrowDown size={20} color="#10b981" />
                  ) : (
                    <ArrowUp size={20} color="#ef4444" />
                  )}
                </div>
                <div style={styles.transactionDetails}>
                  <span style={styles.transactionLabel}>{transaction.label}</span>
                  <span style={styles.transactionDate}>
                    {new Date(transaction.created_at).toLocaleDateString()} • 
                    {new Date(transaction.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={styles.transactionAmount}>
                  <span style={{
                    color: transaction.type === 'in' ? '#10b981' : '#ef4444',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}>
                    {transaction.type === 'in' ? '+' : '-'}
                    {parseFloat(transaction.amount).toLocaleString()} Rwf
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <History size={48} color="#333" />
            <p style={styles.emptyText}>No transactions yet</p>
            <p style={styles.emptySubtext}>Start sending or receiving money</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '16px',
  },
  loadingText: {
    color: '#888',
    fontSize: '16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  greeting: {
    fontSize: '16px',
    color: '#888',
    margin: 0,
    fontWeight: '400',
  },
  userName: {
    fontSize: '28px',
    color: '#fff',
    margin: 0,
    fontWeight: '700',
  },
  refreshButton: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: '#111',
    border: '1px solid #222',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    borderRadius: '20px',
    padding: '28px',
    marginBottom: '20px',
    boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
  },
  balanceHeader: {
    marginBottom: '8px',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: '36px',
    fontWeight: '800',
    margin: '0 0 24px 0',
  },
  currency: {
    fontSize: '20px',
    fontWeight: '500',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
  },
  quickAction: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '14px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '14px',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    color: '#888',
    fontSize: '13px',
  },
  statAmount: {
    fontSize: '18px',
    fontWeight: '700',
  },
  transactionsSection: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '20px',
    padding: '24px',
  },
  transactionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
  },
  seeAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'transparent',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px',
    background: '#111',
    borderRadius: '14px',
    transition: 'background 0.2s ease',
    cursor: 'pointer',
  },
  transactionIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  transactionLabel: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
  },
  transactionDate: {
    color: '#666',
    fontSize: '13px',
  },
  transactionAmount: {
    textAlign: 'right',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 20px',
  },
  emptyText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    margin: '16px 0 8px',
  },
  emptySubtext: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
};

export default Dashboard;
