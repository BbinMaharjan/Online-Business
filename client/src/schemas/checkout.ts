import { z } from "zod";
import { addressSchema } from "./address";

export const shippingMethodSchema = z.object({
  id: z.string().min(1, "Shipping method is required"),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().min(0),
  estimatedDays: z.number().min(1),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["COD", "CARD", "WALLET"], { errorMap: () => ({ message: "Payment method is required" }) }),
  provider: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").max(50, "Invalid coupon code").toUpperCase(),
});

export const checkoutAddressSchema = addressSchema.extend({
  saveAddress: z.boolean().default(false),
});

export const checkoutStep1Schema = z.object({
  shippingAddress: checkoutAddressSchema,
  billingAddress: checkoutAddressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
});

export const checkoutStep2Schema = z.object({
  shippingMethodId: z.string().min(1, "Please select a shipping method"),
});

export const checkoutStep3Schema = z.object({
  paymentMethod: paymentMethodSchema,
  savePaymentMethod: z.boolean().default(false),
});

export const checkoutStep4Schema = z.object({
  notes: z.string().max(500, "Notes too long").optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, { message: "You must agree to the terms and conditions" }),
});

export const checkoutSchema = z.object({
  step1: checkoutStep1Schema,
  step2: checkoutStep2Schema,
  step3: checkoutStep3Schema,
  step4: checkoutStep4Schema,
});

export type CheckoutStep1Input = z.infer<typeof checkoutStep1Schema>;
export type CheckoutStep2Input = z.infer<typeof checkoutStep2Schema>;
export type CheckoutStep3Input = z.infer<typeof checkoutStep3Schema>;
export type CheckoutStep4Input = z.infer<typeof checkoutStep4Schema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ShippingMethodInput = z.infer<typeof shippingMethodSchema>;
export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;
export type CouponInput = z.infer<typeof couponSchema>;