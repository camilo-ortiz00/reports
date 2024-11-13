import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { emailOrId, newPassword } = req.body;

  if (!emailOrId || !newPassword) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Verificar si emailOrId es un número y convertirlo a entero, de lo contrario, mantenerlo como email
  let whereCondition = {};
  if (isNaN(Number(emailOrId))) {
    whereCondition = { email: emailOrId }; // Buscar por email
  } else {
    whereCondition = { id: parseInt(emailOrId, 10) }; // Buscar por id
  }

  // Buscar al usuario con el email o documento de identificación
  const user = await prisma.user.findFirst({
    where: whereCondition,
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Generar un nuevo hash para la nueva contraseña
  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Actualizar la contraseña en la base de datos
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
}
