import { createClient } from '@supabase/supabase-js';
import type { Customer, Enquiry, Staff, Store } from './types';

const fail = (error: { message: string } | null) => {
  if (error) throw new Error(error.message);
};

export function createSupabaseStore(url: string, key: string): Store {
  const db = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  let staffCache: Staff[] | null = null;

  const store: Store = {
    demo: false,

    async signIn(email, password) {
      const { error } = await db.auth.signInWithPassword({ email, password });
      fail(error);
    },

    async signOut() {
      staffCache = null;
      const { error } = await db.auth.signOut();
      fail(error);
    },

    async session() {
      const { data } = await db.auth.getSession();
      const user = data.session?.user;
      if (!user) return null;
      const staff = (await store.staff()).find((s) => s.id === user.id) ?? null;
      return { email: user.email ?? '', staff };
    },

    async updatePassword(password) {
      const { error } = await db.auth.updateUser({ password });
      fail(error);
    },

    async requestPasswordReset(email, redirectTo) {
      const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
      fail(error);
    },

    async staff() {
      if (staffCache) return staffCache;
      const { data, error } = await db.from('staff').select('id, name, initials').order('name');
      fail(error);
      staffCache = (data ?? []) as Staff[];
      return staffCache;
    },

    async enquiries() {
      const { data, error } = await db.from('enquiries').select('*').order('created_at', { ascending: false });
      fail(error);
      return (data ?? []) as Enquiry[];
    },

    async createEnquiry(input) {
      const { error } = await db.from('enquiries').insert(input);
      fail(error);
    },

    async updateEnquiry(id, patch) {
      const { error } = await db.from('enquiries').update(patch).eq('id', id);
      fail(error);
    },

    async deleteEnquiry(id) {
      const { error } = await db.from('enquiries').delete().eq('id', id);
      fail(error);
    },

    async customers() {
      const { data, error } = await db.from('customers').select('*').order('business');
      fail(error);
      return (data ?? []) as Customer[];
    },

    async createCustomer(input) {
      const { data, error } = await db.from('customers').insert(input).select().single();
      fail(error);
      return data as Customer;
    },

    async updateCustomer(id, patch) {
      const { error } = await db.from('customers').update(patch).eq('id', id);
      fail(error);
    },

    async deleteCustomer(id) {
      const { error } = await db.from('customers').delete().eq('id', id);
      fail(error);
    },
  };

  return store;
}
