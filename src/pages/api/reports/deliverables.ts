import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { calculateStatus } from './reports';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar archivos con formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getDeliverables(req, res);
    case 'POST':
      return createDeliverable(req, res);
    case 'PUT':
      return updateDeliverable(req, res);
    case 'DELETE':
      return deleteDeliverable(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los entregables o por ID
async function getDeliverables(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const deliverable = await prisma.deliverable.findUnique({
        where: { id: Number(id) },
      });
      if (!deliverable) return res.status(404).json({ message: 'Entregable no encontrado' });
      return res.status(200).json(deliverable);
    }

    const deliverables = await prisma.deliverable.findMany();
    return res.status(200).json(deliverables);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener entregables' });
  }
}

// Crear un nuevo entregable
async function createDeliverable(req: NextApiRequest, res: NextApiResponse) {
  
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing files:', err);
      return res.status(500).json({ error: 'Error al procesar los archivos' });
    }
    console.log('Campos recibidos:', fields);
    console.log('Archivos recibidos:', files);
    const { report_id, description, date, approved_changes, contingency_plan } = fields;

    if (!report_id || !description || !date || !files?.file) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const getFileDetails = (file: formidable.File | undefined) => {
      if (file) {
        return {
          fileBuffer: fs.readFileSync(file.filepath), // Leer el archivo en formato binario
          originalName: file.originalFilename || '',
          mimeType: file.mimetype,
        };
      }
      return null;
    };

    const supportDetails = getFileDetails(Array.isArray(files.file) ? files.file[0] : files.file);
 
    try {

      const newDeliverable = await prisma.deliverable.create({
        data: {
          report_id: Number(fields.report_id),
          description: fields.description ? String(fields.description) : undefined,
          date: fields.date ? String(fields.date) : undefined,
          approved_changes: fields.approved_changes ? String(fields.approved_changes) : undefined,
          contingency_plan: fields.contingency_plan ? String(fields.contingency_plan) : undefined,
          percent_month: fields.percent_month ? Number(fields.percent_month) : undefined,
          percent_cumulative: fields.percent_cumulative ? Number(fields.percent_cumulative) : undefined,
          support_annex: supportDetails ? supportDetails.fileBuffer : undefined,
          support_name: supportDetails?.originalName,
          support_type: supportDetails?.mimeType,
        },
      });
      const newStatus = await calculateStatus(Number(report_id));
      await prisma.report.update({
        where: { id: Number(report_id) },
        data: { status: newStatus },
      });
      return res.status(201).json(newDeliverable);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear el entregable' });
    }
  });
}

// Actualizar un entregable existente
async function updateDeliverable(req: NextApiRequest, res: NextApiResponse) {

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // Limitar el tamaño a 10 MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing files:', err);
      return res.status(500).json({ error: 'Error al procesar los archivos' });
    }
    const { id, report_id, description, date, approved_changes, contingency_plan } = fields;

    if (!id || !report_id) {
      return res.status(400).json({ error: 'El campo ID es obligatorio' });
    }

    const getFileDetails = (file: formidable.File | undefined) => {
      if (file) {
        return {
          fileBuffer: fs.readFileSync(file.filepath), // Leer el archivo en formato binario
          originalName: file.originalFilename || '',
          mimeType: file.mimetype,
        };
      }
      return null;
    };

    const supportDetails = getFileDetails(files.file?.[0]);

    const updatedDeliverable = await prisma.deliverable.update({
      where: { id: Number(id) },
      data: {
        report_id: Number(fields.report_id),
          description: fields.description ? String(fields.description) : undefined,
          date: fields.date ? String(fields.date) : undefined,
          approved_changes: fields.approved_changes ? String(fields.approved_changes) : undefined,
          contingency_plan: fields.contingency_plan ? String(fields.contingency_plan) : undefined,
          percent_month: fields.percent_month ? Number(fields.percent_month) : undefined,
          percent_cumulative: fields.percent_cumulative ? Number(fields.percent_cumulative) : undefined,
          support_annex: supportDetails ? supportDetails.fileBuffer : undefined,
          support_name: supportDetails?.originalName,
          support_type: supportDetails?.mimeType,
      },
    });
    const newStatus = await calculateStatus(Number(report_id));
    await prisma.report.update({
      where: { id: Number(report_id) },
      data: { status: newStatus },
    });
    return res.status(200).json(updatedDeliverable);
  });
}

// Eliminar un entregable
async function deleteDeliverable(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'El campo ID es obligatorio' });
  }

  try {
    await prisma.deliverable.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Entregable eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el entregable' });
  }
}
