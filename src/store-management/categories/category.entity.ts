import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { Product } from 'src/store-management/products/product.entity'; // Asegúrate de importar la entidad Product

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @ManyToMany(() => Product, (product) => product.category)
  @JoinColumn()
  products: Product[]; 
}