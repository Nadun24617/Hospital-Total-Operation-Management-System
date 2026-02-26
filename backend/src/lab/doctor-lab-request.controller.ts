import { Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { LabRequestStatus } from '@prisma/client';
import type { Request } from 'express';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateLabRequestDto } from './dto/create-lab-request.dto';
import { LabService } from './lab.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@Controller('doctor/lab-requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.DOCTOR)
export class DoctorLabRequestController {
  constructor(private readonly labService: LabService) {}

  @Get()
  async listMyRequests(
    @Req() req: AuthedRequest,
    @Query('status') status?: LabRequestStatus,
  ) {
    const doctorUserId = req.user?.sub;
    if (!doctorUserId) {
      throw new UnauthorizedException();
    }

    return this.labService.listDoctorRequests(doctorUserId, { status });
  }

  @Post()
  async createRequest(@Req() req: AuthedRequest, @Body() dto: CreateLabRequestDto) {
    const doctorUserId = req.user?.sub;
    if (!doctorUserId) {
      throw new UnauthorizedException();
    }

    return this.labService.createRequest({
      doctorUserId,
      patientName: dto.patientName,
      patientUserId: dto.patientUserId ?? null,
      appointmentId: dto.appointmentId ?? null,
      tests: dto.tests,
    });
  }

  @Get(':code')
  async getMyRequest(@Req() req: AuthedRequest, @Param('code') code: string) {
    const doctorUserId = req.user?.sub;
    if (!doctorUserId) {
      throw new UnauthorizedException();
    }

    return this.labService.getDoctorRequestByCode(doctorUserId, code);
  }
}
