import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getTrackings(req, res);
    case 'PUT':
      return updateTracking(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los seguimientos
async function getTrackings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const trackings = await prisma.reportTracking.findMany({
      include: {
        report: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.status(200).json(trackings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener los seguimientos' });
  }
}

// Actualizar un seguimiento
async function updateTracking(req: NextApiRequest, res: NextApiResponse) {
  const { id, note, report_id } = req.body;

  if (!id || !report_id || !note) {
    return res.status(400).json({
      error: 'Los campos id (tracking_id), report_id y note son obligatorios',
    });
  }

  try {
    const existingTracking = await prisma.reportTracking.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTracking || existingTracking.report_id !== Number(report_id)) {
      return res.status(404).json({
        error: 'El seguimiento no pertenece al reporte especificado o no existe',
      });
    }

    // Actualizar el seguimiento
    const updatedTracking = await prisma.reportTracking.update({
      where: { id: Number(id) },
      data: { note },
      include: { 
        report: { 
          include: { user: true } 
        } 
      }, // Incluir relaciones
    });

    return res.status(200).json(updatedTracking);
  } catch (error) {
    console.error('Error al actualizar el seguimiento:', error);
    return res.status(500).json({
      error: 'Error al actualizar el seguimiento',
    });
  }
}

