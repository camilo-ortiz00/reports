import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getReports(req, res);
    case 'POST':
      return createReport(req, res);
    case 'PUT':
      return updateReport(req, res);
    case 'DELETE':
      return deleteReport(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
  
// Obtener todos los informes o por ID
async function getReports(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: true,
        project: true,
        trackings: true,
        technicalSummary: true,
        deliverables: true,
        annexes: true,
      },
    });
    return res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener informes' });
  }
}

//Crear
async function createReport(req: NextApiRequest, res: NextApiResponse) {
  const { summary, project_id, user_id, status } = req.body;

  console.log('Datos del reporte recibidos:', { summary, project_id, user_id, status });

  if (!project_id || !user_id) {
    return res.status(400).json({ error: 'Los campos project y user son obligatorios' });
  }
  try{
  const newReport = await prisma.report.create({
    data: {
      summary: summary || null,
      project_id,
      user_id,
      status: status || 0,
    },
  });
    return res.status(201).json(newReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el informe' });
  }
}

// Actualizar un reporte existente, solo el campo resumen
async function updateReport(req: NextApiRequest, res: NextApiResponse) {
  const { id, summary } = req.body;

  if (!id || !summary) {
    return res.status(400).json({ error: 'ID y summary son obligatorios' });
  }

  try{
  const updatedReport = await prisma.report.update({
    where: { id: Number(id) },
    data: { summary },
  });
  res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el resumen' });
  }
}

async function deleteReport(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID del informe no proporcionado' });
      }

      try {
        await prisma.report.delete({
          where: { id: Number(id) },
        });
        return res.status(200).json({ message: 'informe eliminado con éxito' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el informe' });
      }
    }