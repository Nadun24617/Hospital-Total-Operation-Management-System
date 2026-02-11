import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    await this.ensureDoctorsForDoctorUsers();
    return this.prisma.doctor.findMany({
      orderBy: { fullName: 'asc' }
    });
  }

  async findConfirmed() {
    await this.ensureDoctorsForDoctorUsers();
    return this.prisma.doctor.findMany({
      where: {
        user: {
          role: UserRole.DOCTOR,
          isConfirmed: true
        }
      },
      orderBy: { fullName: 'asc' }
    });
  }

  async findOne(id: number) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async create(data: Prisma.DoctorUncheckedCreateInput) {
    return this.prisma.doctor.create({ data });
  }

  async update(id: number, data: Prisma.DoctorUncheckedUpdateInput) {
    const existing = await this.prisma.doctor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.doctor.update({ where: { id }, data });
  }

  private async ensureDoctorsForDoctorUsers() {
    const [doctorUsers, existingDoctors] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: UserRole.DOCTOR },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      }),
      this.prisma.doctor.findMany({ select: { userId: true } })
    ]);

    const existingUserIds = new Set(existingDoctors.map(d => d.userId));
    const missingUsers = doctorUsers.filter(u => !existingUserIds.has(u.id));

    if (!missingUsers.length) return;

    await this.prisma.$transaction(
      missingUsers.map(user =>
        this.prisma.doctor.create({
          data: {
            userId: user.id,
            fullName: `${user.firstName} ${user.lastName}`.trim(),
            slmcNumber: `TEMP-${user.id.slice(0, 8)}`,
            specializationId: 0,
            phone: user.phone,
            email: user.email
          }
        })
      )
    );
  }
}
