import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Obtener el ID de la URL

  if (req.method === 'DELETE') {
    try {
      // Eliminar el anexo con el ID proporcionado
      const deletedAnnex = await prisma.annex.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: 'Anexo eliminado con éxito', deletedAnnex });
    } catch (error) {
      console.error('Error al eliminar el anexo:', error);
      res.status(500).json({ message: 'Error al eliminar el anexo' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  }
}
