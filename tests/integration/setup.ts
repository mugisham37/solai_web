import { beforeEach } from "vitest";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { apiClient } from "@/lib/api/client";
import { TEST_ORIGIN } from "./support/config";
import { flushRedis } from "./support/redis";

/**
 * The real refresh flow relies on a browser automatically resending the
 * httpOnly refresh cookie. Plain Node axios has no such behavior, so the
 * shared apiClient singleton (the same instance every src/lib/api/services/*
 * function calls) is wrapped with a cookie jar here, once, before any
 * integration test runs — this is the only difference from how the browser
 * uses this client.
 */
wrapper(apiClient);
apiClient.defaults.jar = new CookieJar();
apiClient.defaults.withCredentials = true;
apiClient.defaults.headers.common.Origin = TEST_ORIGIN;

beforeEach(() => {
  flushRedis();
  // A fresh cookie jar too, so one test's session cookie can never leak
  // into the next test's requests.
  apiClient.defaults.jar = new CookieJar();
});
