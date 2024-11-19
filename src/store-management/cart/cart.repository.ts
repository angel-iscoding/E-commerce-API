import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Cart } from "src/store-management/cart/cart.entity";

@Injectable()
export class CartRepository {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>
    ) {}

    async getAllCart(): Promise<Cart[]> {
        return await this.cartRepository.find(); 
    }

    async getCartById(id: string): Promise<Cart> {
        return await this.cartRepository.findOne({where: {id: id}});
    }

    async save (cart: Cart): Promise<Cart> {
        return await this.cartRepository.save(cart);
    }
}