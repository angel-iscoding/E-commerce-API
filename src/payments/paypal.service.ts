import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PaypalService {
    private environment: paypal.core.SandboxEnvironment;
    private client: paypal.core.PayPalHttpClient;

    constructor() {
        this.environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET,
        );
        this.client = new paypal.core.PayPalHttpClient(this.environment);
    }

    async createOrder(amount: string, currency: string): Promise<any> {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
            amount: {
                currency_code: currency,
                value: amount,
            },
            },
        ],
        });

        try {
        const order = await this.client.execute(request);
        return order.result;
        } catch (error) {
        throw new Error(`Error creating PayPal order: ${error.message}`);
        }
    }

    async captureOrder(orderId: string): Promise<any> {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        try {
        const capture = await this.client.execute(request);
        return capture.result;
        } catch (error) {
        throw new Error(`Error capturing PayPal order: ${error.message}`);
        }
    }
}