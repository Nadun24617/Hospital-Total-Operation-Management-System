import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'primary' | 'green' | 'amber' | 'red';
}

function StatCard({ label, value, accent = 'primary' }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    primary: 'border-primary-100 bg-primary-50/40 text-primary-800',
    green: 'border-emerald-100 bg-emerald-50/50 text-emerald-800',
    amber: 'border-amber-100 bg-amber-50/60 text-amber-800',
    red: 'border-rose-100 bg-rose-50/60 text-rose-800',
  };

  return (
    <div className={`flex flex-col justify-between rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 px-4 py-3 sm:px-5 sm:py-4 ${accentClasses[accent]}`}>
      <span className="text-xs sm:text-[0.8rem] font-medium tracking-wide text-gray-600/80 uppercase">{label}</span>
      <span className="mt-1 text-xl sm:text-2xl font-semibold leading-tight">{value}</span>
    </div>
  );
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'appointments' | 'patients' | 'schedule' | 'history' | 'profile'>('dashboard');

  // Placeholder demo data – ready to be wired to API later
  const todaySummary = {
    todaysAppointments: 12,
    nextPatient: 'John Doe',
    nextSlot: '10:45 AM',
    currentQueue: 4,
    liveNumber: 'A-17',
    completed: 7,
    pending: 5,
    cancellations: 1,
    rescheduled: 2,
  };

  const upcomingAppointments = [
    { time: '10:45 AM', name: 'John Doe', reason: 'Follow-up Consultation', status: 'Next' },
    { time: '11:15 AM', name: 'Sarah Lee', reason: 'Diabetes Review', status: 'Waiting' },
    { time: '11:45 AM', name: 'Michael Chan', reason: 'Lab Results Discussion', status: 'Waiting' },
  ];

  const notifications = [
    { type: 'Info', message: 'New lab results available for three patients.', time: '5 min ago' },
    { type: 'Alert', message: 'One appointment was cancelled by patient.', time: '20 min ago' },
    { type: 'Schedule', message: 'You have an on-call shift tomorrow.', time: '1 hr ago' },
  ];

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 text-primary-700 text-lg font-semibold">D</span>
    ) },
    { id: 'appointments' as const, label: 'Appointments', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg font-semibold">A</span>
    ) },
    { id: 'patients' as const, label: 'Patient List', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg font-semibold">P</span>
    ) },
    { id: 'schedule' as const, label: 'Schedule / Availability', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600 text-lg font-semibold">S</span>
    ) },
    { id: 'history' as const, label: 'Consultation History', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600 text-lg font-semibold">H</span>
    ) },
    { id: 'profile' as const, label: 'Profile', icon: (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 text-lg font-semibold">Pr</span>
    ) },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 text-slate-900">
      {/* Side navigation */}
      <aside
        className={`relative flex flex-col bg-white/90 backdrop-blur border-r border-slate-200 shadow-sm transition-all duration-300 ease-out ${
          collapsed ? 'w-18 md:w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-9 w-9 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              D
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Doctor Portal</span>
                <span className="text-xs text-slate-500 truncate">{user?.firstName} {user?.lastName}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(prev => !prev)}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="text-xs">{collapsed ? '»' : '«'}</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white ${
                  isActive
                    ? 'bg-primary-50 text-primary-800 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <span className="text-base">⎋</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {activeSection === 'dashboard' && 'Today\'s Overview'}
              {activeSection === 'appointments' && 'Appointments'}
              {activeSection === 'patients' && 'Patient List'}
              {activeSection === 'schedule' && 'Schedule & Availability'}
              {activeSection === 'history' && 'Consultation History'}
              {activeSection === 'profile' && 'Profile'}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
              Focused workspace for doctors with real-time clinic insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs text-slate-500">
              <span className="font-medium text-slate-700">{user?.firstName} {user?.lastName}</span>
              <span className="uppercase tracking-wide text-[0.65rem]">{user?.role ?? 'DOCTOR'}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold shadow-inner">
              {user?.firstName?.[0] ?? 'D'}
            </div>
          </div>
        </header>

        {/* Section content */}
        <section className="flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-6">
          {activeSection === 'dashboard' && (
            <>
              {/* Top stats row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                <StatCard label="Today\'s Appointments" value={todaySummary.todaysAppointments} accent="primary" />
                <StatCard label="Completed" value={todaySummary.completed} accent="green" />
                <StatCard label="Pending" value={todaySummary.pending} accent="amber" />
                <StatCard label="Cancellations" value={todaySummary.cancellations} accent="red" />
                <StatCard label="Rescheduled" value={todaySummary.rescheduled} accent="amber" />
                <StatCard label="Live Queue No." value={todaySummary.liveNumber} accent="primary" />
              </div>

              {/* Main grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
                {/* Left: Queue & next patient */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                  <div className="rounded-2xl bg-white/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900">Next Patient</h2>
                      <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[0.7rem] font-medium text-primary-700 uppercase tracking-wide">Up next</span>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-900">{todaySummary.nextPatient}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.7rem] text-emerald-700 font-medium">In Clinic</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Follow-up • General Medicine</span>
                        <span>{todaySummary.nextSlot}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                      <span>Current queue</span>
                      <span className="font-semibold text-slate-800">{todaySummary.currentQueue} patients waiting</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900">Live Queue</h2>
                      <span className="text-[0.7rem] text-slate-500 uppercase tracking-wide">Updated in real time</span>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="font-medium text-slate-800">Token {todaySummary.liveNumber}</span>
                        <span className="text-emerald-600 font-semibold">Now Serving</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-slate-700">Next: A-18, A-19</span>
                        <span className="text-slate-500">Approx 10 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Today\'s appointments */}
                <div className="lg:col-span-7 xl:col-span-5 rounded-2xl bg-white/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900">Today\'s Appointments</h2>
                      <p className="text-xs text-slate-500">Overview of upcoming patients for today.</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      View all
                    </button>
                  </div>
                  <div className="-mx-3 sm:mx-0 flex-1 overflow-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="text-left text-[0.7rem] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                          <th className="px-3 py-2 font-medium">Time</th>
                          <th className="px-3 py-2 font-medium">Patient</th>
                          <th className="px-3 py-2 font-medium">Reason</th>
                          <th className="px-3 py-2 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingAppointments.map(row => (
                          <tr key={`${row.time}-${row.name}`} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                            <td className="px-3 py-2 whitespace-nowrap text-slate-700">{row.time}</td>
                            <td className="px-3 py-2 text-slate-800 font-medium">{row.name}</td>
                            <td className="px-3 py-2 text-slate-500">{row.reason}</td>
                            <td className="px-3 py-2 text-right">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold ${
                                  row.status === 'Next'
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Notifications & activity */}
                <div className="lg:col-span-12 xl:col-span-3 space-y-4">
                  <div className="rounded-2xl bg-white/90 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900">Notifications</h2>
                      <span className="text-[0.7rem] text-slate-400">Today</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {notifications.map((note, idx) => (
                        <li
                          key={idx}
                          className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2 hover:border-primary-100 hover:bg-primary-50/40 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{note.type}</span>
                            <span className="text-[0.7rem] text-slate-400">{note.time}</span>
                          </div>
                          <p className="mt-1 text-slate-700 text-xs sm:text-[0.8rem] leading-snug">{note.message}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">Focus Mode</div>
                    <div className="text-sm sm:text-base font-semibold">Keep your consultations distraction-free.</div>
                    <p className="text-xs text-primary-50/90">
                      Notifications are summarised here while you focus on one patient at a time.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection !== 'dashboard' && (
            <div className="rounded-2xl bg-white/90 shadow-sm p-6 text-sm text-slate-500 flex items-center justify-center">
              <p>
                The <span className="font-semibold text-slate-700">{navItems.find(n => n.id === activeSection)?.label}</span> section layout is ready.
                Integrate backend data and detailed views as needed.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
