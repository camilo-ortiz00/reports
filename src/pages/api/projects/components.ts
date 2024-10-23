// pages/api/components.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getComponents(req, res);
    case 'POST':
      return createComponent(req, res);
    case 'PUT':
      return updateComponent(req, res);
    case 'DELETE':
      return deleteComponent(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los componentes o por ID
async function getComponents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const components = await prisma.component.findMany({
      include: {
        projects: true,
      },
    });
    return res.status(200).json(components);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener componentes' });
  }
}

// Crear un nuevo componente
async function createComponent(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, work_lines, project_id } = req.body;

  if (!name || !project_id) {
    return res.status(400).json({ error: 'Los campos name y project_id son obligatorios' });
  }

  try {
    const newComponent = await prisma.component.create({
      data: {
        name,
        description: description || null,
        work_lines: work_lines || null,
        project_id,
      },
    });
    return res.status(201).json(newComponent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el componente' });
  }
}

// Actualizar un componente existente
async function updateComponent(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, description, work_lines } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID es obligatorio' });
  }

  try {
    const updatedComponent = await prisma.component.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        work_lines,
      },
    });
    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el componente' });
  }
}

// Eliminar un componente
async function deleteComponent(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID del componente no proporcionado' });
  }

  try {
    await prisma.component.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Componente eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el componente' });
  }
}
