import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const [authType, token] = authorizationHeader.split(' ');

    if (authType !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token no válido');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET});
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }
}