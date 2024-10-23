import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Aquí define el tipo de ID
      name: string;
      email: string;
      // Agrega otras propiedades que necesites
    };
    token: string; // Agrega esta línea para la propiedad token
  }
}
