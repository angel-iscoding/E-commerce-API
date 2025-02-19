import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorizationHeader = request.headers['authorization'];

    if (authorizationHeader) {
      const [authType, token] = authorizationHeader.split(' ');

      if (authType === 'Bearer' && token) {
        try {
          const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
          request['user'] = payload; // Si el token es válido, asignamos el usuario
          return true;
        } catch (error) {
          response.status(401).json({ message: 'Token no válido' });
          return false;
        }
      }
    }

    if (request.url.startsWith('/cart')) {
      console.log('No autentificado');
      
      request['user'] = undefined;
      return true;
    }

    response.status(401).json({ message: 'Acceso no autorizado' });
    return false;
  }
}
