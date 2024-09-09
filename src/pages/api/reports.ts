import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { AnnexData, DeliverableData, TechnicalSummary } from '../informes/reports/model/reports.props';

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
    } else if (req.method === 'POST' || req.method === 'PUT') {
      const report = req.body;

      if (!report || !report.summary) {
        return res.status(400).json({ error: 'Datos del reporte incompletos' });
      }

      const technicalSummary = Array.isArray(report.technicalSummary) ? report.technicalSummary : [];
      const deliverables = Array.isArray(report.deliverables) ? report.deliverables : [];
      const annexes = Array.isArray(report.annexes) ? report.annexes : [];

      //convercion fecha
      const convertDate = (dateString: string) => new Date(`${dateString}T00:00:00.000Z`);

      const formattedDeliverables = deliverables.map((deliverable: DeliverableData) => ({
        ...deliverable,
        date: convertDate(deliverable.date) 
      }));

      if (report.id) {
        const updatedReport = await prisma.report.update({
          where: { id: report.id },
          data: {
            project_id: report.project_id,
            user_id: report.user_id,
            status: report.status,
            summary: report.summary,
            technicalSummary: {
              upsert: technicalSummary.map((technical: TechnicalSummary) => ({
                where: { id: technical.id || 0 },
                create: {
                  obtained_result: technical.obtained_result,
                  product_description: technical.product_description,
                  support_annex: technical.support_annex,
                  observations: technical.observations,
                },
                update: {
                  obtained_result: technical.obtained_result,
                  product_description: technical.product_description,
                  support_annex: technical.support_annex,
                  observations: technical.observations,
                },
              })),
            },
            deliverables: {
              upsert: formattedDeliverables.map((deliverable: DeliverableData) => ({
                where: { id: deliverable.id || -1 },
                create: {
                  description: deliverable.description,
                  date: deliverable.date,
                  approved_changes: deliverable.approved_changes,
                  contingency_plan: deliverable.contingency_plan,
                },
                update: {
                  description: deliverable.description,
                  date: deliverable.date,
                  approved_changes: deliverable.approved_changes,
                  contingency_plan: deliverable.contingency_plan,
                },
              })),
            },
            annexes: {
              upsert: annexes.map((annex: AnnexData) => ({
                where: { id: annex.id || -1 },
                create: {
                  description: annex.description,
                  url: annex.url,
                },
                update: {
                  description: annex.description,
                  url: annex.url,
                },
              })),
            },
          },
        });
        res.status(200).json(updatedReport);
      } else {
        const newReport = await prisma.report.create({
          data: {
            project_id: report.project_id || null,
            user_id: report.user_id || null,
            status: report.status || null,
            summary: report.summary,
            technicalSummary: {
              create: technicalSummary.map((technical: TechnicalSummary) => ({
                obtained_result: technical.obtained_result,
                product_description: technical.product_description,
                support_annex: technical.support_annex,
                observations: technical.observations,
              }))
            },
            deliverables: {
              create: formattedDeliverables.map((deliverable: DeliverableData) => ({
                description: deliverable.description,
                date: deliverable.date,
                approved_changes: deliverable.approved_changes,
                contingency_plan: deliverable.contingency_plan,
              })),
            },
            annexes: {
              create: annexes.map((annex: AnnexData) => ({
                description: annex.description,
                url: annex.url,
              })),
            },
          },
        });
        res.status(201).json(newReport);
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
    
      if (!id) {
        return res.status(400).json({ error: 'ID del reporte no proporcionado' });
      }
    
      try {
        console.log('Eliminando reporte con ID:', id); // Agregar este log para verificar el ID
        const deletedReport = await prisma.report.delete({
          where: { id: Number(id) },
        });
    
        console.log('Reporte eliminado:', deletedReport); // Log para confirmar que el reporte fue eliminado
        res.status(200).json({ message: 'Informe eliminado con éxito' });
      } catch (error) {
        console.error('Error al eliminar el informe:', (error as Error).message);
        res.status(500).json({ error: 'Error del servidor', details: (error as Error).message });
      }
    }    
  } finally {
    await prisma.$disconnect();
  }
}
