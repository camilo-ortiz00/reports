import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getRoles(req, res);
    case 'POST':
      return createRole(req, res);
    case 'PUT':
      return updateRole(req, res);
    case 'DELETE':
      return deleteRole(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los roles o uno específico por ID
async function getRoles(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  try {
    if (id) {
      const role = await prisma.role.findUnique({
        where: { id: Number(id) },
        // Eliminar include permissions
      });

      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      return res.status(200).json(role);
    }

    const roles = await prisma.role.findMany();
    return res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return res.status(500).json({ error: 'Error al obtener roles' });
  }
}

// Crear un nuevo rol
async function createRole(req: NextApiRequest, res: NextApiResponse) {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  try {
    const newRole = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({ error: 'Error al crear el rol' });
  }
}

// Actualizar un rol existente
async function updateRole(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, description } = req.body;

  if (!id || !name || !description) {
    return res.status(400).json({ error: 'ID, name, and description are required' });
  }

  try {
    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    return res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({ error: 'Error al actualizar el rol' });
  }
}

// Eliminar un rol
async function deleteRole(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID del rol no proporcionado' });
  }

  try {
    await prisma.role.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Rol eliminado con éxito' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({ error: 'Error al eliminar el rol' });
  }
}
