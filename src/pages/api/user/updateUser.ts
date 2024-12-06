import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import fs from 'fs';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getUser(req, res);
    case 'PUT':
      return await updateUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: 'Error retrieving user' });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const userId = Number(id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing files' });
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

    const profilePictureDetails = getFileDetails(files.profile_picture?.[0]);
    const cvFileDetails = getFileDetails(files.cv_file?.[0]);
    const academicSupportFileDetails = getFileDetails(files.academic_support_files?.[0]);
    const idFileDetails = getFileDetails(files.id_file?.[0]);

    try {
      const profileStatus = Array.isArray(fields.profile_status) ? fields.profile_status[0] : fields.profile_status;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: fields.name ? String(fields.name) : undefined,
          email: fields.email ? String(fields.email) : undefined,
          phone: fields.phone ? String(fields.phone) : undefined,
          date: fields.date ? String(fields.date) : undefined,
          password: fields.password ? await bcrypt.hash(String(fields.password), 10) : undefined,
          role_id: Number(fields.role_id),
          address: fields.address ? String(fields.address) : undefined,
          work_lines: fields.work_lines ? String(fields.work_lines) : undefined,
          contact_person_name: fields.contact_person_name ? String(fields.contact_person_name) : undefined,
          contact_person_phone: fields.contact_person_phone ? String(fields.contact_person_phone) : undefined,
          contact_person_email: fields.contact_person_email ? String(fields.contact_person_email) : undefined,
          profile_picture: profilePictureDetails ? profilePictureDetails.fileBuffer : undefined,
          profile_picture_name: profilePictureDetails?.originalName,
          profile_picture_type: profilePictureDetails?.mimeType,
          cv_file: cvFileDetails ? cvFileDetails.fileBuffer : undefined,
          cv_file_name: cvFileDetails?.originalName,
          cv_file_type: cvFileDetails?.mimeType,
          academic_support_files: academicSupportFileDetails ? academicSupportFileDetails.fileBuffer : undefined,
          academic_support_name: academicSupportFileDetails?.originalName,
          academic_support_type: academicSupportFileDetails?.mimeType,
          id_file: idFileDetails ? idFileDetails.fileBuffer : undefined,
          id_file_name: idFileDetails?.originalName,
          id_file_type: idFileDetails?.mimeType,
          profile_status: profileStatus ? parseFloat(profileStatus) : null,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Error updating user' });
    }
  });
}
