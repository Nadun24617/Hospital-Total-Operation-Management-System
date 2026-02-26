import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type LabStatus = 'PENDING' | 'SAMPLE_COLLECTED' | 'COMPLETED';

type LabMode = 'doctor' | 'lab' | 'patient';

type LabResultEntry = {
  value?: string;
  remarks?: string;
};

type LabRequest = {
  id: string;
  patientName: string;
  patientUserId: string | null;
  visitId: string | null;
  doctorUserId: string | null;
  doctorName: string | null;
  requestedTests: string[];
  status: LabStatus;
  createdAt: string;
  sampleCollectedAt: string | null;
  completedAt: string | null;
  technicianName: string | null;
  results: Record<string, LabResultEntry>;
};

const STORAGE_KEY = 'labRequests';

const TEST_CATALOG = [
  'Full Blood Count (FBC)',
  'Fasting Blood Sugar (FBS)',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Renal Function Test (RFT)',
  'Urine Full Report (UFR)',
  'C-Reactive Protein (CRP)',
  'Thyroid Profile (T3/T4/TSH)',
];

const statusVariant: Record<LabStatus, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'default',
  SAMPLE_COLLECTED: 'secondary',
  COMPLETED: 'secondary',
};

const statusBadgeClass: Record<LabStatus, string> = {
  PENDING: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  SAMPLE_COLLECTED: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
};

function safeParseRequests(raw: string | null): LabRequest[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as LabRequest[];
  } catch {
    return [];
  }
}

function loadRequests(): LabRequest[] {
  return safeParseRequests(localStorage.getItem(STORAGE_KEY));
}

function saveRequests(requests: LabRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function generateRequestId(now = new Date()) {
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LR-${date}-${rand}`;
}

function formatDateTime(iso: string | null) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString();
}

function buildReportHtml(req: LabRequest) {
  const requested = req.requestedTests
    .map((t) => {
      const entry = req.results?.[t] ?? {};
      const value = (entry.value ?? '').trim() || '-';
      const remarks = (entry.remarks ?? '').trim() || '-';
      return `<tr><td style="padding:8px;border:1px solid #ddd;vertical-align:top;">${escapeHtml(t)}</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(value)}</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(remarks)}</td></tr>`;
    })
    .join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Lab Report ${escapeHtml(req.id)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial; color:#111; padding:24px;">
  <div style="max-width:900px;margin:0 auto;">
    <h1 style="margin:0 0 4px; font-size:22px;">Lab Report</h1>
    <div style="color:#444; margin-bottom:16px;">Request ID: <strong>${escapeHtml(req.id)}</strong></div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="border:1px solid #ddd;border-radius:8px;padding:12px;">
        <div style="font-weight:600;margin-bottom:6px;">Patient</div>
        <div>${escapeHtml(req.patientName)}</div>
        <div style="color:#555;font-size:12px;">User ID: ${escapeHtml(req.patientUserId || '-')}</div>
        <div style="color:#555;font-size:12px;">Visit ID: ${escapeHtml(req.visitId || '-')}</div>
      </div>
      <div style="border:1px solid #ddd;border-radius:8px;padding:12px;">
        <div style="font-weight:600;margin-bottom:6px;">Timeline</div>
        <div style="font-size:13px;color:#333;">Created: ${escapeHtml(formatDateTime(req.createdAt))}</div>
        <div style="font-size:13px;color:#333;">Sample Collected: ${escapeHtml(formatDateTime(req.sampleCollectedAt))}</div>
        <div style="font-size:13px;color:#333;">Completed: ${escapeHtml(formatDateTime(req.completedAt))}</div>
        <div style="font-size:12px;color:#555;">Technician: ${escapeHtml(req.technicianName || '-')}</div>
        <div style="font-size:12px;color:#555;">Doctor: ${escapeHtml(req.doctorName || '-')}</div>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f6f6f6;">Test</th>
          <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f6f6f6;">Value</th>
          <th style="text-align:left;padding:8px;border:1px solid #ddd;background:#f6f6f6;">Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${requested}
      </tbody>
    </table>

    <p style="margin-top:16px;color:#555;font-size:12px;">This report is generated by the hospital system. For clinical interpretation, consult your doctor.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export default function LabManagement({ mode }: { mode?: LabMode }) {
  const { user } = useAuth();

  const inferredMode = useMemo<LabMode>(() => {
    const role = (user?.role ?? '').toUpperCase();
    if (mode) return mode;
    if (role === 'DOCTOR') return 'doctor';
    if (role === 'USER' || role === 'PATIENT') return 'patient';
    return 'lab';
  }, [mode, user?.role]);

  const [requests, setRequests] = useState<LabRequest[]>(() => loadRequests());
  const [activeId, setActiveId] = useState<string>('');

  const [banner, setBanner] = useState('');
  const [error, setError] = useState('');

  // Doctor form state
  const [patientName, setPatientName] = useState('');
  const [patientUserId, setPatientUserId] = useState('');
  const [visitId, setVisitId] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  // Lab entry state
  const [technicianName, setTechnicianName] = useState('');
  const [editingResults, setEditingResults] = useState<Record<string, LabResultEntry>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Keep local state synced if multiple tabs/windows are used.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setRequests(loadRequests());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const activeRequest = useMemo(() => requests.find((r) => r.id === activeId) ?? null, [activeId, requests]);

  useEffect(() => {
    if (!activeRequest) {
      setEditingResults({});
      return;
    }
    setEditingResults(activeRequest.results ?? {});
  }, [activeRequest]);

  const visibleRequests = useMemo(() => {
    if (inferredMode === 'doctor') {
      const myId = user?.id ?? '';
      return requests
        .filter((r) => (myId ? r.doctorUserId === myId : true))
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    if (inferredMode === 'patient') {
      const myId = user?.id ?? '';
      return requests
        .filter((r) => r.status === 'COMPLETED')
        .filter((r) => (myId ? r.patientUserId === myId : false))
        .slice()
        .sort((a, b) => (a.completedAt && b.completedAt ? (a.completedAt < b.completedAt ? 1 : -1) : 0));
    }

    // lab mode: all requests
    const weight: Record<LabStatus, number> = { PENDING: 0, SAMPLE_COLLECTED: 1, COMPLETED: 2 };
    return requests
      .slice()
      .sort((a, b) => {
        const wa = weight[a.status];
        const wb = weight[b.status];
        if (wa !== wb) return wa - wb;
        return a.createdAt < b.createdAt ? 1 : -1;
      });
  }, [inferredMode, requests, user?.id]);

  const toggleTest = (test: string) => {
    setSelectedTests((prev) => (prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]));
  };

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBanner('');

    const pName = patientName.trim();
    if (!pName) {
      setError('Patient name is required.');
      return;
    }
    if (selectedTests.length === 0) {
      setError('Please select at least one test.');
      return;
    }

    setCreating(true);
    try {
      const now = new Date();
      const req: LabRequest = {
        id: generateRequestId(now),
        patientName: pName,
        patientUserId: patientUserId.trim() || null,
        visitId: visitId.trim() || null,
        doctorUserId: user?.id ?? null,
        doctorName: user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : null,
        requestedTests: selectedTests.slice(),
        status: 'PENDING',
        createdAt: now.toISOString(),
        sampleCollectedAt: null,
        completedAt: null,
        technicianName: null,
        results: {},
      };

      const next = [req, ...requests];
      setRequests(next);
      saveRequests(next);

      setBanner(`Lab request created. Request ID: ${req.id}`);
      setPatientName('');
      setPatientUserId('');
      setVisitId('');
      setSelectedTests([]);
      setActiveId(req.id);
    } finally {
      setCreating(false);
    }
  };

  const updateRequest = (id: string, updater: (prev: LabRequest) => LabRequest) => {
    const next = requests.map((r) => (r.id === id ? updater(r) : r));
    setRequests(next);
    saveRequests(next);
  };

  const markSampleCollected = () => {
    if (!activeRequest) return;
    setError('');
    setBanner('');

    if (activeRequest.status !== 'PENDING') {
      setError('Only pending requests can be marked as sample collected.');
      return;
    }

    updateRequest(activeRequest.id, (prev) => ({
      ...prev,
      status: 'SAMPLE_COLLECTED',
      sampleCollectedAt: new Date().toISOString(),
    }));

    setBanner('Status updated to Sample Collected.');
  };

  const completeRequest = async () => {
    if (!activeRequest) return;
    setError('');
    setBanner('');

    if (activeRequest.status !== 'SAMPLE_COLLECTED') {
      setError('Sample must be collected before completing the report.');
      return;
    }

    const tech = technicianName.trim() || (user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : '');
    if (!tech) {
      setError('Technician name is required to complete the report.');
      return;
    }

    const normalized: Record<string, LabResultEntry> = {};
    for (const test of activeRequest.requestedTests) {
      const entry = editingResults[test] ?? {};
      const value = (entry.value ?? '').trim();
      const remarks = (entry.remarks ?? '').trim();
      if (!value && !remarks) {
        setError(`Please enter a value and/or remarks for: ${test}`);
        return;
      }
      normalized[test] = { value, remarks };
    }

    setSaving(true);
    try {
      updateRequest(activeRequest.id, (prev) => ({
        ...prev,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        technicianName: tech,
        results: normalized,
      }));
      setBanner('Report completed and saved.');
    } finally {
      setSaving(false);
    }
  };

  const printReport = () => {
    if (!activeRequest) return;
    const html = buildReportHtml(activeRequest);
    const w = window.open('', '_blank');
    if (!w) {
      window.alert('Pop-up blocked. Please allow pop-ups to print the report.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const downloadReport = () => {
    if (!activeRequest) return;
    const html = buildReportHtml(activeRequest);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeRequest.id}-lab-report.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const requestRowActionLabel = () => (inferredMode === 'patient' ? 'View report' : 'Open');

  const headerTitle = inferredMode === 'doctor'
    ? 'Lab Test Requests'
    : inferredMode === 'patient'
      ? 'My Lab Reports'
      : 'Lab Requests Queue';

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {banner && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{banner}</AlertDescription>
        </Alert>
      )}

      {inferredMode === 'doctor' && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create lab test request</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createRequest}>
            <div className="space-y-2">
              <Label htmlFor="lab-patient-name">Patient name</Label>
              <Input
                id="lab-patient-name"
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lab-patient-userid">Patient user ID (optional)</Label>
              <Input
                id="lab-patient-userid"
                type="text"
                value={patientUserId}
                onChange={(e) => setPatientUserId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Use this to link the report to the patient portal.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lab-visit">Visit ID (optional)</Label>
              <Input
                id="lab-visit"
                type="text"
                value={visitId}
                onChange={(e) => setVisitId(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label>Required tests</Label>
              <div className="flex flex-wrap gap-2">
                {TEST_CATALOG.map((t) => {
                  const active = selectedTests.includes(t);
                  return (
                    <Button
                      key={t}
                      type="button"
                      variant={active ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => toggleTest(t)}
                      className="h-8"
                    >
                      {t}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Submit request'}
              </Button>
            </div>
          </form>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{headerTitle}</h2>
          <Button
            variant="link"
            size="sm"
            className="text-primary"
            onClick={() => {
              setError('');
              setBanner('');
              const next = loadRequests();
              setRequests(next);
            }}
          >
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    {inferredMode === 'patient' ? 'No completed lab reports found.' : 'No lab requests found.'}
                  </TableCell>
                </TableRow>
              ) : (
                visibleRequests.map((r) => (
                  <TableRow key={r.id} className={r.id === activeId ? 'bg-accent/40' : ''}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>{r.patientName}</TableCell>
                    <TableCell>{r.visitId || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[r.status]} className={statusBadgeClass[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.requestedTests.length}</TableCell>
                    <TableCell>{formatDateTime(r.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" size="sm" className="text-primary" onClick={() => setActiveId(r.id)}>
                        {requestRowActionLabel()}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {activeRequest && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Request {activeRequest.id}</h3>
              <div className="text-sm text-muted-foreground">
                Patient: {activeRequest.patientName} {activeRequest.visitId ? `• Visit: ${activeRequest.visitId}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[activeRequest.status]} className={statusBadgeClass[activeRequest.status]}>
                {activeRequest.status}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setActiveId('')}>
                Close
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Created:</span> {formatDateTime(activeRequest.createdAt)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Sample collected:</span> {formatDateTime(activeRequest.sampleCollectedAt)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Completed:</span> {formatDateTime(activeRequest.completedAt)}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Doctor:</span> {activeRequest.doctorName || '-'}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Technician:</span> {activeRequest.technicianName || '-'}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="font-medium mb-2">Requested tests</div>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {activeRequest.requestedTests.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {inferredMode === 'lab' && (
            <div className="rounded-lg border p-4 space-y-4">
              {activeRequest.status === 'PENDING' && (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Collect the required sample (e.g., blood/urine) and then update the status.
                  </p>
                  <Button onClick={markSampleCollected}>Mark Sample Collected</Button>
                </div>
              )}

              {activeRequest.status === 'SAMPLE_COLLECTED' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lab-tech">Technician name</Label>
                      <Input
                        id="lab-tech"
                        value={technicianName}
                        onChange={(e) => setTechnicianName(e.target.value)}
                        placeholder="Enter technician name"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeRequest.requestedTests.map((t) => {
                      const entry = editingResults[t] ?? {};
                      return (
                        <div key={t} className="rounded-md border p-3 space-y-2">
                          <div className="font-medium">{t}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label>Value</Label>
                              <Input
                                value={entry.value ?? ''}
                                onChange={(e) =>
                                  setEditingResults((prev) => ({
                                    ...prev,
                                    [t]: { ...prev[t], value: e.target.value },
                                  }))
                                }
                                placeholder="Numeric value or text"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Remarks</Label>
                              <Textarea
                                rows={2}
                                value={entry.remarks ?? ''}
                                onChange={(e) =>
                                  setEditingResults((prev) => ({
                                    ...prev,
                                    [t]: { ...prev[t], remarks: e.target.value },
                                  }))
                                }
                                placeholder="Remarks / notes"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button disabled={saving} onClick={() => void completeRequest()}>
                      {saving ? 'Saving...' : 'Complete & Generate Report'}
                    </Button>
                  </div>
                </div>
              )}

              {activeRequest.status === 'COMPLETED' && (
                <p className="text-sm text-muted-foreground">
                  This request is completed. The report is available to the doctor, and the patient can print/download it from the patient portal.
                </p>
              )}
            </div>
          )}

          {(inferredMode === 'doctor' || inferredMode === 'patient') && activeRequest.status === 'COMPLETED' && (
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="font-medium">Lab report</div>
                  <div className="text-sm text-muted-foreground">Completed: {formatDateTime(activeRequest.completedAt)}</div>
                </div>
                {inferredMode === 'patient' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={printReport}>
                      Print
                    </Button>
                    <Button size="sm" onClick={downloadReport}>
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRequest.requestedTests.map((t) => {
                      const entry = activeRequest.results?.[t] ?? {};
                      return (
                        <TableRow key={t}>
                          <TableCell className="font-medium">{t}</TableCell>
                          <TableCell>{entry.value || '-'}</TableCell>
                          <TableCell>{entry.remarks || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {(inferredMode === 'doctor' || inferredMode === 'patient') && activeRequest.status !== 'COMPLETED' && (
            <p className="text-sm text-muted-foreground">
              Report will be available once the lab completes the tests.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
