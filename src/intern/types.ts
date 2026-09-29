export type Service = 'website' | 'nfc' | 'hosting';
export type Interest = Service | 'bundle';
export type Status = 'neu' | 'in_arbeit' | 'erledigt';

export interface Staff {
  id: string;
  name: string;
  initials: string;
}

export interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  business: string | null;
  email: string;
  phone: string | null;
  message: string;
  interests: Interest[];
  lang: 'de' | 'en';
  status: Status;
  assignee: string | null;
  notes: string | null;
  customer_id: string | null;
}

export interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  business: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  services: Service[];
  hosting_until: string | null;
  notes: string | null;
  assignee: string | null;
}

export type NewEnquiry = Pick<Enquiry, 'name' | 'business' | 'email' | 'phone' | 'message' | 'interests' | 'lang'>;
export type CustomerInput = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;

export interface Session {
  email: string;
  staff: Staff | null;
}

export interface Store {
  demo: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  session(): Promise<Session | null>;
  updatePassword(password: string): Promise<void>;
  requestPasswordReset(email: string, redirectTo: string): Promise<void>;

  staff(): Promise<Staff[]>;
  enquiries(): Promise<Enquiry[]>;
  createEnquiry(input: NewEnquiry): Promise<void>;
  updateEnquiry(id: string, patch: Partial<Pick<Enquiry, 'status' | 'assignee' | 'notes' | 'customer_id'>>): Promise<void>;
  deleteEnquiry(id: string): Promise<void>;

  customers(): Promise<Customer[]>;
  createCustomer(input: CustomerInput): Promise<Customer>;
  updateCustomer(id: string, patch: Partial<CustomerInput>): Promise<void>;
  deleteCustomer(id: string): Promise<void>;
}
