import React, { useState } from 'react';
import { Family } from '../types';
import { X, Plus, Trash } from 'lucide-react';

interface SettingsModalProps {
  family: Family;
  onUpdateFamily: (f: Family) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ family, onUpdateFamily, onClose }) => {
  const [subFamilies, setSubFamilies] = useState(family.subFamilies);
  const [newSub, setNewSub] = useState('');

  const addSub = () => {
    if (newSub && !subFamilies.includes(newSub)) {
      setSubFamilies([...subFamilies, newSub]);
      setNewSub('');
    }
  };

  const removeSub = (idx: number) => {
    setSubFamilies(subFamilies.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    onUpdateFamily({ ...family, subFamilies });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-brand-cream w-full max-w-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl text-brand-green">Household Settings</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-brand-green mb-2">Households (Pods)</label>
          <div className="flex gap-2 mb-2">
            <input 
              value={newSub} 
              onChange={e => setNewSub(e.target.value)} 
              className="flex-1 border border-brand-sage rounded px-3 py-2"
              placeholder="e.g. The Griswolds"
            />
            <button onClick={addSub} className="bg-brand-green text-white px-3 rounded"><Plus /></button>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {subFamilies.map((sub, i) => (
              <li key={i} className="flex justify-between items-center bg-white p-2 rounded border border-brand-sage">
                <span>{sub}</span>
                <button onClick={() => removeSub(i)} className="text-brand-cranberry"><Trash size={16}/></button>
              </li>
            ))}
          </ul>
        </div>

        <button onClick={handleSave} className="w-full bg-brand-gold text-brand-green font-bold py-2 rounded hover:brightness-110">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;