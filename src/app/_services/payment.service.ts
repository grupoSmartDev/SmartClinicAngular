import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateCustomerRequest {
  email: string;
  name: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customerId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

@Injectable({
  providedIn: 'root'
})


export class PaymentService {
  private apiUrl = 'https://localhost:7000/api/payment'; // Ajuste sua URL

  constructor(private http: HttpClient) { }

  createCustomer(request: CreateCustomerRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-customer`, request);
  }

  createPaymentIntent(request: CreatePaymentIntentRequest): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.apiUrl}/create-payment-intent`, request);
  }

  getConfig(): Observable<any> {
    return this.http.get(`${this.apiUrl}/config`);
  }
}