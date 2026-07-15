import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  emailOTPClient,
  magicLinkClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [
    emailOTPClient(),
    magicLinkClient(),
    passkeyClient(),
    twoFactorClient({
      twoFactorPage: "/two-factor",
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  emailOtp,
  magicLink,
  passkey,
  twoFactor,
} = authClient;
