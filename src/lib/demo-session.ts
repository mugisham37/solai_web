const SESSION_KEY = "solai_demo_session";
const SESSION_EVENT = "solai:session-change";

export interface DemoSession {
  email: string;
  name?: string;
  onboardingComplete: boolean;
}

// Cached so repeated reads return a referentially stable value when the
// underlying storage hasn't changed — required for useSyncExternalStore.
let cachedRaw: string | null = null;
let cachedValue: DemoSession | null = null;

function readSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    cachedValue = null;
  }
  return cachedValue;
}

function writeSession(session: DemoSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getDemoSession(): DemoSession | null {
  return readSession();
}

export function setDemoSession(input: {
  email: string;
  name?: string;
  onboardingComplete?: boolean;
}) {
  const existing = readSession();
  writeSession({
    email: input.email,
    name: input.name ?? existing?.name,
    onboardingComplete: input.onboardingComplete ?? existing?.onboardingComplete ?? false,
  });
}

export function markOnboardingComplete() {
  const existing = readSession();
  if (!existing) return;
  writeSession({ ...existing, onboardingComplete: true });
}

export function clearDemoSession() {
  writeSession(null);
}

export { SESSION_EVENT };
