import React, { useMemo } from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from '../reports.module.css';

interface TechnicalSynopsisData {
  id?: number;
  report_id: number;
  name_technical: string;
  obtained_result: string;
  product_description: string;
  support_annex_id: string;
  observations: string;
}

interface TechnicalSynopsisTableProps {
  technical: TechnicalSynopsisData[];
}

const TechnicalSynopsisTable: React.FC<TechnicalSynopsisTableProps> = ({ technical }) => {
  const columns: Column<TechnicalSynopsisData>[] = useMemo(() => [
    { Header: 'N° Actividad', accessor: 'id' },
    { Header: 'NOMBRE DE LA ACTIVIDAD', accessor: 'name_technical' },
    { Header: 'RESULTADO OBTENIDO', accessor: 'obtained_result' },
    { Header: 'PRODUCTO/DESCRIPCIÓN', accessor: 'product_description' },
    { Header: 'ANEXO SOPORTE DEL DESARROLLO Y OBTENCIÓN DE RESULTADOS: ACTIVIDAD', accessor: 'support_annex_id' },
    { Header: 'OBSERVACIONES', accessor: 'observations' },
  ], []);

  const data = useMemo(() => technical, [technical]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<TechnicalSynopsisData>({ columns, data });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup<TechnicalSynopsisData>) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} className={styles.th} key={column.id}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: Row<TechnicalSynopsisData>) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.original.id || row.index}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} className={styles.td} key={cell.column.id}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TechnicalSynopsisTable;
