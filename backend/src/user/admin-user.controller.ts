import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserService } from './user.service';

@Controller('admin/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async listUsers() {
    const users = await this.userService.getAllUsers();
    return users.map(user => this.userService.sanitize(user));
  }

  @Patch(':id/confirm')
  async confirmUser(@Param('id') id: string) {
    const user = await this.userService.confirmUser(id);
    return this.userService.sanitize(user);
  }

  @Patch(':id/role')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    const user = await this.userService.updateUserRole(id, dto.role);
    return this.userService.sanitize(user);
  }

  @Post('staff')
  async createStaff(@Body() dto: CreateStaffDto) {
    const user = await this.userService.createStaff(dto);
    return {
      message: 'Staff account created successfully',
      user: this.userService.sanitize(user)
    };
  }
}
