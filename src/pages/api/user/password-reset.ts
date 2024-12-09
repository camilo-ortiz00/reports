{/*import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { sendEmail } from '../../../../lib/email'; // Función para enviar correos
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Correo electrónico requerido' });
  }

  // Buscar al usuario por correo electrónico
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Generar un token único
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // Token válido por 1 hora

  // Guardar el token en la base de datos
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expires,
    },
  });

  // Crear el enlace de restablecimiento de contraseña
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  // Enviar el correo con el enlace
  try {
    await sendEmail({
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.name},</p>
        <p>Haz solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p>Este enlace es válido por 1 hora.</p>
      `,
    });

    return res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
}
*/}