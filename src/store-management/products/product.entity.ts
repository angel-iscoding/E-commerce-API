import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from 'src/store-management/categories/category.entity'; 
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/order.entity';

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

  @ManyToMany(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Order, (order) => order.product)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Cart, (cart) => cart.products)
  @JoinColumn()
  cart: Cart[];
}