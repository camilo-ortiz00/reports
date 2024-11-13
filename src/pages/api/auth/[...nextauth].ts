import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email o Documento de Identificación', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Por favor, ingresa tanto el email como la contraseña');
        }
      
        // Busca al usuario en la base de datos usando el email o documento de identidad
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },           // Buscar por email
              { identity_document: credentials.identifier } // O buscar por documento de identidad
            ],
          },
          include: {
            role: true, // Incluir los datos del rol del usuario
          },
        });
        console.log('Usuario encontrado:', user); // Verifica si role está presente

        if (!user) {
          console.error('Usuario no encontrado');
          throw new Error('Usuario no encontrado');
        }
      
        // Compara la contraseña ingresada con la contraseña almacenada (hash)
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log('¿Contraseña válida?', isPasswordValid);
              
        if (!isPasswordValid) {
          console.error('Contraseña incorrecta');
          throw new Error('Contraseña incorrecta');
        }
      
        console.log('Autenticación exitosa para:', user);
        
        // Retorna el usuario con los datos del rol
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: {
            id: user.role.id,
            name: user.role.name,
            description: user.role.description,
          },
        };
      },
    })
  ],
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Asigna el ID al token
        token.role = user.role; // Asigna el role al token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // Asigna el ID de usuario a la sesión
        session.user.role = token.role; // Asigna el role a la sesión
      }
      return session;
    },
  }
  
});
