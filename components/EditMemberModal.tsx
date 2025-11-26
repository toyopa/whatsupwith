import React, { useState, useRef } from 'react';
import { Member, Family, Update } from '../types';
import { HIGHLIGHT_CATEGORIES } from '../constants';
import { Camera, Upload, Sparkles, X, Plus, Trash } from 'lucide-react';
import { generateHolidayGreeting, generateMemberImage } from '../services/geminiService';

interface EditMemberModalProps {
  member?: Member; // If null, creating new
  family: Family;
  onSave: (member: Member) => void;
  onClose: () => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, family, onSave, onClose }) => {
  const [name, setName] = useState(member?.name || '');
  const [subFamily, setSubFamily] = useState(member?.subFamily || family.subFamilies[0] || '');
  const [childGroup, setChildGroup] = useState(member?.childGroup || '');
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl || '');
  const [updates, setUpdates] = useState<Update[]>(member?.updates || [{ category: 'Work', text: '' }]);
  const [greeting, setGreeting] = useState(member?.greeting || '');
  const [isGeneratingGreeting, setIsGeneratingGreeting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handlers
  const handleUpdateChange = (index: number, field: keyof Update, value: string) => {
    const newUpdates = [...updates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setUpdates(newUpdates);
  };

  const addUpdate = () => setUpdates([...updates, { category: 'Life Event', text: '' }]);
  const removeUpdate = (index: number) => setUpdates(updates.filter((_, i) => i !== index));

  const handleGenerateGreeting = async () => {
    setIsGeneratingGreeting(true);
    const text = await generateHolidayGreeting(name, updates, 'funny'); // Defaulting to funny for demo
    setGreeting(text);
    setIsGeneratingGreeting(false);
  };

  const handleGenerateImage = async () => {
     if (!name) return alert("Please enter a name first.");
     setIsGeneratingImage(true);
     const url = await generateMemberImage(`${name}, ${updates[0]?.text || 'happy person'}`);
     setPhotoUrl(url);
     setIsGeneratingImage(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      alert("Could not access camera");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      setPhotoUrl(canvas.toDataURL('image/jpeg'));
      
      // Stop stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setCameraActive(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setPhotoUrl(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: member?.id || Date.now().toString(),
      name,
      photoUrl: photoUrl || 'https://picsum.photos/400/600',
      subFamily,
      childGroup: childGroup.trim() || undefined,
      greeting,
      updates: updates.filter(u => u.text.trim() !== ''),
      reactions: member?.reactions || {},
      comments: member?.comments || []
    };
    onSave(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-brand-cream w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-brand-green p-4 flex justify-between items-center text-white">
          <h2 className="font-serif text-xl">{member ? 'Edit Member' : 'Add New Member'}</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Section: Photo & Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Section */}
            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative border-2 border-dashed border-brand-green/30 flex items-center justify-center group">
                 {cameraActive ? (
                   <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                 ) : photoUrl ? (
                   <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-gray-400 text-sm text-center px-2">No photo selected</span>
                 )}
                 
                 {cameraActive && (
                    <button type="button" onClick={capturePhoto} className="absolute bottom-4 bg-white text-black px-4 py-1 rounded-full shadow-lg">Capture</button>
                 )}
              </div>
              
              <div className="flex gap-2 justify-center">
                 {!cameraActive && (
                    <>
                    <button type="button" onClick={startCamera} className="p-2 bg-brand-sage rounded-full hover:bg-brand-gold hover:text-white transition" title="Camera"><Camera size={18} /></button>
                    <label className="p-2 bg-brand-sage rounded-full hover:bg-brand-gold hover:text-white transition cursor-pointer" title="Upload">
                      <Upload size={18} />
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                    <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage} className="p-2 bg-brand-sage rounded-full hover:bg-brand-gold hover:text-white transition" title="AI Generate">
                      {isGeneratingImage ? <span className="animate-spin">✨</span> : <Sparkles size={18} />}
                    </button>
                    </>
                 )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
               <div>
                 <label className="block text-sm font-bold text-brand-green mb-1">Name</label>
                 <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-brand-sage rounded focus:outline-brand-gold" placeholder="Member Name" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-brand-green mb-1">Household</label>
                    <select value={subFamily} onChange={e => setSubFamily(e.target.value)} className="w-full p-2 border border-brand-sage rounded focus:outline-brand-gold">
                      {family.subFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-brand-green mb-1">Sub-Group (Optional)</label>
                    <input value={childGroup} onChange={e => setChildGroup(e.target.value)} className="w-full p-2 border border-brand-sage rounded focus:outline-brand-gold" placeholder="e.g. The Grandkids" />
                  </div>
               </div>

               {/* Updates */}
               <div>
                 <label className="block text-sm font-bold text-brand-green mb-1">Yearly Highlights</label>
                 {updates.map((update, idx) => (
                   <div key={idx} className="flex gap-2 mb-2">
                     <select 
                        value={update.category} 
                        onChange={e => handleUpdateChange(idx, 'category', e.target.value)}
                        className="w-1/3 p-2 text-sm border border-brand-sage rounded"
                     >
                       {HIGHLIGHT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <input 
                        value={update.text}
                        onChange={e => handleUpdateChange(idx, 'text', e.target.value)}
                        className="flex-1 p-2 text-sm border border-brand-sage rounded"
                        placeholder="What happened?"
                     />
                     <button type="button" onClick={() => removeUpdate(idx)} className="text-brand-cranberry hover:text-red-700"><Trash size={16}/></button>
                   </div>
                 ))}
                 <button type="button" onClick={addUpdate} className="text-sm text-brand-gold font-bold flex items-center gap-1 hover:text-brand-green"><Plus size={14}/> Add Update</button>
               </div>
            </div>
          </div>

          {/* AI Greeting */}
          <div className="border-t border-brand-sage pt-4">
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-brand-green">Holiday Greeting</label>
                <button 
                  type="button" 
                  onClick={handleGenerateGreeting}
                  disabled={isGeneratingGreeting}
                  className="text-xs bg-brand-gold/20 text-brand-green px-3 py-1 rounded-full flex items-center gap-1 hover:bg-brand-gold hover:text-white transition"
                >
                  <Sparkles size={12} />
                  {isGeneratingGreeting ? 'Writing...' : 'Write with AI'}
                </button>
             </div>
             <textarea 
               value={greeting} 
               onChange={e => setGreeting(e.target.value)}
               className="w-full p-3 border border-brand-sage rounded h-24 text-sm focus:outline-brand-gold"
               placeholder="Write a message or let AI do it..."
             />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-brand-green hover:bg-brand-sage rounded">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand-green text-white rounded shadow-lg hover:bg-brand-gold transition">Save Member</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;