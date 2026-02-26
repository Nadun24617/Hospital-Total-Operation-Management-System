import { Controller, Get, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LabService } from './lab.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@Controller('lab/reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.USER)
export class PatientLabReportController {
  constructor(private readonly labService: LabService) {}

  @Get('my')
  async listMyReports(@Req() req: AuthedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.labService.listMyReports(userId);
  }

  @Get(':code')
  async getMyReport(@Req() req: AuthedRequest, @Param('code') code: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.labService.getMyReportByCode(userId, code);
  }
}
