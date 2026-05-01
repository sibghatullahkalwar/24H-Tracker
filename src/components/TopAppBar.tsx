import React from 'react';

export function TopAppBar({ title, onAddClick }: { title: string, onAddClick?: () => void }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  
  return (
    <header className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/50 shadow-sm flex items-center justify-between px-5 h-16 w-full max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-green-600">schedule</span>
        <span className="text-xl font-extrabold text-slate-900">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-title-sm text-body-md text-slate-500">{today}</p>
        </div>
        {onAddClick && (
          <button onClick={onAddClick} className="text-green-600 transition-colors hover:bg-slate-100 p-2 rounded-full active:scale-95 duration-200">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
        )}
      </div>
    </header>
  );
}
