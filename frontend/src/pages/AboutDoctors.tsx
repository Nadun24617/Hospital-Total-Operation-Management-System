import React, { useState, useMemo, useEffect } from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import defaultDoctorImage from '../assets/doctors/image.png';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Stethoscope } from 'lucide-react';
import { SPECIALIZATIONS } from '../constants/specializations';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

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
};

const getSpecializationName = (id: number) => {
  const spec = SPECIALIZATIONS.find(s => s.id === id);
  return spec ? spec.name : 'Other';
};

const sortOptions = [
  { value: 'fullName', label: 'Name' },
  { value: 'specialization', label: 'Specialization' },
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
        const res = await fetch('/api/doctors', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

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
      const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? '');
      const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? '');
      return aVal.localeCompare(bVal);
    });
    return docs;
  }, [search, sortBy, category, doctors]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 max-w-7xl mx-auto px-6 mt-16 space-y-20 mb-20">
        {/* ================= PAGE HEADER ================= */}
        <section className="text-center space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary font-medium">
            Meet Our Specialists
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Expert Doctors,
            <span className="text-primary"> Dedicated to Your Health</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Our team of highly qualified doctors provides compassionate, patient-centered care in various medical specializations.
          </p>
        </section>

        {/* ================= SEARCH & FILTER ================= */}
        <section className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-3xl shadow-md">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search doctors by name, specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10"
            />
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Specializations</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* ================= DOCTORS GRID ================= */}
        {loading ? (
          <div className="text-center text-primary py-20">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doc => (
              <Card
                key={doc.id}
                className="p-8 rounded-3xl border-none shadow-lg bg-white hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-28 h-28 border-4 border-primary/20 shadow-md rounded-full overflow-hidden">
                    <AvatarImage
                      src={defaultDoctorImage}
                      alt={doc.fullName}
                      className="object-cover w-full h-full"
                      onError={e => (e.currentTarget.src = defaultDoctorImage)}
                    />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {doc.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-800">{doc.fullName}</h3>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {getSpecializationName(doc.specializationId)}
                  </span>
                  {doc.description && (
                    <p className="text-sm text-gray-600 h-20 overflow-hidden relative">
                      {doc.description.length > 120 ? doc.description.slice(0, 120) + '...' : doc.description}
                    </p>
                  )}
                  <div className="flex justify-between w-full border-t pt-2 text-sm text-gray-500">
                    <span>SLMC No:</span>
                    <span>{doc.slmcNumber}</span>
                  </div>
                  <button className="mt-4 w-full py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition">
                    View Profile
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default AboutDoctors;