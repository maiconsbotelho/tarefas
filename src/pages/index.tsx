import HeroBanner from '@/components/heroBanner';
import InfoButtons from '@/components/infoButtons';
import Slogan from '@/components/slogan';
import { db } from '@/services/firebaseConnections';
import { collection, getDocs } from 'firebase/firestore';
import { GetStaticProps } from 'next';
import Head from 'next/head';

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main className="h-custom-calc bg-primary flex w-full flex-col items-center justify-center">
        <HeroBanner />
        <Slogan />
        <InfoButtons posts={posts} comments={comments} />
      </main>
    </div>
  );
}

// Função para buscar os dados no banco de dados
export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, 'comments'); // Referência para a coleção de comentários
  const postRef = collection(db, 'tarefas'); // Referência para a coleção de tarefas

  const commentSnapshot = await getDocs(commentRef); // Busca os comentários
  const postSnapshot = await getDocs(postRef); // Busca as tarefas

  return {
    props: {
      posts: postSnapshot.size || 0, // Retorna a quantidade de tarefas
      comments: commentSnapshot.size || 0, // Retorna a quantidade de comentários
    },
    revalidate: 60, //revalida a cada 60 segundos
  };
};
