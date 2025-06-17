export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  specialization?: string; // for doctors
  licenseNumber?: string; // for doctors
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  prescriptions?: Prescription[];
  createdAt: Date;
  updatedAt: Date;
  patient?: User;
  doctor?: User;
}

export interface Prescription {
  _id: string;
  appointmentId: string;
  medications: Medication[];
  instructions: string;
  ocrText?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  totalDoctors: number;
  completedAppointments: number;
  cancelledAppointments: number;
}