// src/lib/session.ts
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export type Role = 'admin' | 'user';

export type Session = {
    email: string;
    token: string;
    expiresAt: number;
    role: Role;
};

let currentSession: Session | null = null;
const listeners = new Set<(session: Session | null) => void>();

const deriveRole = (email: string | undefined): Role => {
    if (!email) return 'user';
    return email.toLowerCase().startsWith('admin') ? 'admin' : 'user';
};

export const sessionStore = {
    get: (): Session | null => {
        return currentSession;
    },

    // Clean Approach: Sirf storage clear aur listeners ko notify karega
    clear: async (): Promise<void> => {
        if (typeof window !== 'undefined') {
            try {
                await supabase.auth.signOut();
                localStorage.removeItem('supabase.auth.token');
            } catch (err) {
                console.error("Supabase signOut error:", err);
            }
        }
        currentSession = null;
        listeners.forEach((listener) => listener(null));
    },

    set: (session: Session | null): void => {
        currentSession = session;
        listeners.forEach((listener) => listener(currentSession));
    },

    subscribe: (listener: (session: Session | null) => void) => {
        listeners.add(listener);
        listener(currentSession);
        return () => {
            listeners.delete(listener);
        };
    }
};

export function useSession() {
    const [session, setSession] = useState<Session | null>(currentSession);

    useEffect(() => {
        return sessionStore.subscribe((s) => {
            setSession(s);
        });
    }, []);

    return session;
}

if (typeof window !== 'undefined') {
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
            currentSession = {
                email: session.user.email || '',
                token: session.access_token,
                expiresAt: session.expires_at || 0,
                role: deriveRole(session.user.email),
            };
            listeners.forEach((listener) => listener(currentSession));
        }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
            currentSession = {
                email: session.user.email || '',
                token: session.access_token,
                expiresAt: session.expires_at || 0,
                role: deriveRole(session.user.email),
            };
            listeners.forEach((listener) => listener(currentSession));
        } else {
            currentSession = null;
            listeners.forEach((listener) => listener(null));
        }
    });
}