import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

// Configurações de autenticação
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET as string,
};

export default NextAuth(authOptions);
