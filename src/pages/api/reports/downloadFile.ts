import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { annexId, deliverableId } = req.query;

  if (!annexId && !deliverableId) {
    return res.status(400).json({ error: 'Falta el ID del anexo o entregable' });
  }

  try {
    let fileData: any = null;

    // Si es un ID de anexo
    if (annexId) {
      fileData = await prisma.annex.findUnique({
        where: { id: Number(annexId) },
      });

      if (!fileData || !fileData.file) {
        return res.status(404).json({ error: 'Archivo del anexo no encontrado' });
      }
    }

    // Si es un ID de entregable
    if (deliverableId) {
      fileData = await prisma.deliverable.findUnique({
        where: { id: Number(deliverableId) },
      });

      if (!fileData || !fileData.support_annex) {
        return res.status(404).json({ error: 'Archivo del entregable no encontrado' });
      }
    }

    const fileType = fileData.file_type || 'application/octet-stream';
    const fileName = fileData.file_name || fileData.support_name || 'archivo';

    res.setHeader('Content-Type', fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileData.file || fileData.support_annex);

  } catch (error) {
    console.error('Error al procesar la solicitud de descarga', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
