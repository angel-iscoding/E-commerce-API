import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/database/users/user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersDbService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /*
      Este repositorio se encarga de interactuar con la base de datos.
      Pero permite hacer operaciones mas complejas que las que se pueden hacer con el repositorio de TypeORM.
      Por el momento no se usa, ya que no se requieren operaciones mas complejas.
  */
}