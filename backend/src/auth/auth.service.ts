import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.passwordHash, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('Account not confirmed yet');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account not active yet');
    }

    return user;
  }

  async login(user: User): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      expiresIn: this.parseExpiresIn(this.configService.get('JWT_EXPIRES_IN', '1h'))
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const numberValue = Number(expiresIn);
    if (!Number.isNaN(numberValue)) {
      return numberValue;
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/i);
    if (!match) {
      return 3600;
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 3600;
    }
  }
}
