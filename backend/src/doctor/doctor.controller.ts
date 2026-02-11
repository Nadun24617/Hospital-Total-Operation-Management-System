import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // Public endpoint for listing doctors
  @Get()
  async listDoctors() {
    return this.doctorService.findAll();
  }


  // Protected endpoints below
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.findOne(id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createDoctor(@Body() dto: CreateDoctorDto) {
    const { joinedDate, ...rest } = dto;
    return this.doctorService.create({
      ...rest,
      joinedDate: joinedDate ? new Date(joinedDate) : undefined
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async updateDoctor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDoctorDto) {
    const { joinedDate, ...rest } = dto;
    return this.doctorService.update(id, {
      ...rest,
      joinedDate: joinedDate ? new Date(joinedDate) : undefined
    });
  }
}
