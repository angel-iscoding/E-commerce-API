import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Order } from 'src/modules/orders/order.entity';
import { Product } from 'src/modules/products/product.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn()
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[]; 
}