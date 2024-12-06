import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"
;
const prisma = new PrismaClient();


// Configuración para manejar el formulario
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

// Asegura que el directorio existe, creándolo si no
const ensureUploadDirExists = (relativePath) => {
  const fullPath = path.join(uploadDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

const handler = async (req, res) => {
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error al subir el archivo' });
      return;
    }

    const filePaths = [];
    const { parentId } = fields;

    // Si parentId está presente, buscamos o creamos la carpeta
    const parentDir = parentId ? ensureUploadDirExists(parentId) : ensureUploadDirExists('');

    for (const key in files) {
      const uploadedFiles = files[key];
      
      // Maneja el caso de múltiples archivos
      if (Array.isArray(uploadedFiles)) {
        uploadedFiles.forEach((file) => {
          const filePath = path.join(parentDir, file.originalFilename);

          // Crear la carpeta si no existe
          fs.mkdirSync(path.dirname(filePath), { recursive: true });

          // Mueve el archivo a la carpeta correcta
          fs.renameSync(file.filepath, filePath);

          // Almacena la ruta del archivo subido
          filePaths.push(filePath);
        });
      } else {
        // Si es un solo archivo
        const file = uploadedFiles as formidable.File;
        const filePath = path.join(parentDir, file.originalFilename as string);

        // Crear la carpeta si no existe
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        // Mueve el archivo a la carpeta correcta
        fs.renameSync(file.filepath, filePath);

        // Almacena la ruta del archivo subido
        filePaths.push(filePath);
      }
    }

    res.status(200).json({ message: 'Archivos subidos exitosamente', filePaths });
  });
};

export default handler;
