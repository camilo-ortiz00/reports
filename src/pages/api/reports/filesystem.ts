import fs from 'fs';
import path from 'path';
import formidable, { File } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import { getSession } from "next-auth/react";


export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        if (req.query.download) {
          return download(req, res); // Llama a la función de descarga
        }
        return get(req, res); // Función existente para listar archivos
      case 'POST':
        return create(req, res);
      case 'PUT':
        return rename(req, res);
      case 'DELETE':
        return deletes(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Asegurarse de que el directorio exista
  function ensureUploadDirExists(directory: string) {
    const normalizedPath = path.resolve(uploadDir, directory); // Asegura que sea relativa a `uploadDir`
    if (!fs.existsSync(normalizedPath)) {
      fs.mkdirSync(normalizedPath, { recursive: true });
    }
    return normalizedPath;
  }

  const get = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const filesAndFolders = getFilesAndFolders(uploadDir);
      res.status(200).json(filesAndFolders);
    } catch (error) {
      res.status(500).json({ error: 'Error al leer el sistema de archivos.' });
    }
  };
      const getFilesAndFolders = (dirPath: string, basePath: string = dirPath) => {
      let result: any[] = [];
      const items = fs.readdirSync(dirPath);
    
      items.forEach((item) => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);
    
        const relativePath = path.relative(basePath, fullPath); // Ruta relativa a `basePath`
        const parentPath = path.relative(basePath, path.dirname(fullPath)); // Ruta relativa del padre
    
        const node = {
          id: relativePath, // Ruta relativa
          name: item,
          type: stats.isDirectory() ? 'folder' : 'file',
          parentId: parentPath === '' ? null : parentPath,
        };
    
        result.push(node);
    
        if (stats.isDirectory()) {
          result = result.concat(getFilesAndFolders(fullPath, basePath)); // Recursión para subcarpetas
        }
      });
    
      return result;
    };

  const create = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: true,
      maxFileSize: 4 * 1024 * 1024 * 1024, 
    });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el formulario:', err);
        return res.status(500).json({ error: 'Error processing the form' });
      }
  
      const { name, type, parentId } = fields;
  
      // Validar entradas
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }
  
      // Obtener el usuario de la sesión actual
      const session = await getSession({ req });
      if (!session?.user?.id) {
        return res.status(403).json({ error: 'User is not authenticated' });
      }
  
      const createdBy = session.user.id;
  
      const folderName = Array.isArray(name) ? name[0] : name;
      const nodeType = Array.isArray(type) ? type[0] : type;
      const relativeParentDir = Array.isArray(parentId) ? parentId[0] : parentId;
  
      // Si parentId es nulo o vacío, se usa el directorio raíz
      const parentDir = relativeParentDir ? ensureUploadDirExists(relativeParentDir) : ensureUploadDirExists('');
      const newPath = path.join(parentDir, folderName);
  
      if (nodeType === 'folder') {
        // Crear carpeta
        fs.mkdirSync(newPath, { recursive: true });
  
        return res.status(200).json({ message: 'Carpeta creada exitosamente', path: newPath });
      } else if (nodeType === 'file') {
        // Manejar archivo
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
  
        if (!uploadedFile || !uploadedFile.filepath) {
          return res.status(400).json({ error: 'No file provided or invalid file' });
        }
  
        const originalName = uploadedFile.originalFilename || uploadedFile.newFilename;
        const newFilePath = path.join(parentDir, originalName);
  
        fs.rename(uploadedFile.filepath, newFilePath, async (renameErr) => {
          if (renameErr) {
            console.error('Error al renombrar el archivo:', renameErr);
            return res.status(500).json({ error: 'Error renaming the file' });
          }
  
          res.status(200).json({
            message: 'File uploaded successfully',
            file: {
              name: originalName,
              path: newFilePath,
              size: uploadedFile.size,
              type: uploadedFile.mimetype,
            },
          });
        });
      } else {
        return res.status(400).json({ error: 'Invalid type. Expected "folder" or "file"' });
      }
    });
  };
  
const parseBody = (req: IncomingMessage): Promise<{ id: string; newName: string }> =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });

const rename = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    res.setHeader('Allow', ['PATCH', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const body = await parseBody(req);
    const { id, newName } = body;

    if (!id || !newName) {
      return res.status(400).json({ error: 'id and newName are required' });
    }

    const nodePath = path.resolve(uploadDir, id);

    if (!fs.existsSync(nodePath)) {
      return res.status(404).json({ error: 'File or folder not found' });
    }

    const newFilePath = path.resolve(path.dirname(nodePath), newName);

    fs.rename(nodePath, newFilePath, (err) => {
      if (err) {
        console.error('Error al renombrar el archivo:', err);
        return res.status(500).json({ error: 'Error renaming the file or folder' });
      }

      res.status(200).json({
        message: 'File or folder renamed successfully',
        newPath: newFilePath,
      });
    });
  } catch (error) {
    console.error('Error processing rename request:', error);
    res.status(500).json({ error: 'Error processing rename request' });
  }
};

const deletes = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id } = await parseBody(req);

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const nodePath = path.resolve(uploadDir, id);

    if (!fs.existsSync(nodePath)) {
      return res.status(404).json({ error: 'File or folder not found' });
    }

    // Eliminar carpeta o archivo de manera recursiva
    fs.rm(nodePath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error('Error al eliminar el nodo:', err);
        return res.status(500).json({ error: 'Error deleting the file or folder' });
      }

      res.status(200).json({ message: 'File or folder deleted successfully' });
    });
  } catch (error) {
    console.error('Error processing delete request:', error);
    res.status(500).json({ error: 'Error processing delete request' });
  }
};


const download = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'File id is required' });
    }

    const filePath = path.resolve(uploadDir, id as string);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
};
