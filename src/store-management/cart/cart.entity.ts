import { User } from 'src/user-management/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, JoinTable } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number

    @OneToOne(() => User, (user) => user.cart)
    @JoinColumn()
    user: User;

    @OneToMany (() => Product, (product) => product.cart)
    @JoinTable()
    products: Product[];
}