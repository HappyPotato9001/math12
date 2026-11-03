export type ClassSession = {
  roomCode: string;
  roomName: string;
  memberId: string;
  displayName: string;
};

const SESSION_KEY = "math12-class-session";

export function readClassSession(): ClassSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ClassSession;
  } catch {
    return null;
  }
}

export function writeClassSession(session: ClassSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearClassSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
