import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { CreateStaffDto } from './dto/create-staff.dto';
import type { CreatePatientDto } from './dto/create-patient.dto';
import type { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import type { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import type { User } from '@prisma/client';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, phone, password, ...rest } = dto;

    await this.ensureUniqueContact(email, phone);

    const passwordHash = await argon2.hash(password);

    return this.prisma.user.create({
      data: {
        ...rest,
        email,
        phone,
        passwordHash,
        status: UserStatus.PENDING,
        isConfirmed: false
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getMe(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitize(user);
  }

  async updateMe(userId: string, dto: UpdateMyProfileDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.ensureUniqueContact(dto.email, dto.phone, userId);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
      },
    });

    return this.sanitize(updated);
  }

  async createStaff(dto: CreateStaffDto): Promise<User> {
    const { email, phone, password, role, slmcNumber, specializationId, description, joinedDate, ...rest } = dto;

    await this.ensureUniqueContact(email, phone);

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        email,
        phone,
        passwordHash,
        role,
        status: UserStatus.ACTIVE,
        isConfirmed: true
      }
    });

    if (role === UserRole.DOCTOR) {
      if (!slmcNumber || specializationId == null) {
        throw new BadRequestException('slmcNumber and specializationId are required for doctor staff accounts');
      }

      await this.prisma.doctor.create({
        data: {
          userId: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          slmcNumber,
          specializationId,
          phone: user.phone,
          email: user.email,
          description: description ?? undefined,
          joinedDate: joinedDate ? new Date(joinedDate) : undefined
        }
      });
    }

    return user;
  }

  async createPatient(dto: CreatePatientDto): Promise<User> {
    const { email, phone, password, status, isConfirmed, ...rest } = dto;

    await this.ensureUniqueContact(email, phone);

    const passwordHash = await argon2.hash(password);

    return this.prisma.user.create({
      data: {
        ...rest,
        email,
        phone,
        passwordHash,
        role: UserRole.USER,
        status: status ?? UserStatus.ACTIVE,
        isConfirmed: isConfirmed ?? true
      }
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async confirmUser(id: string): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (existing.isConfirmed && existing.status === UserStatus.ACTIVE) {
      return existing;
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isConfirmed: true,
        status: UserStatus.ACTIVE
      }
    });
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role }
    });
  }

  async updatePatientByAdmin(id: string, dto: UpdateUserAdminDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (existing.role !== UserRole.USER) {
      throw new BadRequestException('Target user is not a patient');
    }

    if (dto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          id: { not: id }
        }
      });
      if (emailExists) {
        throw new ConflictException('Email already registered');
      }
    }

    if (dto.phone) {
      const phoneExists = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          id: { not: id }
        }
      });
      if (phoneExists) {
        throw new ConflictException('Phone number already registered');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName ?? undefined,
        lastName: dto.lastName ?? undefined,
        email: dto.email ?? undefined,
        phone: dto.phone ?? undefined,
        status: dto.status ?? undefined,
        isConfirmed: dto.isConfirmed ?? undefined
      }
    });
  }

  sanitize(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }

  private async ensureUniqueContact(email: string, phone: string, excludeUserId?: string): Promise<void> {
    const [emailExists, phoneExists] = await Promise.all([
      this.prisma.user.findFirst({
        where: {
          email,
          ...(excludeUserId ? { id: { not: excludeUserId } } : {})
        }
      }),
      this.prisma.user.findFirst({
        where: {
          phone,
          ...(excludeUserId ? { id: { not: excludeUserId } } : {})
        }
      })
    ]);

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    if (phoneExists) {
      throw new ConflictException('Phone number already registered');
    }
  }
}
