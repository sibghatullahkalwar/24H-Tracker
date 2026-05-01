import React, { useState } from 'react';

type AddSectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export function AddSectionModal({ isOpen, onClose, onSave }: AddSectionModalProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden">
        <div className="h-24 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500/50" style={{ fontSize: '64px' }}>category</span>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Add New Section</h2>
            <p className="text-sm text-slate-500 mt-1">Create a category to organize your tasks.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Name</label>
            <input 
              className="w-full h-14 px-4 rounded-[16px] border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium focus:border-green-500 focus:ring-0 outline-none transition-all placeholder:text-slate-400" 
              placeholder="Section Name (e.g., Reading)" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={handleSave}
              className="h-14 w-full bg-green-700 text-white rounded-[16px] font-semibold active:scale-95 transition-transform shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">save</span>
              Save Section
            </button>
            <button 
              onClick={onClose}
              className="h-14 w-full bg-transparent text-slate-500 rounded-[16px] font-semibold hover:bg-slate-50 active:scale-95 transition-transform flex items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
