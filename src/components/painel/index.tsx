import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

// Componente para exibir o painel do usuário
const Painel = () => {
  const { isAuthenticated } = useAuth();

  // Verifica se o usuário está autenticado
  if (!isAuthenticated) {
    return null; // Retorna nulo para não exibir o botão
  }

  // Retorna o botão para acessar o painel
  return (
    <Link href="/dashboard" legacyBehavior>
      <a className="bg-secondary xs:text-lg text-primary mx-4 rounded-md px-4 py-1 text-center text-xs">
        Meu Painel
      </a>
    </Link>
  );
};

export default Painel;
