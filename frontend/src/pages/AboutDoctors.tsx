import React, { useState, useMemo } from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import defaultDoctorImage from '../assets/doctors/image.png';
import Footer from '../components/Footer';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const doctorsData = [
  {
    name: 'Dr. Saman Perera',
    specialization: 'Consultant Cardiologist',
    description: 'Dr. Saman Perera has over 15 years of experience in diagnosing and treating heart-related conditions, including coronary artery disease, hypertension, and heart failure. He is committed to providing patient-focused cardiac care using modern medical practices.',
    image: '/assets/doctors/doctor1.jpg',
    category: 'Cardiology',
  },
  {
    name: 'Dr. Nirosha Fernando',
    specialization: 'Consultant Dermatologist',
    description: 'Dr. Nirosha Fernando specializes in treating skin, hair, and nail disorders. She has extensive experience in managing acne, eczema, psoriasis, and hair loss using evidence-based dermatological treatments.',
    image: '/assets/doctors/doctor2.jpg',
    category: 'Dermatology',
  },
  {
    name: 'Dr. Mahesh Jayawardena',
    specialization: 'Consultant Orthopedic Surgeon',
    description: 'Dr. Mahesh Jayawardena is an expert in bone, joint, and spine disorders. His clinical focus includes fracture management, joint replacement surgery, and sports injury treatment.',
    image: '/assets/doctors/doctor3.jpg',
    category: 'Orthopedics',
  },
  {
    name: 'Dr. Tharindu Wijesinghe',
    specialization: 'Consultant Pediatrician',
    description: 'Dr. Tharindu Wijesinghe provides comprehensive healthcare for infants, children, and adolescents. He emphasizes preventive care, immunizations, and child growth and development monitoring.',
    image: '/assets/doctors/doctor4.jpg',
    category: 'Pediatrics',
  },
  {
    name: 'Dr. Anusha Silva',
    specialization: 'Consultant Gynecologist & Obstetrician',
    description: 'Dr. Anusha Silva has significant experience in women’s health, maternity care, and high-risk pregnancy management. She is dedicated to ensuring safe and personalized care for mothers and newborns.',
    image: '/assets/doctors/doctor5.jpg',
    category: 'Gynecology',
  },
  {
    name: 'Dr. Ruwan Abeysekera',
    specialization: 'Consultant General Surgeon',
    description: 'Dr. Ruwan Abeysekera specializes in general and laparoscopic surgical procedures. His areas of expertise include abdominal surgery, hernia repair, and minimally invasive surgical techniques.',
    image: '/assets/doctors/doctor6.jpg',
    category: 'Surgery',
  },
  {
    name: 'Dr. Chamila Karunaratne',
    specialization: 'Consultant Neurologist',
    description: 'Dr. Chamila Karunaratne focuses on the diagnosis and management of neurological disorders such as epilepsy, stroke, migraine, and movement disorders, offering comprehensive neurological care.',
    image: '/assets/doctors/doctor7.jpg',
    category: 'Neurology',
  },
  {
    name: 'Dr. Ishan De Silva',
    specialization: 'Consultant Psychiatrist',
    description: 'Dr. Ishan De Silva provides mental health care for patients with anxiety, depression, stress-related disorders, and mood disorders, using a compassionate and confidential approach.',
    image: '/assets/doctors/doctor8.jpg',
    category: 'Psychiatry',
  },
  {
    name: 'Dr. Malithi Gunasekara',
    specialization: 'Consultant Endocrinologist',
    description: 'Dr. Malithi Gunasekara specializes in hormonal disorders, including diabetes, thyroid conditions, and metabolic diseases, focusing on long-term disease management and lifestyle guidance.',
    image: '/assets/doctors/doctor9.jpg',
    category: 'Endocrinology',
  },
  {
    name: 'Dr. Kasun Rathnayake',
    specialization: 'Consultant General Physician',
    description: 'Dr. Kasun Rathnayake offers comprehensive medical care for common and chronic illnesses, emphasizing accurate diagnosis, preventive healthcare, and patient education.',
    image: '/assets/doctors/doctor10.jpg',
    category: 'General Medicine',
  },
];

const categories = Array.from(new Set(doctorsData.map(d => d.category)));

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'specialization', label: 'Specialization' },
  { value: 'category', label: 'Category' },
];

const AboutDoctors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [category, setCategory] = useState('All');

  const filteredDoctors = useMemo(() => {
    let docs = doctorsData.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') {
      docs = docs.filter(d => d.category === category);
    }
    docs = docs.sort((a, b) => {
      const aVal = (a as Record<string, string>)[sortBy] || '';
      const bVal = (b as Record<string, string>)[sortBy] || '';
      return aVal.localeCompare(bVal);
    });
    return docs;
  }, [search, sortBy, category]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc, idx) => (
            <div key={doc.name} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 items-center">
              <img
                src={doc.image && doc.image.trim() ? doc.image : defaultDoctorImage}
                alt={doc.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 mb-2"
                onError={e => (e.currentTarget.src = defaultDoctorImage)}
              />
              <div className="font-bold text-lg text-blue-700 text-center">{doc.name}</div>
              <div className="text-blue-500 font-medium text-center">{doc.specialization}</div>
              <div className="text-gray-600 text-sm text-center mb-2">{doc.category}</div>
              <div className="text-gray-500 text-sm text-center">{doc.description}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutDoctors;
