import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { Prisma, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeDoctor = {
    doctor: { select: { fullName: true, specializationId: true } },
  } as const;

  async findAll(filters?: {
    status?: AppointmentStatus;
    doctorId?: number;
    date?: string;
  }) {
    const where: Prisma.AppointmentWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.doctorId) {
      where.doctorId = filters.doctorId;
    }
    if (filters?.date) {
      where.date = new Date(filters.date);
    }

    return this.prisma.appointment.findMany({
      where,
      include: this.includeDoctor,
      orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
    });
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: this.includeDoctor,
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async create(data: {
    doctorId: number;
    userId?: string;
    patientName: string;
    contactNumber: string;
    reason?: string;
    appointmentType: string;
    date: Date;
    timeSlot: string;
    status?: AppointmentStatus;
  }) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: data.doctorId },
    });
    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    if (data.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    const existingSlot = await this.prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: data.date,
        timeSlot: data.timeSlot,
        status: { not: 'CANCELLED' },
      },
      select: { id: true },
    });
    if (existingSlot) {
      throw new BadRequestException('Selected time slot is already booked');
    }

    const maxQueue = await this.prisma.appointment.aggregate({
      _max: { queueNumber: true },
      where: { doctorId: data.doctorId, date: data.date },
    });
    const queueNumber = (maxQueue._max.queueNumber ?? 0) + 1;

    return this.prisma.appointment.create({
      data: { ...data, queueNumber },
      include: this.includeDoctor,
    });
  }

  async findMine(userId: string, filters?: { status?: AppointmentStatus }) {
    const where: Prisma.AppointmentWhereInput = { userId };
    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.appointment.findMany({
      where,
      include: this.includeDoctor,
      orderBy: [{ date: 'desc' }, { timeSlot: 'asc' }],
    });
  }

  async cancelMine(id: number, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== 'UPCOMING') {
      throw new BadRequestException('Only upcoming appointments can be cancelled');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: this.includeDoctor,
    });
  }

  async update(id: number, data: Prisma.AppointmentUncheckedUpdateInput) {
    const existing = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: this.includeDoctor,
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.delete({ where: { id } });
  }
}
