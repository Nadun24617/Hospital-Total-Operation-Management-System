import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { LabRequestStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

type CreateLabRequestInput = {
  doctorUserId: string;
  patientName: string;
  patientUserId?: string | null;
  appointmentId?: number | null;
  tests: string[];
};

type LabResultInput = {
  testName: string;
  value?: string | null;
  remarks?: string | null;
};

function normalizeTests(tests: string[]) {
  const cleaned = tests
    .map((t) => (t ?? '').trim())
    .filter(Boolean);

  return Array.from(new Set(cleaned));
}

function generateCode(now = new Date()) {
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LR-${date}-${rand}`;
}

@Injectable()
export class LabService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRequest = {
    tests: {
      select: {
        testName: true,
        resultValue: true,
        resultRemarks: true,
      },
      orderBy: { id: 'asc' as const },
    },
    doctorUser: { select: { id: true, firstName: true, lastName: true } },
    patientUser: { select: { id: true, firstName: true, lastName: true } },
  } as const;

  async createRequest(input: CreateLabRequestInput) {
    const tests = normalizeTests(input.tests);
    if (tests.length === 0) {
      throw new BadRequestException('At least one test is required');
    }

    if (!input.patientName.trim()) {
      throw new BadRequestException('Patient name is required');
    }

    if (input.patientUserId) {
      const patient = await this.prisma.user.findUnique({
        where: { id: input.patientUserId },
        select: { id: true },
      });
      if (!patient) {
        throw new BadRequestException('Patient user not found');
      }
    }

    if (input.appointmentId) {
      const appt = await this.prisma.appointment.findUnique({
        where: { id: input.appointmentId },
        include: { doctor: { select: { userId: true } }, user: { select: { id: true } } },
      });
      if (!appt) {
        throw new BadRequestException('Appointment not found');
      }
      if (appt.doctor.userId !== input.doctorUserId) {
        throw new ForbiddenException('You cannot create lab requests for other doctors\' appointments');
      }
    }

    // Retry a few times in case of rare code collisions.
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const code = generateCode();
      try {
        return await this.prisma.labRequest.create({
          data: {
            code,
            doctorUserId: input.doctorUserId,
            patientUserId: input.patientUserId ?? null,
            appointmentId: input.appointmentId ?? null,
            patientName: input.patientName.trim(),
            tests: {
              create: tests.map((t) => ({ testName: t })),
            },
          },
          include: this.includeRequest,
        });
      } catch (err: any) {
        // Prisma unique constraint violation for code
        if (err?.code === 'P2002') {
          continue;
        }
        throw err;
      }
    }

    throw new BadRequestException('Could not generate a unique lab request code. Please retry.');
  }

  async listDoctorRequests(doctorUserId: string, filters?: { status?: LabRequestStatus }) {
    const where: Prisma.LabRequestWhereInput = { doctorUserId };
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.labRequest.findMany({
      where,
      include: this.includeRequest,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDoctorRequestByCode(doctorUserId: string, code: string) {
    const req = await this.prisma.labRequest.findUnique({
      where: { code },
      include: this.includeRequest,
    });

    if (!req) {
      throw new NotFoundException('Lab request not found');
    }

    if (req.doctorUserId !== doctorUserId) {
      throw new ForbiddenException('Access denied');
    }

    return req;
  }

  async listQueue(filters?: { status?: LabRequestStatus }) {
    const where: Prisma.LabRequestWhereInput = {};
    if (filters?.status) {
      where.status = filters.status;
    }

    const statusOrder = ['PENDING', 'SAMPLE_COLLECTED', 'COMPLETED'] as const;

    const requests = await this.prisma.labRequest.findMany({
      where,
      include: this.includeRequest,
      orderBy: [{ createdAt: 'desc' }],
    });

    // Stable-ish sort: Pending -> Sample Collected -> Completed
    return requests.sort((a, b) => {
      const wa = statusOrder.indexOf(a.status);
      const wb = statusOrder.indexOf(b.status);
      if (wa !== wb) return wa - wb;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
  }

  async getQueueItem(code: string) {
    const req = await this.prisma.labRequest.findUnique({
      where: { code },
      include: this.includeRequest,
    });

    if (!req) {
      throw new NotFoundException('Lab request not found');
    }

    return req;
  }

  async markSampleCollected(code: string, technicianUserId: string, technicianName?: string | null) {
    const existing = await this.prisma.labRequest.findUnique({
      where: { code },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Lab request not found');
    }

    if (existing.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be marked as sample collected');
    }

    return this.prisma.labRequest.update({
      where: { code },
      data: {
        status: 'SAMPLE_COLLECTED',
        sampleCollectedAt: new Date(),
        technicianUserId,
        technicianName: technicianName?.trim() || undefined,
      },
      include: this.includeRequest,
    });
  }

  async completeRequest(code: string, technicianUserId: string, technicianName: string | null | undefined, results: LabResultInput[]) {
    const req = await this.prisma.labRequest.findUnique({
      where: { code },
      include: { tests: { select: { id: true, testName: true } } },
    });

    if (!req) {
      throw new NotFoundException('Lab request not found');
    }

    if (req.status !== 'SAMPLE_COLLECTED') {
      throw new BadRequestException('Sample must be collected before completing results');
    }

    const techName = (technicianName ?? '').trim();
    if (!techName) {
      throw new BadRequestException('Technician name is required');
    }

    const mapped = new Map<string, LabResultInput>();
    for (const r of results) {
      const key = (r.testName ?? '').trim();
      if (!key) continue;
      mapped.set(key, {
        testName: key,
        value: (r.value ?? '').trim() || null,
        remarks: (r.remarks ?? '').trim() || null,
      });
    }

    // Ensure each requested test has at least one field filled.
    for (const t of req.tests) {
      const entry = mapped.get(t.testName);
      if (!entry) {
        throw new BadRequestException(`Missing result for test: ${t.testName}`);
      }
      if (!entry.value && !entry.remarks) {
        throw new BadRequestException(`Result value or remarks required for test: ${t.testName}`);
      }
    }

    const testUpdates = req.tests.map((t) => {
      const entry = mapped.get(t.testName)!;
      return this.prisma.labRequestTest.update({
        where: { id: t.id },
        data: {
          resultValue: entry.value,
          resultRemarks: entry.remarks,
        },
        select: { id: true },
      });
    });

    await this.prisma.$transaction([
      ...testUpdates,
      this.prisma.labRequest.update({
        where: { code },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          technicianUserId,
          technicianName: techName,
        },
        select: { id: true },
      }),
    ]);

    return this.getQueueItem(code);
  }

  async listMyReports(patientUserId: string) {
    return this.prisma.labRequest.findMany({
      where: {
        status: 'COMPLETED',
        patientUserId,
      },
      include: this.includeRequest,
      orderBy: { completedAt: 'desc' },
    });
  }

  async getMyReportByCode(patientUserId: string, code: string) {
    const req = await this.prisma.labRequest.findUnique({
      where: { code },
      include: this.includeRequest,
    });

    if (!req) {
      throw new NotFoundException('Lab report not found');
    }

    if (req.status !== 'COMPLETED') {
      throw new ForbiddenException('Report not available yet');
    }

    if (req.patientUserId !== patientUserId) {
      throw new ForbiddenException('Access denied');
    }

    return req;
  }
}
