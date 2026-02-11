import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { AppointmentStatus } from '@prisma/client';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('admin/appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async listAppointments(
    @Query('status') status?: AppointmentStatus,
    @Query('doctorId') doctorId?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentService.findAll({
      status,
      doctorId: doctorId ? Number(doctorId) : undefined,
      date,
    });
  }

  @Get(':id')
  async getAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.findOne(id);
  }

  @Post()
  async createAppointment(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create({
      ...dto,
      date: new Date(dto.date),
    });
  }

  @Patch(':id')
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    const { date, ...rest } = dto;
    return this.appointmentService.update(id, {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
    });
  }

  @Delete(':id')
  async deleteAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentService.remove(id);
  }
}
