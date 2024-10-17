import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, name, email, password, role_id } = req.body;

    try {
      // Validación básica
      if (!email || !password || !name || !role_id) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      // Verificar si el correo ya está registrado
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Este correo ya está registrado' });
      }

      // Crear un nuevo usuario
      const newUser = await prisma.user.create({
        data: {
          id: parseInt(id, 10),
          name,
          email,
          password, // Asegúrate de que la contraseña esté hasheada si es necesario
          role_id,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
