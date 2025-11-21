import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { postJson } from '../api/client';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';
import { useSocialAuthTest } from '../hooks/useSocialAuthTest';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const navigate = useNavigate();
  const { error: socialError } = useSocialAuthTest();

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
    // Limpiar error cuando el usuario completa reCAPTCHA
    if (token) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validar que reCAPTCHA esté completado
    if (!recaptchaToken) {
      setError('Por favor completa el reCAPTCHA');
      return;
    }
    
    setLoading(true);

    try {
      const response = await postJson('/api/auth/login', {
        email,
        password,
        recaptchaToken,
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);
      navigate('/dashboard');
    } catch (err) {
      // Limpiar reCAPTCHA en caso de error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);
      
      // Mostrar mensaje de error más específico
      if (err instanceof Error && err.message.includes('reCAPTCHA')) {
        setError('reCAPTCHA inválido. Por favor intenta de nuevo.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-3">Login</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {socialError && <div className="alert alert-error">{socialError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={(import.meta as any).env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
            onChange={handleRecaptchaChange}
            theme="light"
          />
        </div>
        <button type="submit" className="btn btn-block" disabled={loading || !recaptchaToken}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Botones de login social */}
      <SocialLoginButtons 
        onSocialLoginSuccess={(_user, provider) => {
          console.log(`Login social exitoso con ${provider}`)
        }}
        onSocialLoginError={(error) => {
          setError(error)
        }}
      />
      
      <p className="text-center mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;