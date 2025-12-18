import React, { useRef, useState } from 'react';


const navLinks = [
  { label: 'Profile', id: 'profile' },
  { label: 'Hospital Info', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const PatientDashboard: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState('profile');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">Hospital Portal</div>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`text-lg font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors ${activeSection === link.id ? 'text-blue-600' : 'text-gray-700'}`}
              onClick={() => setActiveSection(link.id)}
            >
              {link.label}
            </button>
          ))}
          <div className="relative ml-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handlePhotoChange}
            />
            <button
              className="focus:outline-none"
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile photo"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto mt-8 p-4">
        {activeSection === 'profile' && (
          <section className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">My Profile</h2>
            <div className="flex flex-col items-center gap-4">
              <div>
                <img
                  src={profilePhoto || 'https://ui-avatars.com/api/?name=Patient&background=E0E7FF&color=1E40AF'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow"
                />
              </div>
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'}
              </button>
              {/* Add more profile fields here */}
              <div className="w-full mt-4">
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input className="w-full border rounded px-3 py-2" type="text" placeholder="John Doe" />
              </div>
              <div className="w-full mt-2">
                <label className="block text-gray-700 mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" placeholder="john@example.com" />
              </div>
              <div className="w-full mt-2">
                <label className="block text-gray-700 mb-1">Phone</label>
                <input className="w-full border rounded px-3 py-2" type="tel" placeholder="+1 234 567 890" />
              </div>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Save Changes</button>
            </div>
          </section>
        )}
        {activeSection === 'hospital' && (
          <section className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Hospital Information</h2>
            <p className="text-gray-700 mb-2">Welcome to our hospital! We provide world-class healthcare services with a team of experienced professionals and state-of-the-art facilities.</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>24/7 Emergency Services</li>
              <li>Modern Operation Theaters</li>
              <li>Specialized Departments</li>
              <li>Pharmacy & Diagnostics</li>
              <li>Patient-Centric Care</li>
            </ul>
          </section>
        )}
        {activeSection === 'appointments' && (
          <section className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Schedule Appointment</h2>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Select Doctor</label>
                <select className="w-full border rounded px-3 py-2">
                  <option>Dr. Alice Smith (Cardiologist)</option>
                  <option>Dr. Bob Lee (Dermatologist)</option>
                  <option>Dr. Carol White (Pediatrician)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Time</label>
                <input type="time" className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Book Appointment</button>
            </form>
          </section>
        )}
        {activeSection === 'doctors' && (
          <section className="bg-white rounded-lg shadow p-6 max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-blue-700">Available Doctors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Example doctor cards */}
              {[
                {
                  name: 'Dr. Alice Smith',
                  specialization: 'Cardiologist',
                  description: 'Expert in heart and vascular care with 15+ years of experience.',
                  photo: 'https://randomuser.me/api/portraits/women/44.jpg',
                },
                {
                  name: 'Dr. Bob Lee',
                  specialization: 'Dermatologist',
                  description: 'Specialist in skin, hair, and nail disorders. 10+ years in dermatology.',
                  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
                },
                {
                  name: 'Dr. Carol White',
                  specialization: 'Pediatrician',
                  description: 'Caring for children and adolescents, focusing on preventive care.',
                  photo: 'https://randomuser.me/api/portraits/women/65.jpg',
                },
                {
                  name: 'Dr. David Kim',
                  specialization: 'Orthopedic Surgeon',
                  description: 'Specializes in bone and joint surgery, sports injuries, and trauma.',
                  photo: 'https://randomuser.me/api/portraits/men/76.jpg',
                },
                {
                  name: 'Dr. Eva Green',
                  specialization: 'Neurologist',
                  description: 'Expert in brain and nervous system disorders, epilepsy, and stroke.',
                  photo: 'https://randomuser.me/api/portraits/women/12.jpg',
                },
              ].map((doc, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center">
                  <img src={doc.photo} alt={doc.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-400 mb-3" />
                  <div className="font-semibold text-lg text-blue-800">{doc.name}</div>
                  <div className="text-blue-600 text-sm mb-2">{doc.specialization}</div>
                  <div className="text-gray-700 text-sm mb-3">{doc.description}</div>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm">View Profile</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
