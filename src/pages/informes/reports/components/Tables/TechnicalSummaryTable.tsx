import React from 'react';
import DataTable from 'react-data-table-component';
import { TechnicalSummaryData } from '../../../../../model/reports.props';

interface TechnicalFormProps {
  technical: TechnicalSummaryData[];
  onActivityRowSelected: (technical: TechnicalSummaryData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const TechnicalSummaryTable: React.FC<TechnicalFormProps> = ({
  technical,
  onActivityRowSelected,
  onRowDeselected,
  onSearch,
}) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: TechnicalSummaryData) => row.id || 'N/A',
      sortable: true,
      cell: (row: TechnicalSummaryData, index: number) => (
        <span>{index + 1}</span>
      ),
    },
    {
      name: 'Resultado obtenido',
      selector: (row: TechnicalSummaryData) => row.obtained_result || 'Sin resultado',
      sortable: true,
    },
    {
      name: 'Descripción/Producto',
      selector: (row: TechnicalSummaryData) => row.product_description || 'Sin descripción',
      sortable: true,
    },
    {
      name: 'Soporte Anexo',
      selector: (row: TechnicalSummaryData) => row.support_annex || 'Sin Soporte',
      sortable: true,
    },
    {
      name: 'Observaciones',
      selector: (row: TechnicalSummaryData) => row.observations || 'Sin observación',
      sortable: true,
    },
  ];

  const handleRowSelected = (state: any) => {
    if (state.selectedRows.length > 0) {
      onActivityRowSelected(state.selectedRows[0]);
    } else {
      onRowDeselected();
    }
  };

  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={technical}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        subHeader
        subHeaderComponent={ <input 
          type="text" 
          placeholder="Buscar actividades..." 
          className="input input-bordered w-full max-w-xs" 
          onChange={(e) => onSearch(e.target.value)} /> } 
        customStyles={{ 
          rows: { 
            style: { backgroundColor: 'var(--table-bg)', 
            color: 'var(--table-text-color)', 
              },
           }, 
          headCells: { 
            style: { backgroundColor: 'var(--header-bg)', 
              color: 'var(--header-text-color)', 
                }, 
            }, 
          }} /> 
    </div> 
  );
};

export default TechnicalSummaryTable;
