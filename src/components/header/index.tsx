import Logo from '@/components/logo';
import Painel from '@/components/painel';
import AuthButtons from '../authButtons';

// Componente para o cabeçalho
const Header = () => {
  return (
    <header className="bg-primary flex h-20 w-full items-center justify-center">
      <section className="flex w-full max-w-screen-lg items-center justify-between px-5">
        <nav className="flex items-center">
          <Logo />
          <Painel />
        </nav>
        <AuthButtons />
      </section>
    </header>
  );
};

export default Header;
