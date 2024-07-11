import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

// Componente para prover os contextos da aplicação
const Providers = (props: ProvidersProps) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};

export default Providers;
