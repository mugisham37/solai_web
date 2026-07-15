import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "@better-auth/passkey";
import { nextCookies } from "better-auth/next-js";
import {
  emailOTP,
  magicLink,
  twoFactor,
} from "better-auth/plugins";
import { db } from "@/lib/db";
import {
  sendMagicLinkEmail,
  sendPasswordResetEmail,
  sendVerificationCodeEmail,
} from "@/lib/email";
import { sendTwoFactorSms } from "@/lib/sms";
import { resolvePasskeyRegistrationUser } from "@/lib/auth/passkey-context";

export const auth = betterAuth({
  appName: "SolAI",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "owner",
        input: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url);
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification" || type === "sign-in") {
          await sendVerificationCodeEmail(email, otp);
        }
        if (type === "forget-password") {
          await sendVerificationCodeEmail(email, otp);
        }
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
    }),
    passkey({
      rpID:
        process.env.NODE_ENV === "production"
          ? new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000")
              .hostname
          : "localhost",
      rpName: "SolAI",
      origin: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
      registration: {
        requireSession: false,
        resolveUser: async ({ context }) =>
          resolvePasskeyRegistrationUser(context),
      },
    }),
    twoFactor({
      issuer: "SolAI",
      allowPasswordless: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          const phone =
            typeof (user as { phoneNumber?: string }).phoneNumber === "string"
              ? (user as { phoneNumber?: string }).phoneNumber
              : null;
          if (!phone) {
            throw new Error("No phone number on file for SMS 2FA");
          }
          await sendTwoFactorSms(phone, otp);
        },
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
