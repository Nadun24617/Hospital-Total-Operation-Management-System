import { Body, Controller, Get, Patch, Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { AppointmentStatus } from '@prisma/client';
import type { Request } from 'express';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

type AuthedRequest = Request & { user?: { sub?: string } };

@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.USER)
export class PatientAppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('my')
  async listMyAppointments(
    @Req() req: AuthedRequest,
    @Query('status') status?: AppointmentStatus,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.appointmentService.findMine(userId, { status });
  }

  @Post()
  async createMyAppointment(@Req() req: AuthedRequest, @Body() dto: CreateAppointmentDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.appointmentService.create({
      doctorId: dto.doctorId,
      userId,
      patientName: dto.patientName,
      contactNumber: dto.contactNumber,
      reason: dto.reason,
      appointmentType: dto.appointmentType,
      date: new Date(dto.date),
      timeSlot: dto.timeSlot,
      status: 'UPCOMING',
    });
  }

  @Patch(':id/cancel')
  async cancelMyAppointment(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.appointmentService.cancelMine(id, userId);
  }
}
