'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageCircle, Upload, Plus, Stethoscope } from 'lucide-react';
import { Appointment } from '@/types';
import BookAppointmentDialog from '../appointments/BookAppointmentDialog';
import ChatBot from '../chat/ChatBot';
import PrescriptionUpload from '../prescriptions/PrescriptionUpload';
import { format } from 'date-fns';
import { mockAPI } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const userAppointments = await mockAPI.getPatientAppointments(user._id);
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) >= new Date()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your health appointments and records</p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={() => setShowChat(true)} variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </Button>
          <Button onClick={() => setShowUpload(true)} variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Prescription
          </Button>
          <Button onClick={() => setShowBookDialog(true)} className="medical-button gap-2">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="medical-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Next appointment coming up</p>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Stethoscope className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">All time appointments</p>
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Based on recent checkups</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Your latest medical appointments and consultations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments yet</p>
              <Button 
                onClick={() => setShowBookDialog(true)} 
                className="mt-4 medical-button"
              >
                Book Your First Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.reason}</p>
                      <p className="text-sm text-gray-600">
                        Dr. {appointment.doctor?.name} • {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <BookAppointmentDialog 
        open={showBookDialog} 
        onOpenChange={setShowBookDialog}
        onSuccess={fetchAppointments}
      />
      
      <ChatBot 
        open={showChat} 
        onOpenChange={setShowChat} 
      />
      
      <PrescriptionUpload 
        open={showUpload} 
        onOpenChange={setShowUpload} 
      />
    </div>
  );
}