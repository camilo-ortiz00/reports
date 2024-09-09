import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getReportById = async (id: number) => {
  return await prisma.report.findUnique({
    where: { id },
    include: {
      user: true,
      project: true,
      trackings: true,
      technicalSummary: true,
      deliverables: true,
      annexes: true,
    },
  });
};

export const getAllReports = async () => {
  return await prisma.report.findMany({
    include: {
      user: true,
      project: true,
      trackings: true,
      technicalSummary: true,
      deliverables: true,
      annexes: true,
    },
  });
};

export const createReport = async (data: any) => {
  return await prisma.report.create({
    data,
  });
};

export const updateReport = async (id: number, data: any) => {
  return await prisma.report.update({
    where: { id },
    data,
  });
};

export const deleteReport = async (id: number) => {
  return await prisma.report.delete({
    where: { id },
  });
};
