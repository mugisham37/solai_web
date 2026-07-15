import { z } from "zod";
import { isPasswordStrongEnough } from "@/lib/password-strength";

export const signUpEmailSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .refine((value) => isPasswordStrongEnough(value, 2), {
      message: "Choose a stronger password",
    }),
  termsAccepted: z.literal(true, {
    error: "You must accept the Terms of Service and Privacy Policy",
  }),
  marketingOptIn: z.boolean().optional(),
});

export const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const emailOnlySchema = z.object({
  email: z.email("Enter a valid email address"),
});

export const verifyEmailSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be at most 64 characters")
      .refine((value) => isPasswordStrongEnough(value, 2), {
        message: "Choose a stronger password",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const totpCodeSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

export const recoveryCodeSchema = z.object({
  code: z.string().min(8, "Enter a recovery code"),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^\d[\d\s-]{7,}$/, "Enter a valid phone number"),
});

export type SignUpEmailValues = z.infer<typeof signUpEmailSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
