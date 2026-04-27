import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  classId?: string;
  parentName?: string;
  parentPhone?: string;
  specialization?: string;
  createdAt: any;
}

export interface AvailabilitySlot {
  day: string;
  slot: string;
  type: 'suitable' | 'unsuitable' | 'preferred';
}

export interface TeacherAvailability {
  teacherId: string;
  availability: AvailabilitySlot[];
  updatedAt: any;
}

// Accounting & ERP
export interface Installment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  reminded: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'book' | 'uniform' | 'other';
  price: number;
  stock: number;
  description?: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  itemId?: string; // If it's a purchase
  type: 'fee' | 'purchase';
  amount: number;
  date: any;
  paymentMethod: 'cash' | 'card' | 'online';
  invoiceNumber: string;
}

// Bus Tracking
export interface BusRoute {
  id: string;
  name: string;
  driverName: string;
  driverPhone: string;
  supervisorName: string;
  stops: string[];
  capacity: number;
}

export interface BusSubscription {
  id: string;
  studentId: string;
  routeId: string;
  stopName: string;
  status: 'active' | 'inactive';
}

// Global Config & Modules
export interface AppConfig {
  modules: {
    accounting: boolean;
    inventory: boolean;
    busTracking: boolean;
    scheduler: boolean;
    examManagement: boolean;
    applicantPortal: boolean;
    crm: boolean;
  };
  language: 'ar' | 'en';
}
