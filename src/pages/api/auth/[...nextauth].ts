import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import  prisma  from '../../../../lib/prisma'; 

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor, ingresa tanto el email como la contraseña');
        }

        // Busca al usuario en la base de datos usando el email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error('Usuario no encontrado');
          throw new Error('Usuario no encontrado');
        }

        // Compara la contraseña ingresada con la contraseña almacenada (en texto claro)
        if (credentials.password !== user.password) {
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
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
