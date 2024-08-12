import React, { FC } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FormData } from '../../model/reports.props';

interface ReportListTableProps {
  reports: FormData[];
  onRowSelected: (report: FormData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const ReportListTable: FC<ReportListTableProps> = ({ reports, onRowSelected, onRowDeselected, onSearch }) => {
  const columns: TableColumn<FormData>[] = [
  //{
  //  name: 'Nombre del proyecto',
  //  selector: (row: FormData) => row.project_name,
  //  sortable: true,
  //},
  //{
  //  name: 'Nombre del investigador',
  //  selector: (row: FormData) => row.researcher_name,
  //  sortable: true,
  //},
  {
    name: 'Resultado obtenido',
    selector: (row: FormData) => row.obtained_result,
    sortable: true,
  },
  {
    name: 'Descripción/Producto',
    selector: (row: FormData) => row.product_description,
    sortable: true,
  },
  {
    name: 'Resumen',
    selector: (row: FormData) => row.summary,
    sortable: true,
  },
  {
    name: 'Fecha de ejecución',
    selector: (row: FormData) => row.date,
    sortable: true,
  },
  {
    name: 'Cambios aprobados por supervisor',
    selector: (row: FormData) => row.approved_changes,
    sortable: true,
  },
  {
    name: 'Plan de contingencia',
    selector: (row: FormData) => row.contingency_plan,
    sortable: true,
  },
  {
    name: 'Descripción del anexo',
    selector: (row: FormData) => row.description_annex,
    sortable: true,
  },
  {
    name: 'URL del anexo',
    selector: (row: FormData) => row.url,
    sortable: true,
  },
];

  return (
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
          onRowSelected(selectedRows[0]);
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
          onChange={(e) => onSearch(e.target.value)
          }
        />
      }
    />
  );
};

export default ReportListTable;