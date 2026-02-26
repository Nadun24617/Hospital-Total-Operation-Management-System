import { Body, Controller, Get, Patch, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { LabRequestStatus } from '@prisma/client';
import type { Request } from 'express';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CompleteLabRequestDto } from './dto/complete-lab-request.dto';
import { MarkSampleCollectedDto } from './dto/mark-sample-collected.dto';
import { LabService } from './lab.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@Controller('lab/requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.STAFF, UserRole.ADMIN, UserRole.NURSE)
export class LabQueueController {
  constructor(private readonly labService: LabService) {}

  @Get()
  async listQueue(@Query('status') status?: LabRequestStatus) {
    return this.labService.listQueue({ status });
  }

  @Get(':code')
  async getQueueItem(@Param('code') code: string) {
    return this.labService.getQueueItem(code);
  }

  @Patch(':code/sample-collected')
  async markSampleCollected(
    @Req() req: AuthedRequest,
    @Param('code') code: string,
    @Body() dto: MarkSampleCollectedDto,
  ) {
    const technicianUserId = req.user?.sub;
    if (!technicianUserId) {
      throw new UnauthorizedException();
    }

    return this.labService.markSampleCollected(code, technicianUserId, dto.technicianName ?? null);
  }

  @Patch(':code/complete')
  async complete(
    @Req() req: AuthedRequest,
    @Param('code') code: string,
    @Body() dto: CompleteLabRequestDto,
  ) {
    const technicianUserId = req.user?.sub;
    if (!technicianUserId) {
      throw new UnauthorizedException();
    }

    return this.labService.completeRequest(code, technicianUserId, dto.technicianName, dto.results);
  }
}
