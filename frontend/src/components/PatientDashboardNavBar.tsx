import React from 'react';
import { useAuth } from '../auth';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavLink {
  label: string;
  id: string;
}

interface PatientDashboardNavBarProps {
  navLinks: NavLink[];
  activeSection: string;
  setActiveSection: (id: string) => void;
}


const PatientDashboardNavBar: React.FC<PatientDashboardNavBarProps> = ({ navLinks }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Determine active section from path
  let activeSection = 'home';
  if (location.pathname === '/about') activeSection = 'hospital';
  else if (location.pathname.includes('appointments')) activeSection = 'appointments';
  else if (location.pathname.includes('doctors')) activeSection = 'doctors';
    const [showProfilePopup, setShowProfilePopup] = React.useState(false);

    // Close popup on outside click
    const popupRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (!showProfilePopup) return;
      function handleClick(e: MouseEvent) {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
          setShowProfilePopup(false);
        }
      }
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [showProfilePopup]);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(() => {
    // Try to get from localStorage if available
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
  return (
    <nav className="w-full bg-white shadow px-6 py-4 flex items-center rounded-b-2xl">
      <div className="text-2xl font-bold text-blue-700 select-none">ABC Hospital</div>
      <div className="flex-1 flex items-center justify-center gap-2 md:gap-6">
        {/* Add Home button as the first nav item */}
        <button
          key="home"
          className={`relative min-h-[44px] px-4 text-lg font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            ${activeSection === 'home'
              ? 'text-blue-700 bg-blue-50 shadow font-semibold'
              : 'text-gray-800 hover:bg-blue-50'}
          `}
          style={{ boxShadow: activeSection === 'home' ? '0 4px 16px 0 rgba(59,130,246,0.07)' : undefined }}
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            }
          }}
          tabIndex={0}
          aria-current={activeSection === 'home' ? 'page' : undefined}
        >
          Home
          {activeSection === 'home' && (
            <span className="absolute left-2 right-2 -bottom-1 h-2 rounded-b bg-blue-100 z-0" />
          )}
        </button>
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`relative min-h-[44px] px-4 text-lg font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              ${activeSection === link.id
                ? 'text-blue-700 bg-blue-50 shadow font-semibold'
                : 'text-gray-800 hover:bg-blue-50'}
            `}
            style={{ boxShadow: activeSection === link.id ? '0 4px 16px 0 rgba(59,130,246,0.07)' : undefined }}
            onClick={() => {
              if (link.id === 'hospital') {
                if (location.pathname !== '/about') navigate('/about');
              } else if (link.id === 'appointments') {
                // Example: navigate('/appointments');
              } else if (link.id === 'doctors') {
                // Example: navigate('/doctors');
              }
            }}
            tabIndex={0}
            aria-current={activeSection === link.id ? 'page' : undefined}
          >
            {link.label}
            {activeSection === link.id && (
              <span className="absolute left-2 right-2 -bottom-1 h-2 rounded-b bg-blue-100 z-0" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-end ml-4">
        {!isLoggedIn && (
          <button
            className="px-4 py-2 rounded-full border border-blue-200 text-blue-500 bg-white hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400 font-semibold"
            title="Login"
            tabIndex={0}
            onClick={() => (window.location.href = '/login')}
          >
            Login
          </button>
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
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 focus:outline-none relative"
              title="Profile"
              onClick={() => setShowProfilePopup((v) => !v)}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-blue-400"
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
              )}
            </button>
            {showProfilePopup && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-blue-100 z-50 p-5 animate-fade-in"
                style={{ top: '3.5rem' }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300 mb-2 overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                  <div className="font-bold text-lg text-blue-700">{user?.firstName || 'User'}</div>
                  <div className="text-gray-500 text-sm mb-2">{user?.email || ''}</div>
                  <button
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 rounded-lg mb-2 transition"
                    onClick={() => alert('Edit profile (implement as needed)')}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition"
                    onClick={() => { setShowProfilePopup(false); logout(); }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default PatientDashboardNavBar;
