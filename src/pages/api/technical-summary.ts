import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getTechnicals(req, res);
    case 'POST':
      return createTechnical(req, res);
    case 'PUT':
      return updateTechnical(req, res);
    case 'DELETE':
      return deleteTechnical(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todas las actividades o por ID
async function getTechnicals(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const technicalSummary = await prisma.technicalSummary.findUnique({
        where: { id: Number(id) },
      });
      if (!technicalSummary) return res.status(404).json({ message: 'Actividad no encontrada' });
      return res.status(200).json(technicalSummary);
    }

    const technicalSummaries = await prisma.technicalSummary.findMany();
    return res.status(200).json(technicalSummaries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener actividades' });
  }
}

// Crear
async function createTechnical(req: NextApiRequest, res: NextApiResponse) {
  const { report_id, obtained_result, product_description, support_annex, observations } = req.body;

  if (!report_id || !obtained_result || !product_description) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try{
    const newTechnicalSummary = await prisma.technicalSummary.create({
      data: {
        report_id: Number(report_id),
        obtained_result,
        product_description,
        support_annex: support_annex || '', 
        observations: observations || '', 
      },
    });

    return res.status(201).json(newTechnicalSummary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la actividad' });
  }
}

// Actualizar un anexo existente
async function updateTechnical(req: NextApiRequest, res: NextApiResponse) {
  const { id, report_id, obtained_result, product_description, support_annex, observations } = req.body;

  if (!id || !report_id || !obtained_result || !product_description) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try{
    const updatedTechnicalSummary = await prisma.technicalSummary.update({
      where: { id: Number(id) },
      data: {
        report_id: Number(report_id),
        obtained_result,
        product_description,
        support_annex: support_annex || '',
        observations: observations || '',
      },
    });
    return res.status(200).json(updatedTechnicalSummary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la actividad' });
  }
}

// Eliminar
async function deleteTechnical(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID es obligatorio para eliminar' });
  }

  try{
    await prisma.technicalSummary.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Actividad eliminada con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar la actividad' });
  }
}