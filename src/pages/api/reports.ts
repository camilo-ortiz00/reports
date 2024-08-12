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
          annexes: true
        }
      });
      res.status(200).json(reports);
    } else if (req.method === 'POST') {
      const report = req.body;
      // Validación básica de datos
      if (!report || !report.project_id || !report.user_id) {
        return res.status(400).json({ error: 'Datos del reporte incompletos' });
      }
      const newReport = await prisma.report.create({ data: report });
      res.status(201).json(newReport);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.status(500).json({ error: 'Error del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
