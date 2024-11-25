import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { calculateStatus } from './reports';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Importante para manejar archivos con formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getAnnexes(req, res);
    case 'POST':
      return createAnnex(req, res);
    case 'PUT':
      return updateAnnex(req, res);
    case 'DELETE':
      return deleteAnnex(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener los anexos
async function getAnnexes(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const annex = await prisma.annex.findUnique({
        where: { id: Number(id) },
      });
      if (!annex) return res.status(404).json({ message: 'Anexo no encontrado' });
      return res.status(200).json(annex);
    }

    const annexes = await prisma.annex.findMany();
    return res.status(200).json(annexes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener anexos' });
  }
}

// Crear un nuevo anexo
export async function createAnnex(req: NextApiRequest, res: NextApiResponse) {

  const form = formidable({
     keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 }); // 5 MB

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing files:', err);
      return res.status(500).json({ error: 'Error al procesar los archivos' });
    }
    console.log('Campos recibidos:', fields);
    console.log('Archivos recibidos:', files);
    const { description, report_id } = fields;
    if (!description || !report_id || !files.file) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
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

    const fileDetails = getFileDetails(files.file?.[0]);

    try {

      const newAnnex = await prisma.annex.create({
        data: {
          description: fields.description ? String(fields.description) : undefined,
          report_id: Number(fields.report_id),
          file: fileDetails ? fileDetails.fileBuffer: undefined,
          file_name: fileDetails.originalName,
          file_type: fileDetails.mimeType,
        },
      });
      const newStatus = await calculateStatus(Number(report_id));
    await prisma.report.update({
      where: { id: Number(report_id) },
      data: { status: newStatus },
    });
      res.status(201).json(newAnnex);
    } catch (dbError) {
      console.error('Error al guardar el anexo:', dbError);
      res.status(500).json({ error: 'Error al guardar el anexo' });
    }
  });
}

// Actualizar un anexo existente
async function updateAnnex(req: NextApiRequest, res: NextApiResponse) {

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing files:', err);
      return res.status(500).json({ error: 'Error al procesar los archivos' });
    }
    console.log('Campos recibidos:', fields);
    console.log('Archivos recibidos:', files);
    const { id, description, report_id } = fields;
    if (!id || !description || !report_id || !files.file) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
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

    const fileDetails = getFileDetails(files.file?.[0]);

    const updatedDeriverable = await prisma.annex.update({
      where: { id: Number(id) },
      data: {
        description: fields.description ? String(fields.description) : undefined,
        report_id: Number(fields.report_id),
        file: fileDetails ? fileDetails.fileBuffer: undefined,
        file_name: fileDetails.originalName,
        file_type: fileDetails.mimeType,
      },
    });
    const newStatus = await calculateStatus(Number(report_id));
    await prisma.report.update({
      where: { id: Number(report_id) },
      data: { status: newStatus },
    });
    return res.status(200).json(updatedDeriverable);
  });
}


// Eliminar un anexo
async function deleteAnnex(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID del anexo requerido' });
  }

  try {
    await prisma.annex.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Anexo eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el anexo' });
  }
}
