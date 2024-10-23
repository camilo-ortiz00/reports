import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getUsers(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener la lista de usuarios
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

// Actualizar un usuario
async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, email, password, identity_document } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedData: any = {
      name,
      email,
      identity_document, // Incluir documento de identidad
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}


// Eliminar un usuario
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  try {
    await prisma.user.delete({
      where: { id },
    });
    return res.status(204).end(); // No content
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}
