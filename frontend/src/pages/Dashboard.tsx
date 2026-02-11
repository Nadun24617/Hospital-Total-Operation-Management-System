import { useEffect, useMemo, useState } from 'react';
import SidePanel from '../components/SidePanel';
import AdminUserManagement from '../components/AdminUserManagement';
import DoctorProfiles from '../components/DoctorProfiles';
import { useAuth } from '../auth';


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
    <div className="flex min-h-screen bg-gray-50">
      <SidePanel
        items={features.map((f, idx) => ({
          ...f,
          onClick: () => setActive(idx),
        }))}
        activeIndex={active}
      />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">{activeFeature.label}</h1>
        <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          {activeFeature.label === 'Admin' && <AdminUserManagement />}
          {activeFeature.label === 'Doctor Profiles' && <DoctorProfiles />}
          {activeFeature.label !== 'Admin' && activeFeature.label !== 'Doctor Profiles' && (
            <p>Welcome to the {activeFeature.label} section.</p>
          )}
        </div>
      </main>
    </div>
  );
}
