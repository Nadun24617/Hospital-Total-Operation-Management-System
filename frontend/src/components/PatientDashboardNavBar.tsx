import React from 'react';
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavLink {
  label: string;
  id: string;
}

interface PatientDashboardNavBarProps {
  navLinks: NavLink[];
}

const PatientDashboardNavBar: React.FC<PatientDashboardNavBarProps> = ({ navLinks }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  let activeSection = 'home';
  if (location.pathname === '/about') activeSection = 'hospital';
  else if (location.pathname.includes('appointments')) activeSection = 'appointments';
  else if (location.pathname.includes('doctors')) activeSection = 'doctors';

  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(() => {
    const stored = localStorage.getItem('profilePhoto');
    return stored ? stored : null;
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePhoto(ev.target?.result as string);
        localStorage.setItem('profilePhoto', ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavClick = (id: string) => {
    if (id === 'home') {
      if (location.pathname !== '/') navigate('/');
    } else if (id === 'hospital') {
      if (location.pathname !== '/about') navigate('/about');
    } else if (id === 'appointments') {
      if (location.pathname !== '/appointments') navigate('/appointments');
    } else if (id === 'doctors') {
      if (location.pathname !== '/doctors') navigate('/doctors');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Heart className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight hidden sm:inline">ABC Hospital</span>
        </button>

        {/* Nav Links */}
        <div className="flex-1 flex items-center justify-center gap-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'home'
                ? 'text-primary bg-primary/8'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-current={activeSection === 'home' ? 'page' : undefined}
          >
            Home
            {activeSection === 'home' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === link.id
                  ? 'text-primary bg-primary/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-current={activeSection === link.id ? 'page' : undefined}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <Button
              size="sm"
              className="font-medium"
              onClick={() => (window.location.href = '/login')}
            >
              Login
            </Button>
          )}
          {isLoggedIn && (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoChange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border border-border">
                      {profilePhoto ? (
                        <AvatarImage src={profilePhoto} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <Avatar className="h-10 w-10 border border-border">
                      {profilePhoto ? (
                        <AvatarImage src={profilePhoto} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
                        {user?.firstName || 'User'}
                      </DropdownMenuLabel>
                      <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-foreground"
                    onClick={() => alert('Edit profile (implement as needed)')}
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PatientDashboardNavBar;
