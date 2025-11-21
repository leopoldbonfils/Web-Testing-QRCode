import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !pin) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!phone.startsWith('+250')) {
      toast.error('Phone must start with +250');
      return;
    }

    if (phone.length !== 13) {
      toast.error('Phone must be 13 characters (+250XXXXXXXXX)');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (pin.length < 4) {
      toast.error('PIN must be at least 4 digits');
      return;
    }

    setLoading(true);

    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      pin
    });

    setLoading(false);

    if (result.success) {
      login(result.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/login" style={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <h1 style={styles.headerTitle}>Create Account</h1>
        <p style={styles.headerSubtitle}>Join BluePay today!</p>
      </div>

      {/* Register Card */}
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={20} color="#666" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          {/* Phone Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
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

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} color="#666" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
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

          {/* Confirm Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} color="#666" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* PIN Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Transaction PIN</label>
            <div style={styles.inputWrapper}>
              <Shield size={20} color="#666" />
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="4-6 digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={styles.input}
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={styles.eyeButton}
              >
                {showPin ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={styles.loginContainer}>
          <span style={styles.loginText}>Already have an account? </span>
          <Link to="/login" style={styles.loginLink}>
            Sign In
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
    padding: '20px',
  },
  header: {
    maxWidth: '420px',
    margin: '0 auto 24px',
    padding: '20px 0',
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#3b82f6',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#fff',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#888',
    margin: 0,
  },
  card: {
    background: '#0a0a0a',
    borderRadius: '24px',
    border: '1px solid #222',
    padding: '32px',
    maxWidth: '420px',
    margin: '0 auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  inputGroup: {
    marginBottom: '18px',
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  },
  loginContainer: {
    textAlign: 'center',
    marginTop: '24px',
  },
  loginText: {
    color: '#888',
    fontSize: '15px',
  },
  loginLink: {
    color: '#3b82f6',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

export default Register;
