import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuarios/usuarios.service';
import { JWT_SECRET } from 'src/config/config.env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { sub } = payload; // sub = ID del usuario

    if (!sub) {
      throw new UnauthorizedException('Token inválido: no tiene sub');
    }

    // Buscar usuario por _id
    const usuario:any = await this.usuarioService.findById(sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Lo que devuelve validate() es lo que se enviará a @UserData()
    return {
      id: String(usuario._id),
      nombre: usuario.nombre,
      email: usuario.email,
      cedula: usuario.cedula,
      genero: usuario.genero,
      facultadId: usuario.facultad?._id ? String(usuario.facultad._id) : '',
      facultadNombre: usuario.facultad?.nombre || '',
      votoAso: usuario.votoAso,
      votoOrg: usuario.votoOrg,
    };
  }
}
