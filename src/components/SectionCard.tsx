import React from 'react';
import { useTimer } from '@/hooks/useTimer';

type SectionCardProps = {
  sectionId: string;
  name: string;
  isActive: boolean;
  startTime: string | null;
  onStart: (id: string) => void;
  onStop: () => void;
  onDelete: (id: string) => void;
};

export function SectionCard({ sectionId, name, isActive, startTime, onStart, onStop, onDelete }: SectionCardProps) {
  const { formattedTime } = useTimer(isActive ? startTime : null);

  return (
    <div className={`bg-white rounded-[16px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] ${isActive ? 'border-2 border-green-500/10' : 'border border-slate-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-2xl text-slate-900">{name}</h3>
          <p className="text-slate-500 text-xs font-bold tracking-wider opacity-60 uppercase mt-1">TRACKING</p>
        </div>
        <button onClick={() => onDelete(sectionId)} className="text-slate-400 hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

      <div className="py-4 flex flex-col items-center">
        <h2 className={`text-4xl font-bold tabular-nums tracking-tight ${isActive ? 'text-green-700' : 'text-slate-400 opacity-50'}`}>
          {isActive ? formattedTime : '00:00:00'}
        </h2>
      </div>

      <div className="flex items-center gap-4 pt-2">
        {isActive ? (
          <button 
            onClick={onStop}
            className="flex-1 bg-red-100 text-red-700 h-14 rounded-[16px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
            Stop
          </button>
        ) : (
          <button 
            onClick={() => onStart(sectionId)}
            className="flex-1 bg-green-500 text-white h-14 rounded-[16px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            Start
          </button>
        )}
      </div>
    </div>
  );
}
