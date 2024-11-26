import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from 'src/user-management/users/user.entity'; 
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;
  
  @OneToMany(() => Product, (product) => product.order)
  @JoinColumn()
  product: Product[];
}