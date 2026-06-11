import { useEffect, useState } from "react";

export type Role = "user" | "admin";

export type Session = {
    email: string;
    token: string;
    expiresAt: number;
    role: Role;
};

const KEY = "defisphere.session";
const listeners = new Set<() => void>();

function read(): Session | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const s = JSON.parse(raw) as Session;
        if (!s?.expiresAt || s.expiresAt < Date.now()) {
            localStorage.removeItem(KEY);
            return null;
        }
        return s;
    } catch {
        return null;
    }
}

function emit() {
    for (const l of listeners) l();
}

export const sessionStore = {
    get: read,
    set(session: Session) {
        localStorage.setItem(KEY, JSON.stringify(session));
        emit();
    },
    clear() {
        localStorage.removeItem(KEY);
        emit();
    },
    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
};

export function useSession() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        setSession(read());
        const unsub = sessionStore.subscribe(() => setSession(read()));
        const onStorage = (e: StorageEvent) => {
            if (e.key === KEY) setSession(read());
        };
        window.addEventListener("storage", onStorage);
        return () => {
            unsub();
            window.removeEventListener("storage", onStorage);
        };
    }, []);
    return session;
}

/** Mock sign-in used by the UI-only login page. Replace with real auth later. */
export async function mockSignIn(email: string, password: string): Promise<Session> {
    await new Promise((r) => setTimeout(r, 700));
    if (password.toLowerCase() === "wrongpass") {
        throw new Error("Invalid email or password.");
    }
    const role: Role = /^admin/i.test(email.trim()) ? "admin" : "user";

    const session: Session = {
        email,
        token: crypto.randomUUID(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
        role,
    };
    sessionStore.set(session);
    return session;
}
