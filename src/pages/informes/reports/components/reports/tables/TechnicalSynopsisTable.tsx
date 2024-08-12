'use client'
import React from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from './synopsis.module.css';

interface Data {
  numeroActividad: string;
  resultado: string;
  producto: string;
  anexo: string; 
  observaciones: string;
}

const data: Data[] = [
  {
    numeroActividad: '1',
    resultado: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    producto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    anexo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    observaciones: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const columns: Column<Data>[] = [
  {
    Header: 'N° Actividad',
    accessor: 'numeroActividad' as const,
  },
  {
    Header: 'RESULTADO OBTENIDO',
    accessor: 'resultado' as const,
  },
  {
    Header: 'PRODUCTO/DESCRIPCIÓN',
    accessor: 'producto' as const,
  },
  {
    Header: 'ANEXO SOPORTE DEL DESARROLLO Y OBTENCIÓN DE RESULTADOS',
    accessor: 'anexo' as const,
  },
  {
    Header: 'OBSERVACIONES',
    accessor: 'observaciones' as const,
  },
];

const TechnicalSynopsisTable: React.FC = () => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Data>({ columns, data });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup<Data>) => (
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
        {rows.map((row: Row<Data>) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
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
