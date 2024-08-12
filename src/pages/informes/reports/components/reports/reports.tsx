import TechnicalSynopsisTable from './tables/TechnicalSynopsisTable';
import DeriverablesTable from "./tables/DeliverablesTable";
import AnnexTable from "./tables/AnnexTable";
import styles from "./reports.module.css";

const Reports = () => {
  return (
    <div className={styles.report_container}>
      <div className={styles.header}>
        <div className={styles.num_report}>
          <h2>Número del informe</h2>
        </div>
        <div className={styles.logo}></div>
      </div>
      <div className={styles.names}>
        <div className={styles.project_name}>
          <h1>Nombre del proyecto</h1>
        </div>
        <div className={styles.user_name}>
          <h1>Camilo Ortiz</h1>
        </div>
      </div>
      <div className={styles.middle}>
        <div className={styles.summary}>
          <h2>Resumen</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className={styles.porcent}>
          <h1>Porcentaje terminado</h1>
          <p>100%</p>
        </div>
      </div>
      <div className={styles.tables}>
        <div className={styles.table1}>
          <h1>Sipnosis Tecnica</h1>
          <TechnicalSynopsisTable />
        </div>
        <div className={styles.table2}>
          <h1>Entregables</h1>
          <DeriverablesTable />
        </div>
        <div className={styles.table3}>
          <h1>Anexos</h1>
          <AnnexTable />
        </div>
      </div>
    </div>
  );
};

export default Reports;
