import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidePanelProps {
  items: { label: string; icon?: React.ReactNode; onClick?: () => void }[];
  activeIndex?: number;
}

export default function SidePanel({ items, activeIndex = 0 }: SidePanelProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="p-6 text-2xl font-bold text-primary-700 border-b border-gray-100">Dashboard</div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, idx) => (
          <Button
            key={item.label}
            variant={idx === activeIndex ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-3 font-medium ${
              idx === activeIndex ? 'bg-primary-100 text-primary-700 hover:bg-primary-100' : 'text-gray-700 hover:bg-primary-50'
            }`}
            onClick={item.onClick}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
      <Separator />
      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
