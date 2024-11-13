import React, { useMemo } from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from '../reports.module.css';

interface AnnexTableData {
  id?: number;
  report_id: number;
  description: string;
  file: string;
}

interface AnnexTableProps {
  annexes: AnnexTableData[];
}

const AnnexTable: React.FC<AnnexTableProps> = ({ annexes }) => {
  const columns: Column<AnnexTableData>[] = useMemo(() => [
    { Header: 'N° Actividad', accessor: 'id' },
    {Header: 'DESCRIPCIÓN', accessor: 'description'},
    {Header: 'URL', accessor: 'file'},
  ], []);

  const data = useMemo(() => annexes, [annexes]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<AnnexTableData>({ columns, data });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup<AnnexTableData>) => (
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
        {rows.map((row: Row<AnnexTableData>) => {
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

export default AnnexTable;
