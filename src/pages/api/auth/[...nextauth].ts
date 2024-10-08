import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Credenciales recibidas:', credentials); // Log para verificar las credenciales
        
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
      
        if (!user) {
          console.error('Usuario no encontrado');
          return null; // No existe el usuario
        }
      
        // Si la contraseña está en texto claro:
        if (credentials?.password !== user.password) {
          console.error('Contraseña incorrecta');
          return null; // La contraseña no coincide
        }
      
        // Si las credenciales son correctas
        console.log('Autenticación exitosa para:', user); // Log para verificar el usuario autenticado
        return { id: String(user.id), name: user.name, email: user.email };
      },
      
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Asegurarse de que el id sea un string
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Asegurarse de que session.user no sea undefined
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
