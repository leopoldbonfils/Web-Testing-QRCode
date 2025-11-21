import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone } from 'lucide-react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    const result = await login(email.trim(), password);

    setLoading(false);

    if (result.success) {
      authLogin(result.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <Smartphone size={48} color="#fff" />
        </div>
        <h1 style={styles.appName}>BluePay</h1>
        <p style={styles.tagline}>Contactless Payment Solution</p>
      </div>

      {/* Login Card */}
      <div style={styles.card}>
        <h2 style={styles.welcomeText}>Welcome Back!</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} color="#666" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} color="#666" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={styles.registerContainer}>
          <span style={styles.registerText}>Don't have an account? </span>
          <Link to="/register" style={styles.registerLink}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
  },
  appName: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 8px 0',
    letterSpacing: '1px',
  },
  tagline: {
    fontSize: '16px',
    color: '#888',
    margin: 0,
  },
  card: {
    background: '#0a0a0a',
    borderRadius: '24px',
    border: '1px solid #222',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  welcomeText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#888',
    margin: '0 0 32px 0',
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
  eyeButton: {
    background: 'transparent',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '24px',
  },
  forgotLink: {
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  },
  registerContainer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  registerText: {
    color: '#888',
    fontSize: '15px',
  },
  registerLink: {
    color: '#3b82f6',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

export default Login;
