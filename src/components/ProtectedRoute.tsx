import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#1B4C44] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#5C6B5F] font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/cms-login" replace />;
  }

  return <>{children}</>;
}
