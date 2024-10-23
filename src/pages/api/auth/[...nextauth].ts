import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt'; // Importa bcrypt

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email o Documento de Identificación', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Credenciales recibidas:', credentials);
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Por favor, ingresa tanto el email como la contraseña');
        }

        // Busca al usuario en la base de datos usando el email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },           // Buscar por email
              { identity_document: credentials.identifier } // O buscar por documento de identidad
            ],
          },
        });

        if (!user) {
          console.error('Usuario no encontrado');
          throw new Error('Usuario no encontrado');
        }

        // Compara la contraseña ingresada con la contraseña almacenada (hash)
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.error('Contraseña incorrecta');
          throw new Error('Contraseña incorrecta');
        }

        console.log('Autenticación exitosa para:', user);
        return { id: String(user.id), name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Aquí aseguramos que el ID se adjunte al token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // Aquí aseguramos que el ID esté en la sesión
      }
      return session;
    },
  },  
});
