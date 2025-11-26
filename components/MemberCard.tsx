import React, { useState } from 'react';
import { Member, UserMode } from '../types';
import { REACTIONS } from '../constants';
import { Edit2, Send, MessageCircle } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  userMode: UserMode;
  onEdit: (member: Member) => void;
  onReact: (memberId: string, reaction: string) => void;
  onComment: (memberId: string, text: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, userMode, onEdit, onReact, onComment }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(member.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="w-full max-w-sm h-[500px] perspective-1000 group cursor-pointer my-4">
      <div
        className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden bg-brand-cream border-4 border-white">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-serif text-3xl font-bold mb-1">{member.name}</h3>
            {member.childGroup && (
              <span className="inline-block bg-brand-gold text-brand-green text-xs font-bold px-2 py-1 rounded-full mb-2">
                {member.childGroup}
              </span>
            )}
            <div className="flex gap-2 mt-2">
              {Object.entries(member.reactions)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([emoji, count]) => (
                  <div key={emoji} className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
                    {emoji} {count}
                  </div>
                ))}
            </div>
          </div>
          
          {userMode === UserMode.ADMIN && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(member);
              }}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-10"
            >
              <Edit2 size={18} />
            </button>
          )}
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-xl bg-brand-cream p-6 flex flex-col border-4 border-brand-gold overflow-hidden">
            <div className="flex justify-between items-start mb-4">
               <h4 className="font-serif text-xl text-brand-green font-bold">Highlights</h4>
               <button 
                 onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                 className="text-brand-green/50 hover:text-brand-green text-sm"
               >
                 Flip Back
               </button>
            </div>

            <div className="space-y-2 mb-4 max-h-32 overflow-y-auto no-scrollbar">
              {member.updates.map((update, idx) => (
                <div key={idx} className="flex gap-2 text-sm text-brand-green/80 border-b border-brand-sage pb-1 last:border-0">
                  <span className="font-bold text-brand-gold shrink-0">{update.category}:</span>
                  <span>{update.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-brand-sage/30 p-3 rounded-lg italic text-brand-green/70 text-sm mb-4 border-l-2 border-brand-gold">
              "{member.greeting}"
            </div>

            {/* Interactions */}
            <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-around mb-4 border-t border-brand-sage pt-2">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onReact(member.id, emoji)}
                    className="hover:scale-125 transition-transform text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="h-24 overflow-y-auto no-scrollbar bg-white rounded p-2 mb-2 border border-brand-sage">
                 {member.comments.length === 0 ? (
                   <p className="text-xs text-gray-400 text-center mt-2">No chatter yet.</p>
                 ) : (
                   member.comments.map(c => (
                     <div key={c.id} className="mb-2 text-xs">
                        <span className="font-bold text-brand-green">{c.author}: </span>
                        <span className="text-gray-600">{c.text}</span>
                     </div>
                   ))
                 )}
              </div>

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Say something nice..."
                  className="flex-1 bg-white border border-brand-sage rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-gold"
                />
                <button type="submit" className="text-brand-green hover:text-brand-gold">
                  <Send size={16} />
                </button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;