import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const technicalSummaries = await prisma.technicalSummary.findMany();
      res.status(200).json(technicalSummaries);
    } else if (req.method === 'POST') {
      const { report_id, obtained_result, product_description, support_annex, observations } = req.body;

      if (!report_id || !obtained_result || !product_description) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
      }

      const newTechnicalSummary = await prisma.technicalSummary.create({
        data: {
          report_id: Number(report_id),
          obtained_result,
          product_description,
          support_annex: support_annex || '', 
          observations: observations || '', 
        },
      });

      res.status(201).json(newTechnicalSummary);
    } 
    else if (req.method === 'PUT') {
      const { id, report_id, obtained_result, product_description, support_annex, observations } = req.body;

      if (!id || !report_id || !obtained_result || !product_description) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
      }

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

      res.status(200).json(updatedTechnicalSummary);
    } 
    else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID es obligatorio para eliminar' });
      }

      await prisma.technicalSummary.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } finally {
    await prisma.$disconnect();
  }
}
