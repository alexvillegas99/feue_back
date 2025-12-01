import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { UserData } from './decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth') // Agrupa endpoints en Swagger
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // -----------------------------------------------
  // 📌 LOGIN
  // -----------------------------------------------
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Permite iniciar sesión usando email + cédula y devuelve un JWT válido.',
  })
  @ApiBody({
    description: 'Credenciales del usuario',
    type: SignInDto,
    examples: {
      default: {
        summary: 'Ejemplo de login',
        value: {
          email: 'alex@gmail.com',
          cedula: '1728392012',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso. Devuelve token y datos del usuario.',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciales inválidas.',
  })
  async login(@Body() signInDto: SignInDto) {
    this.logger.log(`Intento de login de ${signInDto.email}`);
    return this.authService.loginDirect(signInDto);
  }

  // -----------------------------------------------
  // 📌 PROFILE
  // -----------------------------------------------

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:
      'Devuelve información del usuario según el JWT enviado en el header Authorization.',
  })
  @ApiResponse({
    status: 200, 
    description: 'Devuelve el usuario autenticado.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o ausente.',
  })
  getProfile(@UserData() user: any) {
    return user;
  }
}
