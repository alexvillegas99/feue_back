import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { JWT_SECRET } from 'src/config/config.env'; // o como lo tengas
import { UsuarioService } from 'src/usuarios/usuarios.service';

// Payload que enviaremos al frontend
type AuthUserPayload = {
  id: string;
  nombre: string;
  email: string;
  cedula: string;
  genero: string;
  facultadId: string;
  facultadNombre?: string;
  votoAso: boolean;
  votoOrg: boolean;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida email + cédula y retorna los datos básicos del usuario.
   * NO hay password aquí.
   */
  async validateUser(signInDto: SignInDto): Promise<AuthUserPayload | null> {
    const { email, cedula } = signInDto;

    this.logger.log(`Validando usuario por email+cedula: ${email} / ${cedula}`);

    const usuario: any = await this.usuarioService.findByEmailAndCedula(
      email,
      cedula,
    );

    if (!usuario) {
      this.logger.warn(`Usuario no encontrado con email ${email} y cédula ${cedula}`);
      return null;
    }

    const facultad: any = usuario.facultad;

    const result: AuthUserPayload = {
      id: String(usuario._id),
      nombre: usuario.nombre,
      email: usuario.email,
      cedula: usuario.cedula,
      genero: usuario.genero,
      facultadId: facultad ? String(facultad._id) : '',
      facultadNombre: facultad?.nombre,
      votoAso: usuario.votoAso,
      votoOrg: usuario.votoOrg,
    };

    return result;
  }

  /**
   * Genera el JWT y devuelve token + datos del usuario.
   */
  async login(user: AuthUserPayload) {
    const payload = {
      sub: user.id,
      email: user.email,
      cedula: user.cedula,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: '1d', // o el tiempo que quieras
    });

    return {
      accessToken,
      user,
    };
  }

  /**
   * Login directo en un paso: valida y si está bien devuelve token+user.
   */
  async loginDirect(signInDto: SignInDto) {
    const validated = await this.validateUser(signInDto);

    if (!validated) {
      throw new BadRequestException('Datos inválidos: revisa email o cédula');
    }

    return this.login(validated);
  }
}
