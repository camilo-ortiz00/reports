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
          select: {  // Utilizar 'select' para obtener solo los campos específicos
            id: true,
            name: true,
            email: true,
            password: true,
            identity_document: true,
            profile_picture: true,
            role: { // Incluir solo los datos del rol necesarios
              select: {
                id: true,
                name: true,
              }
            }
          }
        });
      
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
      
        // Compara la contraseña ingresada con la contraseña almacenada (hash)
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Contraseña incorrecta');
        }
      
      
        // Retorna el usuario con los datos del rol, usando la imagen como base64
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: {
            id: user.role.id,
            name: user.role.name,
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
        token.id = user.id;
        token.role = user.role;
        // No almacenar la imagen binaria en el token
        token.image = user.image; // Solo guarda la URL
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        // Solo pasar la URL de la imagen, no el contenido completo
        session.user.image = token.image;
      }
      return session;
    },
  }
});
