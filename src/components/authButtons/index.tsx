import useAuth from '@/hooks/useAuth';
import { signIn, signOut } from 'next-auth/react';

// Componente para exibir os botões de autenticação
const AuthButtons = () => {
  // Busca os dados de autenticação
  const { session, isLoading, isAuthenticated } = useAuth();

  // Verifica se está carregando
  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {/* Verifica se está autenticado */}
      {isAuthenticated ? (
        // Botão para deslogar
        <button
          onClick={() => signOut()}
          className="border-secondary text-secondary hover:bg-secondary hover:text-primary cursor-pointer rounded-3xl border-2 bg-transparent px-8 py-2 duration-300 hover:scale-105 hover:transform hover:font-bold"
        >
          Olá {session?.user?.name}
        </button>
      ) : (
        // Botão para autenticar com o Google
        <button
          onClick={() => signIn('google')}
          className="border-secondary text-secondary hover:bg-secondary hover:text-primary cursor-pointer rounded-3xl border-2 bg-transparent px-8 py-2 duration-300 hover:scale-105 hover:transform hover:font-bold"
        >
          Entrar
        </button>
      )}
    </>
  );
};

export default AuthButtons;
