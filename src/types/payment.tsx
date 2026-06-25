// src/types/payment.ts
export type PaymentMethodType = 'stripe' | 'paypal' | 'bank_transfer' | 'crypto';

export interface StripeDetails {
  publishable_key: string;
  description: string;
  accepted_cards: string[];
}

export interface PaypalDetails {
  business_email: string;
  description: string;
  paypal_link: string;
}

export interface BankTransferDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  routing_number: string;
  swift_code: string;
  iban: string;
  reference_prefix: string;
  instructions: string;
}

export interface CryptoDetails {
  bitcoin_address: string;
  ethereum_address: string;
  usdt_address: string;
  usdt_network: string;
  description: string;
  confirmation_email: string;
}

export type PaymentDetails =
  | StripeDetails
  | PaypalDetails
  | BankTransferDetails
  | CryptoDetails;

export interface PaymentMethodRecord {
  id: string;
  method_type: PaymentMethodType;
  is_enabled: boolean;
  details: PaymentDetails;
  created_at: string;
  updated_at: string;
}