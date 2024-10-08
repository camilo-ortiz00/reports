import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const annexes = await prisma.annex.findMany();
      res.status(200).json(annexes);
    } else if (req.method === 'POST') {
      const { report_id, description, url } = req.body;

      if (!report_id || !description) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
      }

      const newAnnex = await prisma.annex.create({
        data: {
          report_id: Number(report_id),
          description,
          url: url || '', 
        },
      });

      res.status(201).json(newAnnex);
    } 
    else if (req.method === 'PUT') {
      const { id, report_id, description, url } = req.body;

      if (!id || !report_id ) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
      }

      const updatedannexes = await prisma.annex.update({
        where: { id: Number(id) },
        data: {
          report_id: Number(report_id),
          description,
          url: url || '', 
        },
      });

      res.status(200).json(updatedannexes);
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error en el manejo de deliverables:', (error as Error).message);
    res.status(500).json({ error: 'Error del servidor', details: (error as Error).message });
  } finally {
    await prisma.$disconnect();
  }
}