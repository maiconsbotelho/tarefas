import Link from 'next/link';

// Componente para exibir o logo
const Logo = () => {
  return (
    <Link href="/" className="text-4xl font-bold">
      <h1 className="text-secondary">
        Tarefas<span className="text-accent pl-1">+</span>
      </h1>
    </Link>
  );
};

export default Logo;
