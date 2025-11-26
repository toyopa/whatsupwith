import React, { useState } from 'react';
import { INITIAL_FAMILY } from '../constants';
import { Family, UserMode } from '../types';

interface AuthScreenProps {
  onLogin: (mode: UserMode, family: Family) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'join' | 'admin' | 'create'>('join');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Create Form State
  const [newFamName, setNewFamName] = useState('');
  const [newFamCode, setNewFamCode] = useState('');
  const [newFamEmail, setNewFamEmail] = useState('');
  const [newFamPass, setNewFamPass] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, fetch from DB. Here we check mock.
    if (code.toUpperCase() === INITIAL_FAMILY.code) {
      onLogin(UserMode.GUEST, INITIAL_FAMILY);
    } else {
      alert("Invalid Family Code");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === INITIAL_FAMILY.adminEmail && password === INITIAL_FAMILY.password) {
       onLogin(UserMode.ADMIN, INITIAL_FAMILY);
    } else {
      alert("Invalid Credentials (Try kate@mccallister.com / password)");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFamCode.toUpperCase() === INITIAL_FAMILY.code) {
      alert("Code already taken");
      return;
    }
    const newFamily: Family = {
      id: `fam_${Date.now()}`,
      name: newFamName,
      code: newFamCode.toUpperCase(),
      adminEmail: newFamEmail,
      password: newFamPass,
      members: [],
      subFamilies: [`${newFamName} Household`],
      isPremium: false
    };
    onLogin(UserMode.ADMIN, newFamily);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
       <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-brand-green">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl text-brand-green font-medium mb-2">Whats Up With...</h1>
            <p className="text-brand-gold italic">Connect with your family this holiday.</p>
          </div>

          <div className="flex mb-6 border-b border-gray-200">
             <button onClick={() => setTab('join')} className={`flex-1 pb-2 ${tab === 'join' ? 'border-b-2 border-brand-green font-bold text-brand-green' : 'text-gray-400'}`}>Join</button>
             <button onClick={() => setTab('admin')} className={`flex-1 pb-2 ${tab === 'admin' ? 'border-b-2 border-brand-green font-bold text-brand-green' : 'text-gray-400'}`}>Admin</button>
             <button onClick={() => setTab('create')} className={`flex-1 pb-2 ${tab === 'create' ? 'border-b-2 border-brand-green font-bold text-brand-green' : 'text-gray-400'}`}>Create</button>
          </div>

          {tab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-green mb-1">Family Code</label>
                <input required value={code} onChange={e => setCode(e.target.value)} className="w-full p-3 border rounded focus:outline-brand-gold uppercase tracking-widest" placeholder="e.g. FUN2025" />
              </div>
              <button type="submit" className="w-full bg-brand-green text-white py-3 rounded font-bold hover:bg-brand-green/90 transition">Enter</button>
            </form>
          )}

          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
               <div>
                <label className="block text-sm font-bold text-brand-green mb-1">Admin Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded focus:outline-brand-gold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-green mb-1">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded focus:outline-brand-gold" />
              </div>
              <button type="submit" className="w-full bg-brand-green text-white py-3 rounded font-bold hover:bg-brand-green/90 transition">Login</button>
            </form>
          )}

          {tab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-3">
               <div>
                <label className="block text-xs font-bold text-brand-green mb-1">Family Name</label>
                <input required value={newFamName} onChange={e => setNewFamName(e.target.value)} className="w-full p-2 border rounded focus:outline-brand-gold" placeholder="The Smiths" />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-green mb-1">Unique Code</label>
                <input required value={newFamCode} onChange={e => setNewFamCode(e.target.value)} className="w-full p-2 border rounded focus:outline-brand-gold uppercase" placeholder="SMITH25" />
                <p className="text-[11px] text-gray-400 mt-1 italic">Make sure to make it unique!</p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-brand-green mb-1">Email</label>
                  <input type="email" required value={newFamEmail} onChange={e => setNewFamEmail(e.target.value)} className="w-full p-2 border rounded focus:outline-brand-gold" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-brand-green mb-1">Password</label>
                  <input type="password" required value={newFamPass} onChange={e => setNewFamPass(e.target.value)} className="w-full p-2 border rounded focus:outline-brand-gold" />
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-gold text-brand-green py-3 rounded font-bold hover:brightness-110 transition mt-2">Create & Start</button>
            </form>
          )}
       </div>
    </div>
  );
};

export default AuthScreen;