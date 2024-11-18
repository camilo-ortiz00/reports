import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AnnexData } from '@/model/reports.props';
import styles from '../report_list/report_list.module.css';

interface AnnexFormProps {
  selectedReport: { id: number } | null;
  handleCreateAnnex: (data: FormData) => void; // Cambiar a FormData
  handleClose: () => void;
  initialData?: AnnexData;
}

const AnnexForm: FC<AnnexFormProps> = ({
  handleCreateAnnex,
  initialData,
  handleClose,
  selectedReport,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AnnexData>({
    defaultValues: initialData || {
      description: '',
      file: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof AnnexData, initialData[key as keyof AnnexData] || '');
      });
    }
  }, [initialData, setValue]);

  const onSubmit = (data: AnnexData, event: React.FormEvent<HTMLFormElement>) => {
    const reportId = (initialData?.report_id || selectedReport?.id) ?? 0;
  
    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }
  
    const fileInput = (event.target as HTMLFormElement).elements.namedItem('file') as HTMLInputElement;
    const file = fileInput?.files?.[0];
  
    if (!file) {
      alert('Debe seleccionar un archivo');
      return;
    }
  
    const validFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png'
    ];
    if (!validFileTypes.includes(file.type)) {
      alert('El archivo debe ser un PDF, Word o PNG.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', data.description);
    formData.append('report_id', reportId.toString());
  
    console.log('FormData:', Array.from(formData.entries())); // Revisa el contenido de FormData
    handleCreateAnnex(formData); // Llama a handleCreateAnnex con formData directamente
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.containerAnnex}>

        <div className={styles.col}>
          <label htmlFor="description_annex" className="floatingInput font-bold">Descripción del anexo</label>
          <input
            id="description_annex"
            className={`${styles.formControl} input input-bordered input-md`}
            type="text"
            {...register('description')}
          />
          {errors.description && 
            <p className="form_error">{errors.description.message}</p>}
        </div>

        <div className={styles.col}>
          <label htmlFor="file" className="floatingInput font-bold">Archivo del anexo</label>
          <input
            id="file"
            className={`${styles.formControl} file-input file-input-bordered input-md`}
            type="file"
            accept=".pdf, .doc, .docx, .png"
          />
          {errors.file && 
            <p className="form_error">{errors.file.message}</p>}
        </div>

      </div>
      <div className={styles.actions}>
        <button type="submit" className="action-button btn btn-info">
          {initialData ? 'Editar Anexo' : 'Crear Anexo'}
        </button>
        <button type="button" className="action-button btn btn-error" onClick={handleClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default AnnexForm;
