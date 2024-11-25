// pages/api/projects.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Cambia a un límite mayor, por ejemplo, 5mb
    },
  },
};

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProjects(req, res);
    case 'POST':
      return createProject(req, res);
    case 'PUT':
      return updateProject(req, res);
    case 'DELETE':
      return deleteProject(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los proyectos o por ID
async function getProjects(req: NextApiRequest, res: NextApiResponse) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        component: true,
        reports: true,
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener proyectos' });
  }
}

// Crear un nuevo proyecto
async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, component_id } = req.body;

  if (!name || !component_id) {
    return res.status(400).json({ error: 'Los campos name y component_id son obligatorios' });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || null,
        component_id,
      },
    });
    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el proyecto' });
  }
}

// Actualizar un proyecto existente
async function updateProject(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, description, component_id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID es obligatorio' });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        component_id
      },
    });
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
}

// Eliminar un proyecto
async function deleteProject(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID del proyecto no proporcionado' });
  }

  try {
    await prisma.project.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Proyecto eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el proyecto' });
  }
}
