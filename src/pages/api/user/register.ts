import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name, role_id, identity_document } = req.body;

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword, // Almacenar la contraseña hasheada
          name,
          role_id,
          identity_document,
        },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(400).json({ error: 'Error en el registro' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
