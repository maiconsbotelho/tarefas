import TextArea from '@/components/TextArea';
import { db } from '@/services/firebaseConnections';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';

// Interface para tipar o usuário
interface HomeProps {
  user: {
    email: string;
  };
}

// Interface para tipar a tarefa
interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

// Componente Dashboard
export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState(''); // Estado para armazenar o valor do input
  const [publicTask, setPublicTask] = useState(false); // Estado para armazenar se a tarefa é publica ou não
  const [tasks, setTasks] = useState<TaskProps[]>([]); // Estado para armazenar as tarefas

  // UseEffect para carregar as tarefas
  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, 'tarefas'); // Referência para a coleção tarefas
      const q = query(
        tarefasRef,
        orderBy('created', 'desc'),
        where('user', '==', user?.email)
      ); // Query para buscar as tarefas

      // Função para ouvir as mudanças na coleção
      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];

        // Mapeia os documentos e adiciona na lista
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(lista); // Atualiza o estado com a lista de tarefas
      });
    }

    loadTarefas(); // Chama a função para carregar as tarefas
  }, [user?.email]);

  // Função para alterar o estado da tarefa publica
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  // Função para registrar a tarefa
  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') return;

    try {
      // Adiciona a tarefa no banco de dados
      await addDoc(collection(db, 'tarefas'), {
        tarefa: input, // Adiciona a tarefa
        created: new Date(), // Adiciona a data de criação
        user: user?.email, // Adiciona o email do usuário
        public: publicTask, // Adiciona o estado da tarefa publica
      });

      setInput(''); // Limpa o input
      setPublicTask(false); // Reseta o estado da tarefa publica
    } catch (err) {
      console.log(err);
    }
  }

  // Função para copiar a URL da tarefa
  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert('URL Copiada com sucesso!');
  }

  // Função para deletar a tarefa
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
  }

  return (
    <div className="w-full">
      <Head>
        <title>Meu painel de Tarefas</title>
      </Head>
      <main>
        {/* Formulário para registrar a tarefa */}
        <section className="bg-primary flex w-full items-center justify-center">
          <div className="mt-14 w-full max-w-screen-lg px-5 pb-7">
            <h1 className="mb-2 text-white">Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className="my-4">
                <input
                  className="h-5 w-5"
                  type="checkbox"
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label className="ml-2 text-white">
                  Deixar tarefa pública?
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded border-0 bg-blue-500 py-3 text-lg text-white"
              >
                Registrar
              </button>
            </form>
          </div>
        </section>
        {/* Lista de tarefas */}
        <section className="mx-auto mt-8 flex w-full max-w-screen-lg flex-col px-5">
          <h1 className="mb-4 text-center text-3xl">Minhas Tarefas</h1>

          {/* Mapeia as tarefas */}
          {tasks.map((item) => (
            <article
              key={item.id}
              className="mb-4 flex flex-col items-start rounded border-2 border-stone-500 p-4"
            >
              {item.public && (
                // Se a tarefa for publica exibe o label e o botão de compartilhar
                <div className="mb-4 flex items-center justify-center">
                  <label className="rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    PÚBLICO
                  </label>
                  <button
                    className="mx-2 cursor-pointer border-0 bg-transparent"
                    onClick={() => handleShare(item.id)}
                  >
                    <FiShare2 size={22} color="#3b82f6" />
                  </button>
                </div>
              )}
              {/* Exibe a tarefa */}
              <div className="flex w-full items-center justify-between">
                {item.public ? (
                  // Se for publica exibe o link para a tarefa
                  <Link href={`/task/${item.id}`}>
                    <p className="whitespace-pre-wrap">{item.tarefa}</p>
                  </Link>
                ) : (
                  // Se não for publica exibe a tarefa
                  <p className="whitespace-pre-wrap">{item.tarefa}</p>
                )}
                {/* Botão para deletar a tarefa */}
                <button
                  className="mx-2 cursor-pointer border-0 bg-transparent"
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

// Função para verificar se o usuário está autenticado
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    // Se nao tem usuario vamos redirecionar para  /
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Se tem usuario vamos retornar o email do usuario
  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
