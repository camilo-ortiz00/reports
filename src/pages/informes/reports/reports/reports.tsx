import TechnicalSynopsisTable from './tables/TechnicalSynopsisTable';
import DeliverablesTable from "./tables/DeliverablesTable";
import AnnexTable from "./tables/AnnexTable";
import styles from "./reports.module.css";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Importa useSession de NextAuth
import { AnnexData, DeliverableData, TechnicalSummaryData, ReportData } from '@/model/reports.props';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Reports = () => {
  const { data: session } = useSession(); // Obtén la sesión actual
  const router = useRouter();
  const { report } = router.query;

  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [technicalSummary, setTechnicalSummary] = useState<TechnicalSummaryData[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableData[]>([]);
  const [annexes, setAnnexes] = useState<AnnexData[]>([]);

  const fetchData = async () => {
    const fetchPromises = [
      fetch('/api/reports/reports'),
      fetch('/api/reports/technical-summary'),
      fetch('/api/reports/deliverables'),
      fetch('/api/reports/annexes'),
    ];
  
    try {
      const responses = await Promise.all(fetchPromises);
      const data = await Promise.all(responses.map(res => {
        if (!res.ok) throw new Error('Error en la respuesta');
        return res.json();
      }));
  
      setTechnicalSummary(data[1]);
      setDeliverables(data[2]);
      setAnnexes(data[3]);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    if (report) {
      const newReport = JSON.parse(report as string);
      if (!selectedReport || selectedReport.id !== newReport.id) {
        setSelectedReport(newReport);
      }
    }
  }, [report, selectedReport]);

  useEffect(() => {
    if (selectedReport) {
      fetchData();
    }
  }, [selectedReport]);

  // Filtra datos según el informe seleccionado
  const filteredTechnical = selectedReport ? 
    technicalSummary.filter(tech => tech.report_id === selectedReport.id) : [];
  const filteredDeliverable = selectedReport ? 
    deliverables.filter(del => del.report_id === selectedReport.id) : [];
  const filteredAnnex = selectedReport ? 
    annexes.filter(ann => ann.report_id === selectedReport.id) : [];

  // Exporta el informe a PDF
  const exportToPDF = async () => {
    const element = document.getElementById('reportContainer');
    if (!element || !selectedReport) {
      console.error('No se encontró el elemento o informe seleccionado');
      return;
    }

    element.style.margin = '0';
    element.style.padding = '0';

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 1,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: -window.scrollY,
        ignoreElements: (el) => el.classList.contains('no-print'),
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Informe ${selectedReport.id}.pdf`);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
    } finally {
      element.style.margin = '';
      element.style.padding = '';
    }
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={exportToPDF}               
        className="btn btn-accent ml-4"
      >Exportar PDF
      </button>
      <div className={styles.report_container} id="reportContainer">
        <div className={styles.header}>
          <div className={styles.num_report}>
            <h2>Número del informe: {selectedReport ? selectedReport.id : 'Sin informe seleccionado'}</h2>
          </div>
          <div className={styles.logo}></div>
        </div>
        <div className={styles.names}>
          <div className={styles.project_name}>
            <h1>Proyecto: {selectedReport ? selectedReport.project?.name : 'Sin informe seleccionado'}</h1>
          </div>
          <div className={styles.user_name}>
            <h1>{selectedReport && session?.user?.name === selectedReport.user?.name ? session.user.name : 'Sin informe seleccionado'}</h1>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.summary}>
            <h2>Resumen</h2>
            <p>{selectedReport ? selectedReport.summary : 'Sin resumen disponible'}</p>
          </div>
          <div className={styles.porcent}>
            <h1>Porcentaje terminado</h1>
            <p>{selectedReport ? `${selectedReport.status}%` : 'Sin información'}</p>
          </div>
        </div>
        <div className={styles.tables}>
          <div className={styles.table1}>
            <h1>Sipnosis Técnica</h1>
            <TechnicalSynopsisTable technical={filteredTechnical} />
          </div> 
          <div className={styles.table2}>
            <h1>Entregables</h1>
            <DeliverablesTable deliverables={filteredDeliverable} />
          </div> 
          <div className={styles.table3}>
            <h1>Anexos</h1>
            <AnnexTable annexes={filteredAnnex} />
          </div> 
        </div>
      </div>
    </div>
  );
};

export default Reports;
