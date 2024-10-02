import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const deliverables = await prisma.deliverable.findMany();
      res.status(200).json(deliverables);
    } else if (req.method === 'POST') {
      const { report_id, description, date, approved_changes, contingency_plan } = req.body;

      if (!report_id || !description || !date || !approved_changes || !contingency_plan) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const newDeliverable = await prisma.deliverable.create({
        data: {
          report_id,
          description,
          date,
          approved_changes,
          contingency_plan,
        },
      });

      res.status(201).json(newDeliverable);
    } else if (req.method === 'PUT') {
      const { id, report_id, description, date, approved_changes, contingency_plan } = req.body;

      if (!id || !report_id) {
        return res.status(400).json({ error: 'El campo ID es obligatorio' });
      }

      const updatedDeliverable = await prisma.deliverable.update({
        where: { id: Number(id) },
        data: {
          report_id: Number(id),
          description,
          date,
          approved_changes,
          contingency_plan,
        },
      });

      res.status(200).json(updatedDeliverable);
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'El campo ID es obligatorio' });
      }

      await prisma.deliverable.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: 'Deliverable eliminado con éxito' });
    } else {
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
