import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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

  const uploadDir = path.join(process.cwd(), 'public/uploads/profile_pictures');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024, // 2 MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing files' });
    }

    let profile_picture: string | undefined;
    const profilePictureFile = files.profile_picture as formidable.File | undefined;

    if (profilePictureFile && typeof profilePictureFile === 'object') {
      profile_picture = `/uploads/profile_pictures/${profilePictureFile.newFilename}`;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: fields.name ? String(fields.name) : '',
          email: fields.email ? String(fields.email) : '',
          date: fields.date ? String(fields.date) : '',
          phone: fields.phone ? String(fields.phone) : '',
          password: fields.password ? await bcrypt.hash(String(fields.password), 10) : undefined,
          role_id: Number(fields.role_id),
          address: fields.address ? String(fields.address) : '',
          work_lines: fields.work_lines ? String(fields.work_lines) : '',
          contact_person_name: fields.contact_person_name ? String(fields.contact_person_name) : '',
          contact_person_phone: fields.contact_person_phone ? String(fields.contact_person_phone) : '',
          contact_person_email: fields.contact_person_email ? String(fields.contact_person_email) : '',
          blood_type: fields.blood_type ? String(fields.blood_type) : '',
          identity_document: fields.identity_document ? String(fields.identity_document) : '',
          marital_status: fields.marital_status ? String(fields.marital_status) : '',
          profile_picture: profile_picture || undefined,
          cv_file: fields.cv_file ? String(fields.cv_file) : '',
          academic_support_files: fields.academic_support_files ? String(fields.academic_support_files) : '',
          id_file: fields.id_file ? String(fields.id_file) : '',
          profile_status: Number(fields.profile_status),
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating user' });
    }
  });
}
