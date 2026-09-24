import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING"], { errorMap: () => ({ message: "Address type is required" }) }),
  fullName: z.string().min(1, "Full name is required").max(100, "Name too long"),
  phone: z.string().min(1, "Phone number is required").regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  addressLine1: z.string().min(1, "Address is required").max(200, "Address too long"),
  addressLine2: z.string().max(200, "Address too long").optional(),
  city: z.string().min(1, "City is required").max(100, "City name too long"),
  state: z.string().min(1, "State/Province is required").max(100, "State name too long"),
  postalCode: z.string().min(1, "Postal code is required").max(20, "Invalid postal code"),
  country: z.string().min(1, "Country is required").max(100, "Country name too long"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;