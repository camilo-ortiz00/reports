import { Role } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      image: string;
      id: string;
      name?: string | null;
      email?: string | null;
      role: {
        id: number;
        name: string;
      };
    };
  }

  interface User {
    id: string;
    role: {
      id: number;
      name: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: {
      id: number;
      name: string;
    };
    image: string;
  }
}
