interface InfoButtonsProps {
  posts: number;
  comments: number;
}

// Componente para exibir os botões de informações
const InfoButtons = ({ posts, comments }: InfoButtonsProps) => {
  return (
    <div className="w-8/10 flex flex-col items-center justify-center sm:max-w-screen-lg sm:flex-row">
      {/* Botão para exibir a quantidade de posts */}
      <section className="bg-secondary m-3 w-full rounded-md px-11 py-3 text-center duration-300 hover:scale-105 hover:transform sm:w-80">
        <span>+{posts} posts</span>
      </section>
      {/* Botão para exibir a quantidade de comentários */}
      <section className="bg-secondary m-3 w-full rounded-md px-11 py-3 text-center duration-300 hover:scale-105 hover:transform sm:w-80">
        <span>+{comments} comentários</span>
      </section>
    </div>
  );
};

export default InfoButtons;
