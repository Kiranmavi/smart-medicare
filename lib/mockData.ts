import { User, Appointment, DashboardStats } from '@/types';

// Mock users data
export const mockUsers: User[] = [
  {
    _id: '1',
    email: 'admin@medicare.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    email: 'doctor@medicare.com',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1234567891',
    specialization: 'Cardiology',
    licenseNumber: 'MD12345',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '3',
    email: 'doctor2@medicare.com',
    name: 'Dr. Michael Chen',
    role: 'doctor',
    phone: '+1234567892',
    specialization: 'Pediatrics',
    licenseNumber: 'MD12346',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '4',
    email: 'patient@medicare.com',
    name: 'John Smith',
    role: 'patient',
    phone: '+1234567893',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: '5',
    email: 'patient2@medicare.com',
    name: 'Emily Davis',
    role: 'patient',
    phone: '+1234567894',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock appointments data
export const mockAppointments: Appointment[] = [
  {
    _id: '1',
    patientId: '4',
    doctorId: '2',
    date: '2024-12-20',
    time: '10:00',
    status: 'scheduled',
    reason: 'Regular checkup',
    notes: '',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
    patient: mockUsers.find(u => u._id === '4'),
    doctor: mockUsers.find(u => u._id === '2'),
  },
  {
    _id: '2',
    patientId: '4',
    doctorId: '3',
    date: '2024-12-18',
    time: '14:30',
    status: 'completed',
    reason: 'Flu symptoms',
    notes: 'Patient recovered well',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-18'),
    patient: mockUsers.find(u => u._id === '4'),
    doctor: mockUsers.find(u => u._id === '3'),
  },
  {
    _id: '3',
    patientId: '5',
    doctorId: '2',
    date: '2024-12-22',
    time: '09:00',
    status: 'scheduled',
    reason: 'Heart consultation',
    notes: '',
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16'),
    patient: mockUsers.find(u => u._id === '5'),
    doctor: mockUsers.find(u => u._id === '2'),
  },
  {
    _id: '4',
    patientId: '5',
    doctorId: '2',
    date: '2024-12-15',
    time: '11:00',
    status: 'cancelled',
    reason: 'Blood pressure check',
    notes: 'Patient cancelled',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-14'),
    patient: mockUsers.find(u => u._id === '5'),
    doctor: mockUsers.find(u => u._id === '2'),
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalPatients: mockUsers.filter(u => u.role === 'patient').length,
  totalDoctors: mockUsers.filter(u => u.role === 'doctor').length,
  totalAppointments: mockAppointments.length,
  todayAppointments: mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  completedAppointments: mockAppointments.filter(a => a.status === 'completed').length,
  cancelledAppointments: mockAppointments.filter(a => a.status === 'cancelled').length,
};

// Mock API functions
export const mockAPI = {
  // Auth functions
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Simple password check for demo
    const validPasswords: Record<string, string> = {
      'admin@medicare.com': 'admin123',
      'doctor@medicare.com': 'doctor123',
      'doctor2@medicare.com': 'doctor123',
      'patient@medicare.com': 'patient123',
      'patient2@medicare.com': 'patient123',
    };
    
    if (validPasswords[email] !== password) {
      throw new Error('Invalid credentials');
    }
    
    return {
      user,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  },

  register: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  },

  // Appointments functions
  getPatientAppointments: async (patientId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAppointments.filter(a => a.patientId === patientId);
  },

  getDoctorAppointments: async (doctorId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAppointments.filter(a => a.doctorId === doctorId);
  },

  createAppointment: async (appointmentData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment: Appointment = {
      _id: Date.now().toString(),
      ...appointmentData,
      status: 'scheduled' as const,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: mockUsers.find(u => u._id === appointmentData.patientId),
      doctor: mockUsers.find(u => u._id === appointmentData.doctorId),
    };
    
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  completeAppointment: async (appointmentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const appointment = mockAppointments.find(a => a._id === appointmentId);
    if (appointment) {
      appointment.status = 'completed';
      appointment.updatedAt = new Date();
    }
    
    return { success: true };
  },

  // Doctors functions
  getDoctors: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.filter(u => u.role === 'doctor');
  },

  // Admin functions
  getAdminStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardStats;
  },

  // Chat function
  sendChatMessage: async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple rule-based responses for demo
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('headache')) {
      return 'For headaches, try resting in a quiet, dark room, staying hydrated, and applying a cold or warm compress. If headaches persist or are severe, please consult a healthcare professional.';
    }
    
    if (lowerMessage.includes('fever')) {
      return 'For fever, rest, stay hydrated, and consider taking acetaminophen or ibuprofen as directed. Seek medical attention if fever is high (>103°F/39.4°C) or persists.';
    }
    
    if (lowerMessage.includes('cough')) {
      return 'For cough, try staying hydrated, using throat lozenges, or honey (for ages 1+). See a doctor if cough persists over 2 weeks or includes blood.';
    }
    
    if (lowerMessage.includes('appointment')) {
      return 'You can book an appointment through the "Book Appointment" button on your dashboard. Choose your preferred doctor, date, and time slot.';
    }
    
    if (lowerMessage.includes('prescription')) {
      return 'You can upload prescription images using the "Upload Prescription" feature. Our OCR technology will extract the text for you.';
    }
    
    return "I'm here to help with your health questions. For specific medical concerns, please consult with a healthcare professional. You can book an appointment through your dashboard.";
  },

  // Prescription function
  savePrescription: async (prescriptionData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPrescription = {
      _id: Date.now().toString(),
      ...prescriptionData,
      createdAt: new Date(),
    };
    
    return newPrescription;
  },
};