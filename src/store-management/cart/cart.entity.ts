import { User } from 'src/user-management/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, JoinTable, PrimaryColumn, ManyToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Cart {
    @PrimaryColumn()
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number

    @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'id'})
    user: User;

    @ManyToMany (() => Product, (product) => product.cart)
    @JoinTable({ name: 'cart_products' })
    products: Product[];
}