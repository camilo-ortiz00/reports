import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AnnexData } from '../../model/reports.props';
import styles from '../report_list/report_list.module.css';

interface AnnexFormProps {
  selectedReport: { id: number } | null; 
  handleCreateAnnex: (data: AnnexData) => void;
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
        url: '' 
      },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof AnnexData, initialData[key as keyof AnnexData] || '');
      });
    }
  }, [initialData, setValue]);  

  const onSubmit = (data: AnnexData) => {
    const reportId = (initialData?.report_id || selectedReport?.id) ?? 0; // Asegura un 'report_id' numérico

    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }
    handleCreateAnnex({ ...data, report_id: reportId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.container}>

          <div className="col-auto">
            <label htmlFor="description_annex" className="floatingInput">Descripción del anexo</label>
            <input
              id="description_annex"
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register('description' as const,
              )}
            />
            {errors.description && 
            <p className="form_error">{errors.description.message}</p>}
          </div>

          <div className="col-auto">
            <label htmlFor="url" className="floatingInput">URL del anexo</label>
            <input
              id="url"
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register('url' as const,
              )}
            />
            {errors.url && 
            <p className="form_error">{errors.url.message}</p>}
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