import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface CustomRecaptchaProps {
  onChange: (token: string | null) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

const CustomRecaptcha: React.FC<CustomRecaptchaProps> = ({ 
  onChange, 
  theme = 'dark', 
  className = '' 
}) => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Detectar si estamos en modo de prueba
    const siteKey = (import.meta as any).env.VITE_RECAPTCHA_SITE_KEY;
    setIsTestMode(!siteKey || siteKey.includes('6LeIxAcT'));
  }, []);

  const handleChange = (token: string | null) => {
    onChange(token);
  };

  if (isTestMode) {
    return (
      <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center ${className}`}>
        <div className="text-yellow-200 text-sm mb-2">
          🔒 Modo de prueba activado - reCAPTCHA deshabilitado
        </div>
        <button
          type="button"
          onClick={() => handleChange('test-token-' + Date.now())}
          className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded text-xs transition-colors"
        >
          Simular verificación
        </button>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ReCAPTCHA
        sitekey={(import.meta as any).env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
        onChange={handleChange}
        theme={theme}
      />
    </div>
  );
};

export default CustomRecaptcha;