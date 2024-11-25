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

// Crear reporte
async function createReport(req: NextApiRequest, res: NextApiResponse) {
  const { summary, project_id, user_id, technicalSummary, deliverables, annexes } = req.body;

  if (!project_id || !user_id) {
    return res.status(400).json({ error: 'Los campos project_id y user_id son obligatorios' });
  }

  try {
    // Crear el nuevo informe
    const newReport = await prisma.report.create({
      data: {
        summary,
        project_id,
        user_id,
        status: 0,
      },
    });

    // Calcular el estado
    const calculatedStatus = await calculateStatus(newReport.id);

    // Actualizar el informe con el estado calculado
    const updatedReport = await prisma.report.update({
      where: { id: newReport.id },
      data: { status: calculatedStatus },
    });

    // Crear un seguimiento inicial asociado al nuevo informe
    const initialTracking = await prisma.reportTracking.create({
      data: {
        report_id: newReport.id,
        note: 'Seguimiento inicial del informe creado.',
      },
    });

    // Devolver el informe creado junto con el seguimiento inicial
    return res.status(201).json({
      report: updatedReport,
      tracking: initialTracking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el informe' });
  }
}



// Actualizar un reporte existente, con opción de solo actualizar la fecha de modificación
async function updateReport(req: NextApiRequest, res: NextApiResponse) {
  const { id, summary, technicalSummary, deliverables, annexes } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID es obligatorio' });
  }

  try {

    const updatedReport = await prisma.report.update({
      where: { id: Number(id) },
      data: { summary, updated_at: new Date() },
    });

    const calculatedStatus = await calculateStatus(updatedReport.id);
    const finalReport = await prisma.report.update({
      where: { id: updatedReport.id },
      data: { status: calculatedStatus },
    });
    return res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el informe' });
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

    export async function calculateStatus(report_id: number): Promise<number> {
      const totalWeight = 100;
      let status = 0;
    
      // Obtén los datos más recientes del informe
      const report = await prisma.report.findUnique({
        where: { id: report_id },
        include: {
          technicalSummary: true,
          deliverables: true,
          annexes: true,
        },
      });
    
      if (!report) {
        throw new Error(`El informe con ID ${report_id} no existe`);
      }
    
      // Resumen
      const summaryWeight = 20;
      if (report.summary) {
        status += summaryWeight;
      }
    
      // Resumen técnico
      const technicalWeight = 30;
      if (report.technicalSummary?.length) {
        const filledFields = report.technicalSummary.filter(
          (tech) => tech.obtained_result && tech.product_description
        ).length;
        status += (filledFields / report.technicalSummary.length) * technicalWeight;
      }
    
      // Entregables
      const deliverablesWeight = 30;
      if (report.deliverables?.length) {
        const filledDeliverables = report.deliverables.filter(
          (deliv) => deliv.description && deliv.date
        ).length;
        status += (filledDeliverables / report.deliverables.length) * deliverablesWeight;
      }
    
      // Anexos
      const annexesWeight = 20;
      if (report.annexes?.length) {
        const filledAnnexes = report.annexes.filter((annex) => annex.description && annex.file).length;
        status += (filledAnnexes / report.annexes.length) * annexesWeight;
      }
    
      return Math.min(status, totalWeight); // Limitar a 100%
    }
    