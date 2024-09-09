import React, { FC, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FormData } from '../../model/reports.props';
import AlertComponent from '@/components/Alert';

interface ReportListTableProps {
  reports: FormData[];
  onRowSelected: (report: FormData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const ReportListTable: FC<ReportListTableProps> = ({ reports, onRowSelected, onRowDeselected, onSearch }) => {

  const columns: TableColumn<FormData>[] = [
    {
      name: 'Resultado obtenido',
      selector: (row: FormData) => row.technicalSummary?.[0]?.obtained_result || 'N/A',
      sortable: true,
    },
    {
      name: 'Descripción/Producto',
      selector: (row: FormData) => row.technicalSummary?.[0]?.product_description || 'N/A',
      sortable: true,
    },
    {
      name: 'Resumen',
      selector: (row: FormData) => row.summary || 'N/A',
      sortable: true,
    },
    {
      name: 'Fecha de ejecución',
      selector: (row: FormData) => row.deliverables?.[0]?.date || 'N/A',
      sortable: true,
    },
    {
      name: 'Cambios aprobados por supervisor',
      selector: (row: FormData) => row.deliverables?.[0]?.approved_changes || 'N/A',
      sortable: true,
    },
    {
      name: 'Plan de contingencia',
      selector: (row: FormData) => row.deliverables?.[0]?.contingency_plan || 'N/A',
      sortable: true,
    },
    {
      name: 'Descripción del anexo',
      selector: (row: FormData) => row.annexes?.[0]?.description || 'N/A',
      sortable: true,
    },
    {
      name: 'URL del anexo',
      selector: (row: FormData) => row.annexes?.[0]?.url || 'N/A',
      sortable: true,
    },
  ];

  const handleRowSelected = async (report: FormData) => {
    onRowSelected(report);
        
    await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
  };
  

  return (
    <div>
      <DataTable
        columns={columns}
        data={reports}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={({ selectedRows }) => {
          if (selectedRows.length > 0) {
            handleRowSelected(selectedRows[0]);
          } else {
            onRowDeselected();
          }
        }}
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => onSearch(e.target.value)}
          />
        }
      />
    </div>
  );
};

export default ReportListTable;
