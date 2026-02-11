import React from 'react';
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <nav className="w-full bg-white border-b border-border px-6 py-3 flex items-center">
      <div className="text-xl font-semibold text-foreground select-none">ABC Hospital</div>
      <div className="flex-1 flex items-center justify-center gap-2 md:gap-6">
        <Button
          variant={activeSection === 'home' ? 'secondary' : 'ghost'}
          className={`min-h-[44px] px-4 text-lg font-medium ${
            activeSection === 'home'
              ? 'text-primary bg-accent font-semibold hover:bg-accent'
              : 'text-muted-foreground hover:bg-accent'
          }`}
          onClick={() => handleNavClick('home')}
          aria-current={activeSection === 'home' ? 'page' : undefined}
        >
          Home
        </Button>
        {navLinks.map((link) => (
          <Button
            key={link.id}
            variant={activeSection === link.id ? 'secondary' : 'ghost'}
            className={`min-h-[44px] px-4 text-lg font-medium ${
              activeSection === link.id
                ? 'text-primary bg-accent font-semibold hover:bg-accent'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            onClick={() => handleNavClick(link.id)}
            aria-current={activeSection === link.id ? 'page' : undefined}
          >
            {link.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-end ml-4">
        {!isLoggedIn && (
          <Button
            variant="outline"
            className="border-border text-primary hover:bg-accent font-medium"
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
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-border">
                  <Avatar className="h-10 w-10">
                    {profilePhoto ? (
                      <AvatarImage src={profilePhoto} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />
                      </svg>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
                <div className="flex flex-col items-center gap-2 p-4">
                  <Avatar className="h-16 w-16 border border-border">
                    {profilePhoto ? (
                      <AvatarImage src={profilePhoto} alt="Profile" />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenuLabel className="text-lg text-foreground">
                    {user?.firstName || 'User'}
                  </DropdownMenuLabel>
                  <span className="text-muted-foreground text-sm">{user?.email || ''}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer justify-center text-foreground font-medium"
                  onClick={() => alert('Edit profile (implement as needed)')}
                >
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer justify-center text-destructive font-medium"
                  onClick={() => logout()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  );
};

export default PatientDashboardNavBar;
