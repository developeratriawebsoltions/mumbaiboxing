export {};

declare global {
  type RazorpayResponse = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };

  type RazorpayOptions = {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void | Promise<void>;
    prefill?: Record<string, string>;
    theme: { color: string };
    modal: { ondismiss: () => void };
  };

  type RazorpayInstance = { open: () => void };
  type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}
