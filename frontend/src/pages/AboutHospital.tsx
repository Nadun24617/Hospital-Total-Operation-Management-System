import React from 'react';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { Card } from '@/components/ui/card';
import {
  HeartPulse,
  Stethoscope,
  Building2,
  Clock,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const AboutHospital: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 max-w-7xl mx-auto px-6 mt-16 space-y-24">

        {/* ================= PAGE HEADER ================= */}
        <section className="text-center space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary font-medium">
            About ABC Hospital
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Excellence in Healthcare,
            <span className="text-primary"> Powered by Innovation</span>
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Delivering patient-centered care through advanced medical
            technology and compassionate expertise.
          </p>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section className="grid md:grid-cols-2 gap-10">
          <Card className="p-10 rounded-3xl border-none shadow-lg bg-white hover:shadow-2xl transition">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10 mb-6">
              <HeartPulse className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To deliver accessible, affordable, and high-quality healthcare
              services while maintaining safety, clinical excellence,
              and ethical medical standards.
            </p>
          </Card>

          <Card className="p-10 rounded-3xl border-none shadow-lg bg-white hover:shadow-2xl transition">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10 mb-6">
              <ShieldCheck className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To be a leading digital healthcare institution recognized
              for innovation, excellence, and patient trust.
            </p>
          </Card>
        </section>

        {/* ================= MEDICAL SERVICES ================= */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Medical Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'General Medicine & OPD',
              'Emergency & Trauma Care',
              'Cardiology & Heart Care',
              'Pediatrics & Child Health',
              'Orthopedics & Physiotherapy',
              'Diagnostic Laboratory & Imaging',
            ].map(service => (
              <Card
                key={service}
                className="p-8 rounded-2xl border-none shadow-md bg-white hover:-translate-y-2 hover:shadow-xl transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Stethoscope className="text-primary" />
                </div>
                <div className="font-medium text-gray-800">
                  {service}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= HOSPITAL FACILITIES ================= */}
<section>
  <Card className="p-12 rounded-3xl border-none shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/15">
        <Building2 className="text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Hospital Facilities
      </h2>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {[
        'ICU & CCU Units',
        'Fully Equipped Operation Theatres',
        'Digital Patient Record System',
        'Online Appointment Scheduling',
        'Ambulance & Emergency Transport',
        'Accessibility Support Infrastructure',
      ].map(item => (
        <div
          key={item}
          className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
          <span className="text-gray-700 text-sm">{item}</span>
        </div>
      ))}
    </div>
  </Card>
</section>

        {/* ================= OPERATING HOURS ================= */}
<section>
  <Card className="p-12 rounded-3xl border-none shadow-xl bg-white hover:shadow-2xl transition">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10">
        <Clock className="text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Operating Hours
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6 text-center">
      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">OPD</p>
        <p className="font-semibold text-gray-800">
          8:00 AM – 8:00 PM
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">Emergency</p>
        <p className="font-semibold text-gray-800">
          24 / 7 Service
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">Pharmacy</p>
        <p className="font-semibold text-gray-800">
          8:00 AM – 10:00 PM
        </p>
      </div>
    </div>
  </Card>
</section>
{/* ================= CONTACT ================= */}
<section>
  <Card className="p-12 rounded-3xl border-none shadow-xl bg-white hover:shadow-2xl transition">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary/10">
        <Phone className="text-primary" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Contact Information
      </h2>
    </div>

    <div className="grid md:grid-cols-3 gap-6 text-center">

      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">Address</p>
        <p className="font-semibold text-gray-800">
          No.125, Main Street<br />
          Colombo 07
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">Hotline</p>
        <p className="font-semibold text-gray-800">
          +94 11 234 5678
        </p>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <p className="text-sm text-gray-500 mb-2">Email</p>
        <p className="font-semibold text-gray-800">
          info@abchospital.lk
        </p>
      </div>

    </div>
  </Card>
</section>

        {/* ================= STATS ================= */}
        <section>
          <Card className="rounded-2xl border-none shadow-md bg-white p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { value: '150+', label: 'Inpatient Beds' },
                { value: '45+', label: 'Specialist Doctors' },
                { value: '25,000+', label: 'Patients Annually' },
                { value: '96%', label: 'Patient Satisfaction' },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-4xl font-bold text-primary">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

      </main>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AboutHospital;