import React, { useState, useMemo, useEffect } from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import defaultDoctorImage from '../assets/doctors/image.png';
import { SPECIALIZATIONS } from '../constants/specializations';
import Footer from '../components/Footer';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

// Fetch doctors from backend

type Doctor = {
  id: number;
  userId: string;
  fullName: string;
  slmcNumber: string;
  specializationId: number;
  phone?: string;
  email?: string;
  description?: string;
  joinedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  // Optionally add category, specialization, image if backend provides
};

const getSpecializationName = (id: number) => {
  const spec = SPECIALIZATIONS.find(s => s.id === id);
  return spec ? spec.name : 'Other';
};

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'specialization', label: 'Specialization' },
  { value: 'category', label: 'Category' },
];


const AboutDoctors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('fullName');
  const [category, setCategory] = useState('All');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/doctors', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Derive categories from fetched data
  const categories = useMemo(() => {
    const setCat = new Set(doctors.map(d => getSpecializationName(d.specializationId)));
    return Array.from(setCat);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    let docs = doctors.filter(d =>
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.slmcNumber?.toLowerCase().includes(search.toLowerCase()) ||
      getSpecializationName(d.specializationId).toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') {
      docs = docs.filter(d => getSpecializationName(d.specializationId) === category);
    }
    docs = docs.sort((a, b) => {
      const aVal = (a as Record<string, string>)[sortBy] || '';
      const bVal = (b as Record<string, string>)[sortBy] || '';
      return aVal.localeCompare(bVal);
    });
    return docs;
  }, [search, sortBy, category, doctors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* NavBar */}
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Meet Our Doctors</h1>
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-blue-200 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Doctor Cards */}
        {loading ? (
          <div className="text-center text-blue-600 py-10">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-center border border-blue-100 hover:shadow-xl transition-shadow duration-200"
              >
                <img
                  src={defaultDoctorImage}
                  alt={doc.fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-2 shadow"
                  onError={e => (e.currentTarget.src = defaultDoctorImage)}
                />
                <div className="font-bold text-xl text-blue-800 text-center">{doc.fullName}</div>
                <div className="text-blue-500 font-medium text-center">{getSpecializationName(doc.specializationId)}</div>
                <div className="flex flex-col gap-1 w-full mt-2">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span className="font-semibold">SLMC No:</span>
                    <span>{doc.slmcNumber}</span>
                  </div>
                </div>
                {doc.description && (
                  <div className="text-gray-500 text-sm text-center mt-2">{doc.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AboutDoctors;
