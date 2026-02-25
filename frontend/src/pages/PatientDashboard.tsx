import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, FolderOpen, CreditCard, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import heroImage from '@/assets/hospital-hero.png';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickAccessCards: {
    title: string;
    desc: string;
    icon: LucideIcon;
    onClick?: () => void;
  }[] = [
    { title: 'Appointments', desc: 'Book a new appointment', icon: Calendar, onClick: () => navigate('/appointments') },
    { title: 'My Appointments', desc: 'View and manage bookings', icon: ClipboardList, onClick: () => navigate('/my-appointments') },
    { title: 'Patient Records', desc: 'Secure medical history', icon: FolderOpen },
    { title: 'Billing & Payments', desc: 'View bills and pay online', icon: CreditCard },
    { title: 'Pharmacy & Lab Reports', desc: 'Prescriptions and test results', icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <PatientDashboardNavBar navLinks={navLinks} />

      <main className="flex-1 max-w-7xl mx-auto px-6 mt-10 space-y-20">

        {/* ================= HERO ================= */}
<section className="relative rounded-3xl overflow-hidden shadow-xl bg-white">

  {/* Background Image */}
  <img
    src={heroImage}
    alt="Hospital"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Left Side Fade (Important Part) */}
  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />

  <div className="relative z-10\ p-12 md:p-16 max-w-3xl space-y-10">
    <p className="text-xs uppercase tracking-widest text-primary font-medium">
      Welcome to ABC Hospital
    </p>

    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
      Efficient Care,{' '}
      <span className="text-primary">Seamless Management</span>
    </h1>

    <p className="text-gray-600 text-lg leading-relaxed">
      Access appointments, medical records, billing, and hospital services
      from a single, secure dashboard built for patients, doctors, and administrators.
    </p>

    <div className="flex gap-4 pt-2">
      <button
        onClick={() => navigate('/appointments')}
        className="px-6 py-2 rounded-lg bg-primary text-white shadow-md hover:shadow-lg hover:scale-105 transition"
      >
        Book Appointment
      </button>

      <button
        onClick={() => navigate('/doctors')}
        className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition"
      >
        View Doctors
      </button>
    </div>
  </div>
</section>

        {/* ================= QUICK ACCESS ================= */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quick Access
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessCards.map(card => {
              const clickable = Boolean(card.onClick);

              return (
                <Card
                  key={card.title}
                  onClick={card.onClick}
                  className={`group p-6 rounded-2xl border-none shadow-md bg-white transition-all duration-300 
                  ${clickable ? 'hover:-translate-y-2 hover:shadow-xl cursor-pointer' : ''}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>

                  <div className="font-semibold text-gray-800">
                    {card.title}
                  </div>

                  <div className="text-gray-500 text-sm mt-1">
                    {card.desc}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ================= INFO SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">

          <Card className="rounded-2xl shadow-md border-none">
            <CardHeader>
              <CardTitle>Hospital at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 text-center">
                {[
                  { value: '500+', label: 'Specialist Doctors' },
                  { value: '24/7', label: 'Emergency Services' },
                  { value: '10+', label: 'Advanced Departments' },
                  { value: '98%', label: 'Patient Satisfaction' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="text-3xl font-bold text-primary">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-none">
            <CardHeader>
              <CardTitle>What Our Patients Say</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 italic text-sm leading-relaxed">
                "ABC Hospital made my surgery journey smooth and stress-free.
                The staff were caring, and all my reports were available online in seconds."
              </p>
              <div className="text-sm text-gray-500 mt-4">— Patient Feedback</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md border-none">
            <CardHeader>
              <CardTitle>Latest Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-3">
                <li>• Free heart health camp – 25th Dec</li>
                <li>• COVID-19 booster vaccination drive ongoing</li>
                <li>• New oncology wing inaugurated</li>
              </ul>
            </CardContent>
          </Card>

        </section>

      </main>

      {/* Extra spacing before footer */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default PatientDashboard;