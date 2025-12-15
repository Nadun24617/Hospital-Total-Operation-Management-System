

import { useAuth } from '../auth';

interface SidePanelProps {
  items: { label: string; icon?: React.ReactNode; onClick?: () => void }[];
  activeIndex?: number;
}

export default function SidePanel({ items, activeIndex = 0 }: SidePanelProps) {
  const { logout } = useAuth();
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 text-2xl font-bold text-primary-700 border-b border-gray-100">Dashboard</div>
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item, idx) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors font-medium hover:bg-primary-50 focus:outline-none focus:bg-primary-100 ${
              idx === activeIndex ? 'bg-primary-100 text-primary-700' : 'text-gray-700'
            }`}
            onClick={item.onClick}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-600 font-semibold bg-red-50 hover:bg-red-100 transition-colors"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
