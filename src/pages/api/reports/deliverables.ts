import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getDeliverables(req, res);
    case 'POST':
      return createDeliverable(req, res);
    case 'PUT':
      return updateDeliverable(req, res);
    case 'DELETE':
      return deleteDeliverable(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Obtener todos los entregables o por ID
async function getDeliverables(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (id) {
      const deliverable = await prisma.deliverable.findUnique({
      where: { id: Number(id) },
    });
    if (!deliverable) return res.status(404).json({ message: 'Entregable no encontrado' });
    return res.status(200).json(deliverable);
  }

  const deliverables = await prisma.deliverable.findMany();
    return res.status(200).json(deliverables);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener entregables' });
  }
}

//Crear
async function createDeliverable(req: NextApiRequest, res: NextApiResponse) {
  const { report_id, description, date, approved_changes, contingency_plan } = req.body;

  if (!report_id || !description || !date || !approved_changes || !contingency_plan) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const newDeliverable = await prisma.deliverable.create({
      data: {
        report_id: Number(report_id),
        description,
        date,
        approved_changes,
        contingency_plan,
      },
    });
    return res.status(201).json(newDeliverable);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear el entregable' });
  }
}

//Actualizar 
async function updateDeliverable(req: NextApiRequest, res: NextApiResponse) {
  const { id, report_id, description, date, approved_changes, contingency_plan } = req.body;
  
  if (!id || !report_id) {
    return res.status(400).json({ error: 'El campo ID es obligatorio' });
  }
  try{
    const updatedDeliverable = await prisma.deliverable.update({
      where: { id: Number(id) },
      data: {
        report_id: Number(id),
        description,
        date,
        approved_changes,
        contingency_plan,
      },
    });
    return res.status(200).json(updatedDeliverable);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el entregable' });
  }
}

//Eliminar
async function deleteDeliverable(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'El campo ID es obligatorio' });
  }

  try{
    await prisma.deliverable.delete({
      where: { id: Number(id) },
    });
    return res.status(200).json({ message: 'Entregable eliminado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar el entregable' });
  }
}

