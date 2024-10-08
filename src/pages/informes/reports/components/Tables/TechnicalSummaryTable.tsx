import React from 'react';
import DataTable from 'react-data-table-component';
import { TechnicalSummaryData } from '../../model/reports.props';

interface TechnicalFormProps {
  technical: TechnicalSummaryData[]; 
  onActivityRowSelected: (technical: TechnicalSummaryData) => void;
  onRowDeselected: () => void;
  onSearch: (query: string) => void;
}

const TechnicalSummaryTable: React.FC<TechnicalFormProps> = ({ technical, onActivityRowSelected, onRowDeselected, onSearch  }) => {
  const columns = [
    {
      name: 'N°',
      selector: (row: TechnicalSummaryData) => row?.id || 'N/A',
      sortable: true,
    },
    {
      name: 'Resultado obtenido',
      selector: (row: TechnicalSummaryData) => row?.obtained_result || 'Sin resultado',
      sortable: true,
    },
    {
      name: 'Descripción/Producto',
      selector: (row: TechnicalSummaryData) => row?.product_description || 'Sin descripción',
      sortable: true,
    },
    {
      name: 'Soporte Anexo',
      selector: (row: TechnicalSummaryData) => row?.support_annex || 'Sin Soporte',
      sortable: true,
    },
    {
      name: 'Observaciones',
      selector: (row: TechnicalSummaryData) => row?.observations || 'Sin observación',
      sortable: true,
    },
  ];

  const handleActivityRowSelected = async (technical: TechnicalSummaryData) => {
    onActivityRowSelected(technical);
        
    await fetch('/api/technicals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(technical),
      });
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={technical}
        pagination
        highlightOnHover
        striped
        responsive
        selectableRows
        onSelectedRowsChange={({ selectedRows }) => {
          if (selectedRows.length > 0) {
            handleActivityRowSelected(selectedRows[0]);
          } else {
            onRowDeselected();
          }
        }}
        subHeader
        subHeaderComponent={
          <div></div>
          /* <input
             type="text"
             placeholder="Buscar"
             className="w-full p-2 border border-gray-300 rounded"
             onChange={(e) => onSearch(e.target.value)}
           />*/
        }
      />
    </div>
  );
};

export default TechnicalSummaryTable;

