'use client'
import React from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from './annex.module.css';

interface Data {
  numero: string;
  descripcion: string;
  url: string;
}

const data: Data[] = [
  {
    numero: '1',
    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    url: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const columns: Column<Data>[] = [
  {
    Header: 'N°',
    accessor: 'numero' as const,
  },
  {
    Header: 'DESCRIPCIÓN',
    accessor: 'descripcion' as const,
  },
  {
    Header: 'URL',
    accessor: 'url' as const,
  },
];

const AnnexTable: React.FC = () => {
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

export default AnnexTable;
