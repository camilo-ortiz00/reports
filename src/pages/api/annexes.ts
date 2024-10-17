import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getAnnexes(req, res);
    case 'POST':
      return createAnnex(req, res);
    case 'PUT':
      return updateAnnex(req, res);
    case 'DELETE':
      return deleteAnnex(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los anexos o por ID
async function getAnnexes(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const annex = await prisma.annex.findUnique({
        where: { id: Number(id) },
      });
      if (!annex) return res.status(404).json({ message: 'Anexo no encontrado' });
      return res.status(200).json(annex);
    }

    const annexes = await prisma.annex.findMany();
    return res.status(200).json(annexes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener anexos' });
  }
}

// Crear un nuevo anexo
async function createAnnex(req: NextApiRequest, res: NextApiResponse) {
  const { report_id, description, url } = req.body;

  if (!description || !url || !report_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const newAnnex = await prisma.annex.create({
      data: { description, url, report_id: Number(report_id) },
    });
    return res.status(201).json(newAnnex);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el anexo' });
  }
}

// Actualizar un anexo existente
async function updateAnnex(req: NextApiRequest, res: NextApiResponse) {
  const { id, description, url } = req.body;

  if (!id || !description || !url) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const updatedAnnex = await prisma.annex.update({
      where: { id: Number(id) },
      data: { description, url },
    });
    return res.status(200).json(updatedAnnex);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el anexo' });
  }
}

// Eliminar un anexo
async function deleteAnnex(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID del anexo requerido' });
  }

  try {
    await prisma.annex.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Anexo eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el anexo' });
  }
}
