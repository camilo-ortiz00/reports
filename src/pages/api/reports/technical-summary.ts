import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { calculateStatus } from './reports';

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
        include: {
          support_annex: true, // Cambiar a "support_annex" como se define en el modelo
        },
      });

      if (!technicalSummary) {
        return res.status(404).json({ message: 'Sinopsis técnica no encontrada' });
      }

      return res.status(200).json(technicalSummary);
    }

    const technicalSummaries = await prisma.technicalSummary.findMany({
      include: {
        support_annex: true, // Incluir la relación en el caso de múltiples registros
      },
    });

    return res.status(200).json(technicalSummaries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las Sinopsis técnicas' });
  }
}


// Crear
async function createTechnical(req: NextApiRequest, res: NextApiResponse) {
  const { report_id, name_technical, obtained_result, product_description, support_annex_id, observations } = req.body;

  if (!report_id || !obtained_result || !product_description) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try{
    const newTechnicalSummary = await prisma.technicalSummary.create({
      data: {
        report_id: Number(report_id),
        name_technical,
        obtained_result,
        product_description,
        support_annex_id: support_annex_id ? Number(support_annex_id) : null,
        observations: observations || '', 
      },
    });
    const newStatus = await calculateStatus(Number(report_id));
    await prisma.report.update({
      where: { id: Number(report_id) },
      data: { status: newStatus },
    });
    return res.status(201).json(newTechnicalSummary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear la Sinopsis técnica' });
  }
}

// Actualizar un anexo existente
async function updateTechnical(req: NextApiRequest, res: NextApiResponse) {
  const { id, report_id, name_technical, obtained_result, product_description, support_annex_id, observations } = req.body;

  if (!id || !report_id || !obtained_result || !product_description) {
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }

  try{
    const updatedTechnicalSummary = await prisma.technicalSummary.update({
      where: { id: Number(id) },
      data: {
        report_id: Number(report_id),
        name_technical,
        obtained_result,
        product_description,
        support_annex_id: support_annex_id ? Number(support_annex_id) : null,
        observations: observations || '',
      },
    });
    const newStatus = await calculateStatus(Number(report_id));
    await prisma.report.update({
      where: { id: Number(report_id) },
      data: { status: newStatus },
    });
    return res.status(200).json(updatedTechnicalSummary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar la Sinopsis técnica' });
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
    return res.status(200).json({ message: 'Sinopsis técnica eliminada con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar la Sinopsis técnica' });
  }
}
