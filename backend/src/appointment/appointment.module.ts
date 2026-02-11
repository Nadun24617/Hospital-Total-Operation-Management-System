import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { PatientAppointmentController } from './patient-appointment.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AppointmentController, PatientAppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
