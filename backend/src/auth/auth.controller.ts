import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user – admin only' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @CurrentUser() admin: { role: string },
  ) {
    if (admin.role !== 'ADMIN' && admin.role !== 'HR') {
      throw new ForbiddenException('Only admins can create new user accounts');
    }
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login and receive a JWT' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Get currently authenticated user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }
}

