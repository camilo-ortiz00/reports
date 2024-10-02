import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
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
      res.status(200).json(reports);
    } else if (req.method === 'POST') {
      const { summary, project_id, user_id, status } = req.body;

      if (!project_id || !user_id) {
        return res.status(400).json({ error: 'Los campos project y user son obligatorios' });
      }

      const newReport = await prisma.report.create({
        data: {
          summary: summary || null,
          project_id,
          user_id,
          status: status || null,
        },
      });

      res.status(201).json(newReport);
    } else if (req.method === 'PUT') {
      // Actualizar un reporte existente, solo el campo summary
      const { id, summary } = req.body;

      if (!id || !summary) {
        return res.status(400).json({ error: 'ID y summary son obligatorios' });
      }

      const updatedReport = await prisma.report.update({
        where: { id: Number(id) },
        data: { summary },
      });

      res.status(200).json(updatedReport);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID del reporte no proporcionado' });
      }

      try {
        console.log('Eliminando reporte con ID:', id);
        const deletedReport = await prisma.report.delete({
          where: { id: Number(id) },
        });

        console.log('Reporte eliminado:', deletedReport);
        res.status(200).json({ message: 'Informe eliminado con éxito' });
      } catch (error) {
        console.error('Error al eliminar el informe:', (error as Error).message);
        res.status(500).json({ error: 'Error del servidor', details: (error as Error).message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    await prisma.$disconnect();
  }
}
