"use client";

import { useState, useEffect } from 'react';
import { TopAppBar } from '@/components/TopAppBar';
import { BottomNav } from '@/components/BottomNav';
import { SectionCard } from '@/components/SectionCard';
import { AddSectionModal } from '@/components/AddSectionModal';

type Section = { id: string; name: string };
type Session = { id: string; sectionId: string; startTime: string; isActive: boolean };

export default function TrackerDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [secRes, sessRes] = await Promise.all([
        fetch('/api/sections'),
        fetch('/api/sessions/active')
      ]);
      if (secRes.ok) setSections(await secRes.json());
      if (sessRes.ok) {
        const data = await sessRes.json();
        setActiveSession(data.session);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSection = async (name: string) => {
    const res = await fetch('/api/sections', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (res.ok) fetchData();
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    if (activeSession?.sectionId === id) setActiveSession(null);
    fetchData();
  };

  const handleStartTimer = async (sectionId: string) => {
    // Optimistic UI
    setActiveSession({ id: 'temp', sectionId, startTime: new Date().toISOString(), isActive: true });
    
    const res = await fetch('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ sectionId }),
    });
    if (res.ok) fetchData(); // refresh to get real IDs and precise start time
  };

  const handleStopTimer = async () => {
    // Optimistic UI
    setActiveSession(null);
    
    const res = await fetch('/api/sessions/stop', { method: 'POST' });
    if (res.ok) fetchData();
  };

  return (
    <div className="pb-28">
      <TopAppBar title="TimeTrack" onAddClick={() => setIsModalOpen(true)} />
      
      <main className="max-w-md mx-auto px-5 pt-6 space-y-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-green-100 text-green-800 h-14 rounded-[16px] flex items-center justify-center gap-2 font-semibold shadow-sm active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
          Add Section
        </button>

        {loading ? (
          <div className="text-center text-slate-400 py-10">Loading...</div>
        ) : sections.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No sections yet. Create one!</div>
        ) : (
          <div className="space-y-4">
            {sections.map(section => (
              <SectionCard 
                key={section.id}
                sectionId={section.id}
                name={section.name}
                isActive={activeSession?.sectionId === section.id}
                startTime={activeSession?.sectionId === section.id ? activeSession.startTime : null}
                onStart={handleStartTimer}
                onStop={handleStopTimer}
                onDelete={handleDeleteSection}
              />
            ))}
          </div>
        )}
      </main>

      <AddSectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddSection} 
      />
      
      <BottomNav currentPath="/" />
    </div>
  );
}
