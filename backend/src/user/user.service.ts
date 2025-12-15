import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { CreateStaffDto } from './dto/create-staff.dto';
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

  async createStaff(dto: CreateStaffDto): Promise<User> {
    const { email, phone, password, role, ...rest } = dto;

    await this.ensureUniqueContact(email, phone);

    const passwordHash = await argon2.hash(password);

    return this.prisma.user.create({
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
