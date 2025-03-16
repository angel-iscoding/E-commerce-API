import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../../store-management/orders/order.entity'; 
import { Cart } from 'src/store-management/cart/cart.entity';
import { Role } from 'src/config/role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column('simple-array', {default: Role.User})
  roles: Role[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]; 

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;
}