import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
  fileFilter: (req, file, cb) => {
    const validFileTypes = /pdf|doc|docx|png/;
    const extname = validFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = validFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: El archivo debe ser un PDF, Word o PNG.'));
  },
});

// Extiende la interfaz de NextApiRequest para incluir el archivo
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

// Función auxiliar para utilizar `multer` en Next.js
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  try {
    await runMiddleware(req, res, upload.single('file'));
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
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

// Obtener todos los anexos o por ID
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
async function createAnnex(req: NextApiRequestWithFile, res: NextApiResponse) {
  const { report_id, description } = req.body;

  if (!description || !req.file || !report_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const fileBuffer = fs.readFileSync(req.file.path);

    const newAnnex = await prisma.annex.create({
      data: { description, file: fileBuffer, report_id: Number(report_id) },
    });

    return res.status(201).json(newAnnex);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el anexo' });
  }
}

// Actualizar un anexo existente
async function updateAnnex(req: NextApiRequestWithFile, res: NextApiResponse) {
  const { id, description } = req.body;

  if (!id || !description) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const data: any = { description };
    if (req.file) {
      data.file = fs.readFileSync(req.file.path);
    }

    const updatedAnnex = await prisma.annex.update({
      where: { id: Number(id) },
      data,
    });
    return res.status(200).json(updatedAnnex);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el anexo' });
  }
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
