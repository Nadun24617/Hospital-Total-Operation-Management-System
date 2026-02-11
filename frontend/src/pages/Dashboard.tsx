import { useEffect, useMemo, useState } from 'react';
import SidePanel from '../components/SidePanel';
import AdminUserManagement from '../components/AdminUserManagement';
import DoctorProfiles from '../components/DoctorProfiles';
import { useAuth } from '../auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Stethoscope, CalendarDays, FlaskConical, Pill, Scissors, BedDouble, CreditCard, BarChart3, ShieldCheck } from 'lucide-react';

const baseFeatures = [
  { label: 'Patient Management', icon: <Users className="h-4 w-4" /> },
  { label: 'Doctor Profiles', icon: <Stethoscope className="h-4 w-4" /> },
  { label: 'Doctor Channeling', icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Lab Management', icon: <FlaskConical className="h-4 w-4" /> },
  { label: 'Pharmacy Management', icon: <Pill className="h-4 w-4" /> },
  { label: 'Operation Theatres', icon: <Scissors className="h-4 w-4" /> },
  { label: 'Ward & Bed Management', icon: <BedDouble className="h-4 w-4" /> },
  { label: 'Billing & Payments', icon: <CreditCard className="h-4 w-4" /> },
  { label: 'Reporting & Analytics', icon: <BarChart3 className="h-4 w-4" /> }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  const features = useMemo(() => {
    const items = [...baseFeatures];
    if (user?.role === 'ADMIN') {
      items.push({ label: 'Admin', icon: <ShieldCheck className="h-4 w-4" /> });
    }
    return items;
  }, [user]);

  useEffect(() => {
    if (active >= features.length) {
      setActive(0);
    }
  }, [active, features.length]);

  const activeFeature = features[active] ?? features[0];

  return (
    <div className="flex min-h-screen bg-muted">
      <SidePanel
        items={features.map((f, idx) => ({
          ...f,
          onClick: () => setActive(idx),
        }))}
        activeIndex={active}
      />
      <main className="flex-1 p-8">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{activeFeature.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeFeature.label === 'Admin' && <AdminUserManagement />}
            {activeFeature.label === 'Doctor Profiles' && <DoctorProfiles />}
            {activeFeature.label !== 'Admin' && activeFeature.label !== 'Doctor Profiles' && (
              <p className="text-muted-foreground">Welcome to the {activeFeature.label} section.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
