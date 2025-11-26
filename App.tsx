import React, { useState } from 'react';
import { Family, Member, UserMode, UserSession } from './types';
import SnowEffect from './components/SnowEffect';
import AuthScreen from './components/AuthScreen';
import MemberCard from './components/MemberCard';
import EditMemberModal from './components/EditMemberModal';
import SettingsModal from './components/SettingsModal';
import ShareModal from './components/ShareModal';
import PremiumModal from './components/PremiumModal';
import { Settings, Share2, LogOut, PlusCircle, ChevronDown, ChevronRight, Crown } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({ mode: UserMode.NONE, familyId: null });
  const [family, setFamily] = useState<Family | null>(null);
  
  // UI State
  const [editingMember, setEditingMember] = useState<Member | null | undefined>(undefined); // undefined = closed, null = new, Member = edit
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  
  // Hierarchy Collapse State
  const [collapsedHouseholds, setCollapsedHouseholds] = useState<Record<string, boolean>>({});

  const handleLogin = (mode: UserMode, fam: Family) => {
    setSession({ mode, familyId: fam.id });
    setFamily(fam);
  };

  const handleLogout = () => {
    setSession({ mode: UserMode.NONE, familyId: null });
    setFamily(null);
  };

  const toggleHousehold = (household: string) => {
    setCollapsedHouseholds(prev => ({ ...prev, [household]: !prev[household] }));
  };

  // CRUD & Interactions
  const saveMember = (updatedMember: Member) => {
    if (!family) return;
    
    // Check if new member (id doesn't exist in current list)
    const exists = family.members.find(m => m.id === updatedMember.id);
    let newMembers = [...family.members];
    
    if (exists) {
      newMembers = newMembers.map(m => m.id === updatedMember.id ? updatedMember : m);
    } else {
      newMembers.push(updatedMember);
    }

    setFamily({ ...family, members: newMembers });
    setEditingMember(undefined);
  };

  const handleAddClick = () => {
    if (family && !family.isPremium && family.members.length >= 5) {
      setShowPremium(true);
    } else {
      setEditingMember(null);
    }
  };

  const handleReaction = (memberId: string, reaction: string) => {
    if (!family) return;
    const updatedMembers = family.members.map(m => {
      if (m.id === memberId) {
        const newReactions = { ...m.reactions };
        newReactions[reaction] = (newReactions[reaction] || 0) + 1;
        return { ...m, reactions: newReactions };
      }
      return m;
    });
    setFamily({ ...family, members: updatedMembers });
  };

  const handleComment = (memberId: string, text: string) => {
    if (!family) return;
    const updatedMembers = family.members.map(m => {
      if (m.id === memberId) {
        const newComment = {
          id: Date.now().toString(),
          author: session.mode === UserMode.ADMIN ? 'Admin' : 'Guest', // Simplified for demo
          text,
          timestamp: Date.now()
        };
        return { ...m, comments: [...m.comments, newComment] };
      }
      return m;
    });
    setFamily({ ...family, members: updatedMembers });
  };

  const handlePremiumSuccess = () => {
    if (family) {
      setFamily({ ...family, isPremium: true });
    }
  };

  // Rendering Helper: Hierarchy Level 2 & 3
  const renderHousehold = (householdName: string) => {
    if (!family) return null;
    const isCollapsed = collapsedHouseholds[householdName];
    
    // Filter members for this household
    const houseMembers = family.members.filter(m => m.subFamily === householdName);
    
    // Separate into "No Child Group" (Parents/Head) and "Groups" (Kids/Branches)
    const ungroupedMembers = houseMembers.filter(m => !m.childGroup);
    
    // Get unique Child Groups
    const childGroups = Array.from(new Set(houseMembers.map(m => m.childGroup).filter(Boolean) as string[]));

    return (
      <div className="mb-8 border border-brand-green/10 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm transition-all">
        {/* Level 1 Header: Household */}
        <div 
          onClick={() => toggleHousehold(householdName)}
          className="bg-brand-green p-4 flex justify-between items-center cursor-pointer text-brand-cream hover:bg-brand-green/90"
        >
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            {isCollapsed ? <ChevronRight /> : <ChevronDown />}
            {householdName}
          </h2>
          <span className="text-xs bg-brand-gold/20 px-2 py-1 rounded text-brand-gold">{houseMembers.length} Members</span>
        </div>

        {!isCollapsed && (
          <div className="p-6">
            {/* Ungrouped Members (Heads of House) */}
            {ungroupedMembers.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                {ungroupedMembers.map(member => (
                  <MemberCard 
                    key={member.id} 
                    member={member} 
                    userMode={session.mode}
                    onEdit={setEditingMember}
                    onReact={handleReaction}
                    onComment={handleComment}
                  />
                ))}
              </div>
            )}

            {/* Level 2 Groups */}
            {childGroups.map(groupName => (
              <div key={groupName} className="mb-6 bg-brand-sage/30 p-4 rounded-xl border border-brand-sage">
                 <h3 className="font-serif text-xl font-bold text-brand-green mb-4 border-b border-brand-green/20 pb-2 inline-block">
                    {groupName}
                 </h3>
                 <div className="flex flex-wrap justify-center gap-6">
                    {houseMembers
                      .filter(m => m.childGroup === groupName)
                      .map(member => (
                        <MemberCard 
                          key={member.id} 
                          member={member} 
                          userMode={session.mode}
                          onEdit={setEditingMember}
                          onReact={handleReaction}
                          onComment={handleComment}
                        />
                      ))
                    }
                 </div>
              </div>
            ))}
            
            {houseMembers.length === 0 && (
              <div className="text-center text-gray-400 py-4 italic">No members in this household yet.</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Main View
  if (session.mode === UserMode.NONE || !family) {
    return (
      <>
        <SnowEffect />
        <AuthScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SnowEffect />
      
      {/* App Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-md border-b border-brand-green/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-brand-green font-bold flex items-center gap-2">
              Whats Up With {family.name}
              {family.isPremium && <Crown size={16} className="text-brand-gold fill-current" />}
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {session.mode === UserMode.ADMIN && (
                <>
                  <button 
                    onClick={handleAddClick}
                    className="flex items-center gap-1 bg-brand-green text-white px-3 py-1.5 rounded-full text-sm hover:bg-brand-gold transition"
                  >
                    <PlusCircle size={16} /> Add Update
                  </button>
                  <button onClick={() => setShowSettings(true)} className="p-2 text-brand-green hover:bg-gray-100 rounded-full"><Settings size={20}/></button>
                </>
             )}
             <button onClick={() => setShowShare(true)} className="p-2 text-brand-green hover:bg-gray-100 rounded-full"><Share2 size={20}/></button>
             <button onClick={handleLogout} className="p-2 text-brand-cranberry hover:bg-red-50 rounded-full"><LogOut size={20}/></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10 pb-32">
         {family.subFamilies.length === 0 && (
           <div className="text-center mt-20">
             <h2 className="text-2xl font-serif mb-4">Welcome!</h2>
             <p>No households set up yet. Go to Settings to create your first Household/Pod.</p>
           </div>
         )}
         
         {family.subFamilies.map(householdName => (
           <div key={householdName}>{renderHousehold(householdName)}</div>
         ))}
      </main>

      {/* Modals */}
      {editingMember !== undefined && (
        <EditMemberModal 
          member={editingMember || undefined} 
          family={family} 
          onSave={saveMember} 
          onClose={() => setEditingMember(undefined)} 
        />
      )}

      {showSettings && (
        <SettingsModal 
          family={family} 
          onUpdateFamily={setFamily} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {showShare && (
        <ShareModal 
          code={family.code} 
          familyName={family.name} 
          onClose={() => setShowShare(false)} 
        />
      )}

      {showPremium && (
        <PremiumModal 
           onSuccess={handlePremiumSuccess} 
           onClose={() => setShowPremium(false)} 
        />
      )}
    </div>
  );
};

export default App;