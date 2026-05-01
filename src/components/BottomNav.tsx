import Link from 'next/link';

export function BottomNav({ currentPath }: { currentPath: string }) {
  const isTracker = currentPath === '/';
  const isReports = currentPath === '/reports';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg flex justify-around items-center px-8 pb-4 z-50 border-t border-slate-100 max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
      <Link href="/" className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform ${isTracker ? 'text-green-600' : 'text-slate-400 hover:opacity-80'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isTracker ? "'FILL' 1" : "'FILL' 0" }}>timer</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">Tracker</span>
      </Link>
      <Link href="/reports" className={`flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform ${isReports ? 'text-green-600' : 'text-slate-400 hover:opacity-80'}`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: isReports ? "'FILL' 1" : "'FILL' 0" }}>bar_chart</span>
        <span className="text-[11px] font-medium uppercase tracking-wider">Reports</span>
      </Link>
    </nav>
  );
}
