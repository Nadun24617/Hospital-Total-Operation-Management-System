import React, { useState, useMemo, useEffect } from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import defaultDoctorImage from '../assets/doctors/image.png';
import { SPECIALIZATIONS } from '../constants/specializations';
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
        const res = await fetch('/api/doctors', {
          credentials: 'include',
        });
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
    <div className="min-h-screen bg-muted">
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Meet Our Doctors</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <Input
            type="text"
            placeholder="Search doctors by name, specialization, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/2"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {loading ? (
          <div className="text-center text-primary py-10">Loading doctors...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 flex flex-col gap-4 items-center hover:border-primary/40 transition-colors duration-200"
              >
                <Avatar className="w-24 h-24 border-2 border-border">
                  <AvatarImage
                    src={defaultDoctorImage}
                    alt={doc.fullName}
                    onError={e => (e.currentTarget.src = defaultDoctorImage)}
                  />
                  <AvatarFallback className="text-2xl bg-muted text-primary">
                    {doc.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="font-semibold text-lg text-foreground text-center">{doc.fullName}</div>
                <div className="text-primary font-medium text-center">{getSpecializationName(doc.specializationId)}</div>
                <div className="flex flex-col gap-1 w-full mt-2">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span className="font-semibold">SLMC No:</span>
                    <span>{doc.slmcNumber}</span>
                  </div>
                </div>
                {doc.description && (
                  <div className="text-muted-foreground text-sm text-center mt-2">{doc.description}</div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AboutDoctors;
