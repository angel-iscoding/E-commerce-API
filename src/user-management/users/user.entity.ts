import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../../store-management/orders/order.entity'; 
import { Cart } from 'src/store-management/cart/cart.entity';

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

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]; 

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;
}