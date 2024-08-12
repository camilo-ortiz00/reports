'use client'
import React from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from './deliverables.module.css';

interface Data {
  numero: string;
  entregable: string;
  fecha: string;
  cambios_aprovados: string;
  plan_contingencia: string
}

const data: Data[] = [
  {
    numero: '1',
    entregable: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    fecha: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cambios_aprovados: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    plan_contingencia: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

const columns: Column<Data>[] = [
  {
    Header: 'N°',
    accessor: 'numero' as const,
  },
  {
    Header: 'ENTREGABLE',
    accessor: 'entregable' as const,
  },
  {
    Header: 'FECHA DE EJECUCIÓN',
    accessor: 'fecha' as const,
  },
  {
    Header: 'CAMBIOS APROVADOS POR SUPERVISOR',
    accessor: 'cambios_aprovados' as const,
  },
  {
    Header: 'PLAN DE CONTIGENCIA',
    accessor: 'plan_contingencia' as const,
  },
];

const DeriverablesTable: React.FC = () => {
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

export default DeriverablesTable;
