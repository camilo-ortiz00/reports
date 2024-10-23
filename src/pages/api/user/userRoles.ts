import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'PUT':
      return updateUserRole(req, res);
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Actualizar el rol de un usuario
async function updateUserRole(req: NextApiRequest, res: NextApiResponse) {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    return res.status(400).json({ error: 'ID de usuario y rol son requeridos' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { role_id: Number(roleId) },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
}
