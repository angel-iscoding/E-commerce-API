import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from 'src/store-management/categories/category.entity'; 
import { OrderDetail } from 'src/store-management/ordersDetails/orderDetail.entity'; 
import { Cart } from '../cart/cart.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number; 

  @Column({ nullable: true, default: 'ruta/a/tu/imagen/por/defecto.jpg' })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  @JoinTable()
  orderDetails: OrderDetail[]; 

  @ManyToMany(() => Cart, (cart) => cart.products)
  @JoinTable()
  cart: Cart[];
}