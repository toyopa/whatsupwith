import React, { useState } from 'react';
import { processPayment } from '../services/paymentService';
import { Star, X } from 'lucide-react';

interface PremiumModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    await processPayment();
    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-green/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-gold to-yellow-300"></div>

        <div className="text-center">
          <div className="inline-block p-4 bg-brand-gold/20 rounded-full mb-4">
            <Star className="text-brand-gold w-12 h-12 fill-current" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-green mb-2">Unlock Unlimited Fun</h2>
          <p className="text-gray-600 mb-6">
            The free plan supports up to 5 family members. Upgrade to <b>Premium</b> for unlimited cards, high-res photos, and more AI credits!
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
             <span className="text-4xl font-bold text-brand-green">$9.99</span>
             <span className="text-gray-500">/ year</span>
          </div>

          <button 
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-brand-green text-white py-3 rounded-lg font-bold text-lg hover:bg-brand-green/90 transition shadow-lg flex justify-center items-center"
          >
            {loading ? <span className="animate-spin mr-2">❄️</span> : null}
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
          
          <p className="mt-4 text-xs text-gray-400">Secure mock payment powered by HolidayMagic™</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;