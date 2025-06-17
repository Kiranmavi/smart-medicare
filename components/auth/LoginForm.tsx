'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heart, Stethoscope, Shield } from 'lucide-react';

export default function LoginForm() {
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'doctor',
    phone: '',
    specialization: '',
    licenseNumber: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(registerData);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center medical-gradient p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">MediCare</h1>
          </div>
          <p className="text-gray-600">Smart Medical Appointment System</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="medical-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="medical-input"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full medical-button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 space-y-2">
                  <p className="text-sm text-gray-600 font-medium">Demo Accounts:</p>
                  <div className="grid gap-2 text-xs">
                    <div className="flex items-center p-2 bg-blue-50 rounded">
                      <Shield className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <p className="font-medium">Admin: admin@medicare.com</p>
                        <p className="text-gray-600">Password: admin123</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-green-50 rounded">
                      <Stethoscope className="h-4 w-4 text-green-500 mr-2" />
                      <div>
                        <p className="font-medium">Doctor: doctor@medicare.com</p>
                        <p className="text-gray-600">Password: doctor123</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 bg-purple-50 rounded">
                      <Heart className="h-4 w-4 text-purple-500 mr-2" />
                      <div>
                        <p className="font-medium">Patient: patient@medicare.com</p>
                        <p className="text-gray-600">Password: patient123</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join our healthcare platform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        className="medical-input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                        className="medical-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="medical-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      id="reg-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="medical-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">I am a</Label>
                    <Select value={registerData.role} onValueChange={(value: 'patient' | 'doctor') => 
                      setRegisterData(prev => ({ ...prev, role: value }))
                    }>
                      <SelectTrigger className="medical-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {registerData.role === 'doctor' && (
                    <>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={registerData.specialization}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, specialization: e.target.value }))}
                          className="medical-input"
                          placeholder="e.g., Cardiology, Pediatrics"
                        />
                      </div>
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          value={registerData.licenseNumber}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                          className="medical-input"
                        />
                      </div>
                    </>
                  )}
                  <Button type="submit" className="w-full medical-button" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}