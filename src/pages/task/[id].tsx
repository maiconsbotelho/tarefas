import TextArea from '@/components/TextArea';
import { db } from '@/services/firebaseConnections';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

interface TaskProps {
  item: {
    tarefa: string;
    public: boolean;
    created: string;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

// Componente Task
const Task = ({ item, allComments }: TaskProps) => {
  const { data: session } = useSession(); // Pega os dados da sessão
  const [input, setInput] = useState(''); // Estado para armazenar o valor do input
  const [comments, setComments] = useState<CommentProps[]>(allComments || []); // Estado para armazenar os comentários

  // Função para lidar com o comentário
  async function handleComment(e: FormEvent) {
    e.preventDefault();

    // Se o input estiver vazio, retorna
    if (input === '') return;

    // Se não tiver usuário logado, retorna
    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      setComments((prev) => [...prev, data]);

      setInput('');
    } catch (error) {
      console.log(error);
    }
  }

  // Função para deletar um comentário
  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, 'comments', id); // Referência para o documento
      await deleteDoc(docRef); // Deleta o documento

      const deletedComment = comments.filter((item) => item.id !== id); // Filtra os comentários
      setComments(deletedComment); // Atualiza o estado
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-auto mt-10 flex w-full max-w-screen-lg flex-col items-center justify-center px-5">
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <main className="w-full">
        <h1 className="mb-4 text-2xl font-black">Tarefa</h1>
        <article className="flex items-center justify-center rounded border-2 border-zinc-400 p-4">
          <p className="w-full whitespace-pre-wrap">{item.tarefa}</p>
        </article>
      </main>
      <section className="my-5 w-full max-w-screen-lg">
        <h2 className="my-4">Deixar comentário</h2>
        <form onSubmit={handleComment}>
          <TextArea
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            placeholder="Digite seu comentário..."
          />
          <button
            disabled={!session?.user}
            className="w-full cursor-pointer rounded border-0 bg-blue-500 py-3 text-lg text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Enviar comentário
          </button>
        </form>
      </section>

      <section className="my-5 w-full max-w-screen-lg">
        <h2>Todos comentários</h2>
        {comments.length === 0 && <span>Nenhum comentário encontrado...</span>}

        {comments.map((item) => (
          <article
            key={item.id}
            className="mb-4 items-center rounded border-2 border-zinc-300 p-4"
          >
            <div className="flex items-center">
              <label className="mr-2 rounded bg-zinc-300 px-2 py-1 text-sm">
                {item.name}
              </label>
              {session?.user?.email === item.user && (
                <button
                  className="cursor-pointer border-0 bg-transparent"
                  onClick={() => handleDeleteComment(item.id)}
                >
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap">{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Task;

// Função para buscar a tarefa no banco
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string; // Pega o id da tarefa
  const docRef = doc(db, 'tarefas', id); // Referência para o documento
  const snapshot = await getDoc(docRef); // Busca o documento no banco
  const q = query(collection(db, 'comments'), where('taskId', '==', id)); // Query para buscar os comentários
  const snapshotComments = await getDocs(q); // Busca os comentários no banco

  let allComments: CommentProps[] = []; // Array para armazenar os comentários
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      taskId: doc.data().taskId,
      user: doc.data().user,
      name: doc.data().name,
    });
  });

  // Se o documento não existir, redireciona para a home
  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Se a tarefa não for pública, redireciona para a home
  if (snapshot.data()?.public === false) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Pega a data de criação da tarefa
  const milisseconds = snapshot.data()?.created.seconds * 1000;

  // Cria um objeto com os dados da tarefa
  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(milisseconds).toLocaleDateString('pt-BR'),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
