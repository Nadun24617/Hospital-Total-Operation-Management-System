import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import LabManagement from '../components/LabManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LayoutDashboard, Clock, Users, CalendarDays, History, User, ChevronLeft, ChevronRight, LogOut, FlaskConical } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'primary' | 'green' | 'amber' | 'red';
}

function StatCard({ label, value, accent = 'primary' }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    primary: 'border-sky-200 bg-sky-50 text-sky-900',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    red: 'border-rose-200 bg-rose-50 text-rose-900',
  };

  return (
    <Card className={`transition-colors px-4 py-3 sm:px-5 sm:py-4 ${accentClasses[accent]}`}>
      <span className="text-xs sm:text-[0.8rem] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="mt-1 text-xl sm:text-2xl font-semibold leading-tight block">{value}</span>
    </Card>
  );
}

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'appointments' | 'patients' | 'schedule' | 'history' | 'profile' | 'lab'>('dashboard');

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
    { id: 'dashboard' as const, label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'appointments' as const, label: 'Appointments', icon: <Clock className="h-5 w-5" /> },
    { id: 'patients' as const, label: 'Patient List', icon: <Users className="h-5 w-5" /> },
    { id: 'lab' as const, label: 'Lab Requests', icon: <FlaskConical className="h-5 w-5" /> },
    { id: 'schedule' as const, label: 'Schedule / Availability', icon: <CalendarDays className="h-5 w-5" /> },
    { id: 'history' as const, label: 'Consultation History', icon: <History className="h-5 w-5" /> },
    { id: 'profile' as const, label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-muted text-slate-900">
      {/* Side navigation */}
      <aside
        className={`relative flex flex-col bg-white border-r border-border transition-all duration-300 ease-out ${
          collapsed ? 'w-18 md:w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              D
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Doctor Portal</span>
                <span className="text-xs text-slate-500 truncate">{user?.firstName} {user?.lastName}</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-2 h-8 w-8 p-0"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? 'bg-accent text-foreground hover:bg-accent'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        <Separator />
        <div className="px-3 py-4">
          <Button
            variant="destructive"
            className="w-full bg-red-50 text-destructive hover:bg-red-100"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {activeSection === 'dashboard' && 'Today\'s Overview'}
              {activeSection === 'appointments' && 'Appointments'}
              {activeSection === 'patients' && 'Patient List'}
              {activeSection === 'lab' && 'Lab Requests'}
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
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {user?.firstName?.[0] ?? 'D'}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Section content */}
        <section className="flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-6">
          {activeSection === 'dashboard' && (
            <>
              {/* Top stats row */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                <StatCard label="Today's Appointments" value={todaySummary.todaysAppointments} accent="primary" />
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
                  <Card>
                    <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900">Next Patient</h2>
                        <Badge variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-50">Up next</Badge>
                      </div>
                      <div className="rounded-md border border-border bg-muted px-3 py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-900">{todaySummary.nextPatient}</span>
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">In Clinic</Badge>
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900">Live Queue</h2>
                        <span className="text-[0.7rem] text-slate-500 uppercase tracking-wide">Updated in real time</span>
                      </div>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                          <span className="font-medium text-slate-800">Token {todaySummary.liveNumber}</span>
                          <span className="text-emerald-600 font-semibold">Now Serving</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                          <span className="text-slate-700">Next: A-18, A-19</span>
                          <span className="text-slate-500">Approx 10 min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle: Today's appointments */}
                <Card className="lg:col-span-7 xl:col-span-5">
                  <CardContent className="p-4 sm:p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900">Today's Appointments</h2>
                        <p className="text-xs text-slate-500">Overview of upcoming patients for today.</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        View all
                      </Button>
                    </div>
                    <div className="-mx-3 sm:mx-0 flex-1 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                            <TableHead className="font-medium">Time</TableHead>
                            <TableHead className="font-medium">Patient</TableHead>
                            <TableHead className="font-medium">Reason</TableHead>
                            <TableHead className="font-medium text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingAppointments.map(row => (
                            <TableRow key={`${row.time}-${row.name}`} className="hover:bg-slate-50/60">
                              <TableCell className="whitespace-nowrap text-slate-700">{row.time}</TableCell>
                              <TableCell className="text-slate-800 font-medium">{row.name}</TableCell>
                              <TableCell className="text-slate-500">{row.reason}</TableCell>
                              <TableCell className="text-right">
                                <Badge
                                  variant="secondary"
                                  className={
                                    row.status === 'Next'
                                      ? 'bg-sky-50 text-sky-700 hover:bg-sky-50'
                                      : 'bg-amber-50 text-amber-700 hover:bg-amber-50'
                                  }
                                >
                                  {row.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Notifications & activity */}
                <div className="lg:col-span-12 xl:col-span-3 space-y-4">
                  <Card>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900">Notifications</h2>
                        <span className="text-[0.7rem] text-slate-400">Today</span>
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm">
                        {notifications.map((note, idx) => (
                          <li
                            key={idx}
                            className="rounded-md border border-border bg-muted px-3 py-2 hover:border-primary/40 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">{note.type}</span>
                              <span className="text-[0.7rem] text-slate-400">{note.time}</span>
                            </div>
                            <p className="mt-1 text-slate-700 text-xs sm:text-[0.8rem] leading-snug">{note.message}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary text-primary-foreground border-0">
                    <CardContent className="px-4 py-4 sm:px-5 sm:py-4 flex flex-col gap-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/75">Focus Mode</div>
                      <div className="text-sm sm:text-base font-semibold">Keep your consultations distraction-free.</div>
                      <p className="text-xs text-primary-foreground/80">
                        Notifications are summarised here while you focus on one patient at a time.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeSection !== 'dashboard' && (
            <>
              {activeSection === 'lab' ? (
                <Card>
                  <CardContent className="p-6">
                    <LabManagement mode="doctor" />
                  </CardContent>
                </Card>
              ) : (
            <Card>
              <CardContent className="p-6 text-sm text-slate-500 flex items-center justify-center">
                <p>
                  The <span className="font-semibold text-slate-700">{navItems.find(n => n.id === activeSection)?.label}</span> section layout is ready.
                  Integrate backend data and detailed views as needed.
                </p>
              </CardContent>
            </Card>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
