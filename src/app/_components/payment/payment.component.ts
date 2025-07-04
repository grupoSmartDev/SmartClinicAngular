import { Component } from '@angular/core';
import { PaymentService } from '../../_services/payment.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  isLoading = false;
  paymentStatus = '';

  customerData = {
    email: 'teste@email.com',
    name: 'João Silva'
  };

  constructor(private paymentService: PaymentService) { }

  async ngOnInit() {
    // Buscar chave pública da Stripe
    this.paymentService.getConfig().subscribe(async (config) => {
      this.stripe = await loadStripe(config.publishableKey);
    });
    this.setupElements();
  }

  setupElements() {
    if (!this.stripe) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });

    this.cardElement.mount('#card-element');
  }

  async processPayment() {
    if (!this.stripe || !this.cardElement) return;

    this.isLoading = true;
    this.paymentStatus = '';

    try {
      // 1. Criar cliente
      const customerResponse = await this.paymentService.createCustomer(this.customerData).toPromise();
      const customerId = customerResponse.customerId;

      // 2. Criar Payment Intent
      const paymentIntentRequest = {
        amount: 2990, // R$ 29,90 em centavos
        currency: 'brl',
        customerId: customerId
      };

      const paymentIntentResponse = await this.paymentService.createPaymentIntent(paymentIntentRequest).toPromise();

      // 3. Confirmar pagamento
      const { error } = await this.stripe.confirmCardPayment(paymentIntentResponse!.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.customerData.name,
            email: this.customerData.email,
          },
        }
      });

      if (error) {
        this.paymentStatus = `Erro: ${error.message}`;
      } else {
        this.paymentStatus = 'Pagamento realizado com sucesso!';
      }

    } catch (error: any) {
      this.paymentStatus = `Erro: ${error.message}`;
    }

    this.isLoading = false;
  }
}
