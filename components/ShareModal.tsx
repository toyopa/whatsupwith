import React from 'react';
import { Copy, X } from 'lucide-react';

interface ShareModalProps {
  code: string;
  familyName: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ code, familyName, onClose }) => {
  const copyToClipboard = () => {
    const text = `Join the ${familyName} holiday update board! Use code: ${code}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 text-center shadow-2xl border-4 border-brand-gold">
        <div className="flex justify-end"><button onClick={onClose}><X size={20}/></button></div>
        <h3 className="font-serif text-2xl mb-2 text-brand-green">Invite Family</h3>
        <p className="mb-4 text-gray-600">Share this code with your loved ones so they can join.</p>
        
        <div className="bg-brand-cream p-4 rounded-lg border border-dashed border-brand-green mb-4">
          <span className="text-3xl font-mono font-bold tracking-widest text-brand-green">{code}</span>
        </div>

        <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 w-full bg-brand-green text-white py-2 rounded hover:bg-brand-green/90 transition">
          <Copy size={18} /> Copy Invite
        </button>
      </div>
    </div>
  );
};

export default ShareModal;