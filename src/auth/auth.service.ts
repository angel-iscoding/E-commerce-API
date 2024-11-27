import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/user-management/users/user.service';
import { SignUpDto } from 'src/database/auth/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/config/role.enum';
import { User } from 'src/user-management/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<Omit<User, 'password'> | undefined> {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        
        const isAdmin = signUpDto.role === Role.Admin;
        
        return await this.usersService.createUser({ 
            ...signUpDto, 
            password: hashedPassword,
            admin: isAdmin
        });
    }

    async signIn(email: string, password: string): Promise<string | null> {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Email o contraseña incorrectos');
        }

        const payload = { email: user.email, sub: user.id, roles: user.admin ? [Role.Admin] : [Role.User] };
        
        return this.jwtService.sign(payload, { secret: `${process.env.JWT_SECRET}` });
    }
}