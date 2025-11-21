import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTransactions } from '../services/transactionService';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  useEffect(() => {
    loadTransactions();
  }, [currentPage]);

  const loadTransactions = async () => {
    try {
      const result = await getTransactions(currentPage, limit);
      if (result.success) {
        setTransactions(result.data.transactions || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
      } else {
        toast.error(result.error || 'Failed to load transactions');
      }
      setLoading(false);
    } catch (error) {
      console.error('Load transactions error:', error);
      setLoading(false);
      toast.error('Failed to load transactions');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
    toast.success('Transactions refreshed');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter !== 'all' && t.type !== filter) return false;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        t.label?.toLowerCase().includes(search) ||
        t.transaction_id?.toLowerCase().includes(search) ||
        t.amount?.toString().includes(search)
      );
    }
    return true;
  });

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
        <p style={styles.loadingText}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Transaction History</h1>
          <p style={styles.subtitle}>View all your transactions</p>
        </div>
        <button 
          style={styles.refreshButton} 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={20} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryIcon, background: 'rgba(16, 185, 129, 0.15)' }}>
            <ArrowDown size={24} color="#10b981" />
          </div>
          <div>
            <p style={styles.summaryLabel}>Total Income</p>
            <p style={{ ...styles.summaryAmount, color: '#10b981' }}>
              {totalIncome.toLocaleString()} Rwf
            </p>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={{ ...styles.summaryIcon, background: 'rgba(239, 68, 68, 0.15)' }}>
            <ArrowUp size={24} color="#ef4444" />
          </div>
          <div>
            <p style={styles.summaryLabel}>Total Expenses</p>
            <p style={{ ...styles.summaryAmount, color: '#ef4444' }}>
              {totalExpense.toLocaleString()} Rwf
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterWrapper}>
          <Filter size={18} color="#666" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="in">Income</option>
            <option value="out">Expenses</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div style={styles.transactionsCard}>
        {filteredTransactions.length > 0 ? (
          <div style={styles.transactionsList}>
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} style={styles.transactionItem}>
                <div style={{
                  ...styles.transactionIcon,
                  background: transaction.type === 'in' 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'rgba(239, 68, 68, 0.15)'
                }}>
                  {transaction.type === 'in' ? (
                    <ArrowDown size={22} color="#10b981" />
                  ) : (
                    <ArrowUp size={22} color="#ef4444" />
                  )}
                </div>

                <div style={styles.transactionDetails}>
                  <p style={styles.transactionLabel}>{transaction.label}</p>
                  <p style={styles.transactionDate}>
                    {new Date(transaction.created_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })} • {new Date(transaction.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  {transaction.transaction_id && (
                    <p style={styles.transactionId}>ID: {transaction.transaction_id}</p>
                  )}
                </div>

                <div style={styles.transactionRight}>
                  <p style={{
                    ...styles.transactionAmount,
                    color: transaction.type === 'in' ? '#10b981' : '#ef4444'
                  }}>
                    {transaction.type === 'in' ? '+' : '-'}
                    {parseFloat(transaction.amount).toLocaleString()} Rwf
                  </p>
                  <span style={{
                    ...styles.statusBadge,
                    background: transaction.status === 'completed' 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : transaction.status === 'pending'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                    color: transaction.status === 'completed' 
                      ? '#10b981' 
                      : transaction.status === 'pending'
                      ? '#f59e0b'
                      : '#ef4444',
                  }}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Search size={48} color="#333" />
            <p style={styles.emptyText}>No transactions found</p>
            <p style={styles.emptySubtext}>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Start sending or receiving money'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {})
              }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            <span style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages ? styles.pageButtonDisabled : {})
              }}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
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
  },
  summaryContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  summaryIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    color: '#888',
    fontSize: '13px',
    margin: '0 0 4px 0',
  },
  summaryAmount: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  searchWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '0 16px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '14px 12px',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
  },
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '0 16px',
    gap: '8px',
  },
  filterSelect: {
    background: 'transparent',
    border: 'none',
    padding: '14px 8px',
    fontSize: '15px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  transactionsCard: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '20px',
    padding: '20px',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#111',
    borderRadius: '14px',
    transition: 'background 0.2s ease',
  },
  transactionIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  transactionDetails: {
    flex: 1,
    minWidth: 0,
  },
  transactionLabel: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  transactionDate: {
    color: '#666',
    fontSize: '13px',
    margin: 0,
  },
  transactionId: {
    color: '#555',
    fontSize: '12px',
    margin: '4px 0 0 0',
  },
  transactionRight: {
    textAlign: 'right',
    flexShrink: 0,
  },
  transactionAmount: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 6px 0',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    margin: '20px 0 8px',
  },
  emptySubtext: {
    color: '#666',
    fontSize: '14px',
    margin: 0,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #222',
  },
  pageButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#111',
    border: '1px solid #222',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  pageInfo: {
    color: '#888',
    fontSize: '14px',
  },
};

export default Transactions;
