import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileType, userId } = req.query;

  if (!fileType || !userId) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let fileBuffer: Buffer | null = null;
    let fileName = '';

    switch (fileType) {
      case 'cv_file':
        //fileBuffer = user.cv_file;
        fileName = user.cv_file_name || 'Hoja_de_vida';
        break;
      case 'id_file':
        //fileBuffer = user.id_file;
        fileName = user.id_file_name || 'Documento_identidad';
        break;
      case 'academic_support_files':
        //fileBuffer = user.academic_support_files;
        fileName = user.academic_support_name || 'Soporte_academico';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de archivo no válido' });
    }

    if (!fileBuffer) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.setHeader('Content-Type', getMimeType(fileName));
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);

  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  } finally {
    await prisma.$disconnect(); // Ensures that Prisma disconnects after the request
  }
};

export default handler;

// Helper para determinar el tipo MIME según la extensión
const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream'; // Default MIME type for unknown file types
  }
};
