import Header from '@/components/header';
import Providers from '@/components/providers/Providers';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Header />
      <Component {...pageProps} />
    </Providers>
  );
}
