'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
}