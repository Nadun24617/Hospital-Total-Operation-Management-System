import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickAccessCards = [
    { title: 'Appointments', desc: 'Book a new appointment', icon: '📅', onClick: () => navigate('/appointments') },
    { title: 'My Appointments', desc: 'View and manage bookings', icon: '📋', onClick: () => navigate('/my-appointments') },
    { title: 'Patient Records', desc: 'Secure medical history', icon: '📁' },
    { title: 'Billing & Payments', desc: 'View bills and pay online', icon: '💳' },
    { title: 'Pharmacy & Lab Reports', desc: 'Prescriptions and test results', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>

      <main className="max-w-6xl mx-auto mt-8 p-4 space-y-12">
        <Card className="rounded-3xl shadow p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-500 mb-2">Welcome to ABC Hospital</p>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">
              Efficient Care, <span className="text-blue-500">Seamless Management</span>
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl">
              Access appointments, medical records, billing, and hospital services from a single, secure dashboard built for patients, doctors, and administrators.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-sm h-48 md:h-60 rounded-3xl bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 flex items-center justify-center text-blue-400 text-sm md:text-base">
              Modern hospital illustration / hero image
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickAccessCards.map(card => {
              const clickable = Boolean(card.onClick);
              return (
                <Card
                  key={card.title}
                  className={
                    'rounded-2xl transition p-5 flex flex-col gap-2 ' +
                    (clickable ? 'hover:shadow-lg cursor-pointer' : '')
                  }
                  onClick={card.onClick}
                >
                  <span className="text-3xl">{card.icon}</span>
                  <div className="font-semibold text-blue-800">{card.title}</div>
                  <div className="text-gray-500 text-sm">{card.desc}</div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Hospital at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-blue-700">500+</div>
                  <div className="text-gray-500">Specialist Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">24/7</div>
                  <div className="text-gray-500">Emergency Services</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">10+</div>
                  <div className="text-gray-500">Advanced Departments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">98%</div>
                  <div className="text-gray-500">Patient Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">What Our Patients Say</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-gray-600 text-sm italic">
                "ABC Hospital made my surgery journey smooth and stress-free. The staff were caring, and all my reports were available online in seconds."
              </p>
              <div className="text-sm text-gray-500">— Patient Feedback</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Latest Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Free heart health camp – 25th Dec</li>
                <li>• COVID-19 booster vaccination drive ongoing</li>
                <li>• New oncology wing inaugurated</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Who Can Use This Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Patients', desc: 'Manage appointments, records, and bills in one place.' },
              { title: 'Doctors', desc: 'Access schedules, patient charts, and clinical data.' },
              { title: 'Staff / Admin', desc: 'Oversee operations, billing, and analytics.' },
            ].map(role => (
              <Card key={role.title} className="rounded-xl border-blue-100 bg-blue-50/40 p-4">
                <div className="font-semibold text-blue-800 mb-1">{role.title}</div>
                <div className="text-gray-600 text-sm">{role.desc}</div>
              </Card>
            ))}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PatientDashboard;
