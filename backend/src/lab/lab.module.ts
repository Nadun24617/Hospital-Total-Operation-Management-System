import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { DoctorLabRequestController } from './doctor-lab-request.controller';
import { LabQueueController } from './lab-queue.controller';
import { PatientLabReportController } from './patient-lab-report.controller';
import { LabService } from './lab.service';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorLabRequestController, LabQueueController, PatientLabReportController],
  providers: [LabService],
})
export class LabModule {}
