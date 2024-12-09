import React, { useMemo } from 'react';
import { useTable, Column, HeaderGroup, Row } from 'react-table';
import styles from '../reports.module.css';

interface DeliverablesTableData {
  id?: number;
  report_id: number;
  description: string;
  date: string;
  support_name: string;
  approved_changes: string;
  contingency_plan: string;
  percent_month: number;
  percent_cumulative: number;
}

interface DeliverablesTableProps {
  deliverables: DeliverablesTableData[];
}


const DeliverableTable: React.FC<DeliverablesTableProps> = ({ deliverables }) => {
  const columns: Column<DeliverablesTableData>[] = useMemo(() => [
  {  Header: 'N°', accessor: 'id'},
  {Header: 'ENTREGABLE', accessor: 'description'},
  {Header: 'ANEXO DEL ENTREGABLE', accessor: 'support_name',},
  {Header: 'FECHA DE EJECUCIÓN', accessor: 'date'},
  {Header: 'CAMBIOS APROVADOS POR SUPERVISOR',accessor: 'approved_changes'},
  {Header: 'PLAN DE CONTIGENCIA', accessor: 'contingency_plan'},
  {Header: '% AVANCE MES', accessor: 'percent_month'},
  {Header: '% AVANCE ACUMULADO', accessor: 'percent_cumulative'},
], []);

const data = useMemo(() => deliverables, [deliverables]);

const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<DeliverablesTableData>({ columns, data });

  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup<DeliverablesTableData>) => (
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
        {rows.map((row: Row<DeliverablesTableData>) => {
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

export default DeliverableTable;
