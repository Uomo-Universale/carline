import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'staff' | 'guardian';

export interface AuthProfile {
  role: UserRole;
  guardianId: string | null;
}

interface AuthState {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

async function fetchProfile(userId: string): Promise<AuthProfile | null> {
  const { data } = await supabase
    .from('profiles').select('role, guardian_id').eq('id', userId).single();
  if (!data) return null;
  return { role: data.role as UserRole, guardianId: data.guardian_id ?? null };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  initialize: () => {
    // Hydrate from existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ user: session.user, profile, loading: false });
      } else {
        set({ loading: false });
      }
    });

    // Stay in sync with Supabase auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ user: session.user, profile });
      } else {
        set({ user: null, profile: null });
      }
    });
  },
}));
