import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import prisma from '../../../../lib/prisma';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: true }); // Ajustado para usar la nueva forma de instanciar IncomingForm
  const userId = req.query.userId as string;
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'Falta el ID del usuario o es inválido' });
  }
  if (req.method === 'PUT') {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'Falta el ID del usuario' });

    const imagePath = path.join(process.cwd(), 'public/uploads/profile_picture');

    // Verifica si la carpeta existe, si no, créala
    if (!fs.existsSync(imagePath)) fs.mkdirSync(imagePath, { recursive: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error al procesar el formulario' });
      }

      // Verificar si el archivo es un array o undefined
      const file = files.profile_picture ? 
        (Array.isArray(files.profile_picture) ? files.profile_picture[0] : files.profile_picture) : 
        undefined;

      // Asegúrate de que se haya subido un archivo
      if (!file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
      }

      const saveTo = path.join(imagePath, file.originalFilename!); // Utiliza el operador de aserción de no nulo
      fs.rename(file.filepath, saveTo, async (renameErr) => {
        if (renameErr) {
          return res.status(500).json({ error: 'Error al guardar la imagen' });
        }

        const profilePictureUrl = `/uploads/profile_picture/${path.basename(saveTo)}`;

        // Actualiza el perfil del usuario en la base de datos
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { profile_picture: profilePictureUrl },
        });

        res.status(200).json({ message: 'Imagen subida y guardada exitosamente', profilePictureUrl });
      });
    });
  } else if (req.method === 'GET') {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: 'Falta el ID del usuario' });

    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { profile_picture: true },
      });
      if (user) {
        res.status(200).json({ profilePicture: user.profile_picture });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la imagen del perfil' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
};

export default handler;
