import { useSession } from 'next-auth/react';

// Hook para autenticação
const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    session,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };
};

export default useAuth;
