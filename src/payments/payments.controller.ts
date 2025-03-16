import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

dotenv.config();

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paypalService: PaypalService) {}

    @Get('/config/paypal')
    @ApiOperation({ summary: 'Get PayPal client ID' })
    @ApiResponse({ status: 200, description: 'Client ID retrieved successfully.' })
    async clientPaypal() {
        return { clientId: process.env.PAYPAL_CLIENT_ID };
    }

    @Post('create-order')
    @ApiOperation({ summary: 'Create a PayPal order' })
    @ApiResponse({ status: 201, description: 'Order created successfully.' })
    async createOrder(@Body() body: { amount: string, currency: string }) {
        const { amount, currency } = body;
        return this.paypalService.createOrder(amount, currency);
    }

    @Post('capture-order')
    @ApiOperation({ summary: 'Capture a PayPal order' })
    @ApiResponse({ status: 200, description: 'Order captured successfully.' })
    async captureOrder(@Body() body: { orderId: string }) {
        const { orderId } = body;
        return this.paypalService.captureOrder(orderId);
    }

    @Post('get-token')
    @ApiOperation({ summary: 'Get PayPal access token' })
    @ApiResponse({ status: 200, description: 'Access token retrieved successfully.' })
    async getToken() {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        try {
            const response = await axios.post(
                'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${auth}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error obtaining PayPal token:', error.response.data);
            throw new Error('Error obtaining PayPal token');
        }
    }
}