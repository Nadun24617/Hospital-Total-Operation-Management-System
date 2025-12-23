import React from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';

const heroImages = [
  '/assets/hospital1.jpg',
  '/assets/hospital2.jpg',
  '/assets/hospital3.jpg',
];

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const AboutHospital: React.FC = () => {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation bar */}
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Hero Section */}
        <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-lg">
          {heroImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="Hospital Hero"
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
              style={{zIndex: idx === current ? 2 : 1}}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent z-10" />
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">About ABC Hospital</h1>
          </div>
        </div>

        {/* About Info */}
        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">ABC Hospital</h2>
          <p className="text-gray-700 mb-4">ABC Hospital is a multi-specialty healthcare institution dedicated to providing high-quality, patient-centered medical services through advanced technology and professional medical care.</p>
          <p className="text-gray-700 mb-4">Established in 2012, ABC Hospital has become a trusted healthcare provider, delivering reliable and efficient medical services while maintaining high standards of safety, ethics, and patient satisfaction.</p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Mission</h3>
            <p className="text-gray-700">To deliver accessible, affordable, and high-quality healthcare services while ensuring patient safety, clinical excellence, and ethical medical practices.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Vision</h3>
            <p className="text-gray-700">To be a leading digital healthcare institution recognized for innovation, quality medical care, and patient trust.</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Our Services</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>General Medicine and OPD Services</li>
            <li>Emergency and Trauma Care (24/7)</li>
            <li>Cardiology and Heart Care</li>
            <li>Dermatology and Skin Care</li>
            <li>Pediatrics and Child Health Services</li>
            <li>Gynecology and Maternity Care</li>
            <li>Orthopedics and Physiotherapy</li>
            <li>Diagnostic Laboratory Services</li>
            <li>Medical Imaging and Radiology</li>
            <li>Pharmacy Services</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Our Medical Team</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Over 45 specialist and general physicians</li>
            <li>More than 120 trained nursing professionals</li>
            <li>Dedicated laboratory and technical staff</li>
            <li>24-hour emergency medical personnel</li>
            <li>All medical professionals are registered with the Sri Lanka Medical Council (SLMC) and follow nationally approved clinical standards.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Hospital Facilities</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Over 150 inpatient beds</li>
            <li>Intensive Care Unit (ICU) and Coronary Care Unit (CCU)</li>
            <li>Fully equipped operation theatres</li>
            <li>Digital patient record management system</li>
            <li>Online appointment scheduling</li>
            <li>Ambulance and emergency transport services</li>
            <li>Accessibility support for elderly and differently-abled patients</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Hospital Performance Overview (Sample Data)</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Annual patients treated: 25,000+</li>
            <li>Total surgeries performed: 8,500+</li>
            <li>Average emergency response time: Under 5 minutes</li>
            <li>Patient satisfaction rate: 96%</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Operating Hours</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Outpatient Department (OPD): 8.00 AM – 8.00 PM (Daily)</li>
            <li>Emergency Services: Available 24/7</li>
            <li>Pharmacy: 8.00 AM – 10.00 PM</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Contact Information</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Address: No. 125, Main Street, Colombo 07</li>
            <li>Hotline: +94 11 234 5678</li>
            <li>Email: info@abchospital.lk</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Why Choose ABC Hospital</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Experienced and qualified medical professionals</li>
            <li>Modern medical equipment and infrastructure</li>
            <li>Efficient and accurate diagnostic services</li>
            <li>Secure and patient-friendly digital systems</li>
            <li>Clean, safe, and well-maintained environment</li>
          </ul>
        </section>
      </div>
            <Footer />
    </div>
  );
};

export default AboutHospital;
