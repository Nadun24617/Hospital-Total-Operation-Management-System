import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';

import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LoginDto } from '../auth/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UserService } from './user.service';

type AuthedRequest = Request & { user?: { sub?: string } };

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return {
      message: 'Signup successful. Await admin activation.',
      user: this.userService.sanitize(user)
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const token = await this.authService.login(user);
    return {
      message: 'Login successful',
      ...token,
      user: this.userService.sanitize(user)
    };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async me(@Req() req: AuthedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.userService.getMe(userId);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async updateMe(@Req() req: AuthedRequest, @Body() dto: UpdateMyProfileDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return this.userService.updateMe(userId, dto);
  }
}
