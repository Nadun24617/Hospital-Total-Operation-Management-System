import React from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboardNavBar from '../components/PatientDashboardNavBar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, FolderOpen, CreditCard, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navLinks = [
  { label: 'About Us', id: 'hospital' },
  { label: 'Appointments', id: 'appointments' },
  { label: 'Doctors', id: 'doctors' },
];

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickAccessCards: { title: string; desc: string; icon: LucideIcon; onClick?: () => void }[] = [
    { title: 'Appointments', desc: 'Book a new appointment', icon: Calendar, onClick: () => navigate('/appointments') },
    { title: 'My Appointments', desc: 'View and manage bookings', icon: ClipboardList, onClick: () => navigate('/my-appointments') },
    { title: 'Patient Records', desc: 'Secure medical history', icon: FolderOpen },
    { title: 'Billing & Payments', desc: 'View bills and pay online', icon: CreditCard },
    { title: 'Pharmacy & Lab Reports', desc: 'Prescriptions and test results', icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <div className="relative">
        <PatientDashboardNavBar navLinks={navLinks} />
      </div>

      <main className="max-w-6xl mx-auto mt-8 p-4 space-y-12">
        <Card className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">Welcome to ABC Hospital</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Efficient Care, <span className="text-primary">Seamless Management</span>
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xl">
              Access appointments, medical records, billing, and hospital services from a single, secure dashboard built for patients, doctors, and administrators.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-sm h-48 md:h-60 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground text-sm md:text-base">
              Modern hospital illustration / hero image
            </div>
          </div>
        </Card>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickAccessCards.map(card => {
              const clickable = Boolean(card.onClick);
              return (
                <Card
                  key={card.title}
                  className={
                    'transition p-5 flex flex-col gap-3 ' +
                    (clickable ? 'hover:border-primary/40 cursor-pointer' : '')
                  }
                  onClick={card.onClick}
                >
                  <card.icon className="h-5 w-5 text-primary" />
                  <div className="font-medium text-foreground">{card.title}</div>
                  <div className="text-muted-foreground text-sm">{card.desc}</div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">Hospital at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-semibold text-primary">500+</div>
                  <div className="text-muted-foreground">Specialist Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">24/7</div>
                  <div className="text-muted-foreground">Emergency Services</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">10+</div>
                  <div className="text-muted-foreground">Advanced Departments</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">98%</div>
                  <div className="text-muted-foreground">Patient Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">What Our Patients Say</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm italic">
                "ABC Hospital made my surgery journey smooth and stress-free. The staff were caring, and all my reports were available online in seconds."
              </p>
              <div className="text-sm text-muted-foreground">— Patient Feedback</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-foreground">Latest Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Free heart health camp – 25th Dec</li>
                <li>• COVID-19 booster vaccination drive ongoing</li>
                <li>• New oncology wing inaugurated</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Card className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Who Can Use This Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { title: 'Patients', desc: 'Manage appointments, records, and bills in one place.' },
              { title: 'Doctors', desc: 'Access schedules, patient charts, and clinical data.' },
              { title: 'Staff / Admin', desc: 'Oversee operations, billing, and analytics.' },
            ].map(role => (
              <Card key={role.title} className="bg-muted/50 p-4">
                <div className="font-medium text-foreground mb-1">{role.title}</div>
                <div className="text-muted-foreground text-sm">{role.desc}</div>
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
