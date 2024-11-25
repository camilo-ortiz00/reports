import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Usa un singleton para evitar múltiples instancias en desarrollo
const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({ 
    log: ['query', 'info', 'warn', 'error'], // Útil para depuración
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
