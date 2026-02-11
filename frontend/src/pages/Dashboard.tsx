import { useEffect, useMemo, useState } from 'react';
import SidePanel from '../components/SidePanel';
import AdminUserManagement from '../components/AdminUserManagement';
import DoctorProfiles from '../components/DoctorProfiles';
import { useAuth } from '../auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const baseFeatures = [
  { label: 'Patient Management' },
  { label: 'Doctor Profiles' },
  { label: 'Doctor Channeling' },
  { label: 'Lab Management' },
  { label: 'Pharmacy Management' },
  { label: 'Operation Theatres' },
  { label: 'Ward & Bed Management' },
  { label: 'Billing & Payments' },
  { label: 'Reporting & Analytics' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);

  const features = useMemo(() => {
    const items = [...baseFeatures];
    if (user?.role === 'ADMIN') {
      items.push({ label: 'Admin' });
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
            <CardTitle className="text-3xl">{activeFeature.label}</CardTitle>
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
