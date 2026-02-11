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
    <aside className="h-screen w-64 bg-white border-r border-border flex flex-col">
      <div className="p-6 text-xl font-semibold text-foreground border-b border-border">Dashboard</div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, idx) => (
          <Button
            key={item.label}
            variant={idx === activeIndex ? 'secondary' : 'ghost'}
            className={`w-full justify-start gap-3 font-medium ${
              idx === activeIndex ? 'bg-accent text-foreground hover:bg-accent' : 'text-muted-foreground hover:bg-accent'
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
          className="w-full bg-red-50 text-destructive hover:bg-red-100 hover:text-destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
