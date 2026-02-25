import React from 'react';
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Settings, Menu, X } from 'lucide-react';
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

  const [mobileOpen, setMobileOpen] = React.useState(false);

  let activeSection = 'home';
  if (location.pathname === '/about') activeSection = 'hospital';
  else if (location.pathname.includes('appointments')) activeSection = 'appointments';
  else if (location.pathname.includes('doctors')) activeSection = 'doctors';

  const handleNavClick = (id: string) => {
    setMobileOpen(false);

    if (id === 'home') navigate('/');
    else if (id === 'hospital') navigate('/about');
    else if (id === 'appointments') navigate('/my-appointments');
    else if (id === 'doctors') navigate('/doctors');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Brand */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2"
          >
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold hidden sm:inline">
              ABC Hospital
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                activeSection === 'home'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Home
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  activeSection === link.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Desktop Login */}
            {!isLoggedIn && (
              <div className="hidden md:block">
                <Button size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Profile */}
            {isLoggedIn && (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback>
                          {user?.firstName?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user?.firstName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-lg hover:bg-muted"
            >
              Home
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left px-3 py-2 rounded-lg hover:bg-muted"
              >
                {link.label}
              </button>
            ))}

            {!isLoggedIn && (
              <Button className="mt-4" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardNavBar;