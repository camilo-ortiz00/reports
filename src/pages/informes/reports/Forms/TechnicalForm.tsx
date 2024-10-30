import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TechnicalSummaryData } from '@/model/reports.props';
import styles from '../report_list/report_list.module.css';

interface TechnicalFormProps {
  selectedReport: { id: number } | null; 
  handleCreateTechnicalSummary: (data: TechnicalSummaryData) => void;
  handleClose: () => void;
  initialData?: TechnicalSummaryData;
}

const TechnicalForm: FC<TechnicalFormProps> = ({
  handleCreateTechnicalSummary,
  initialData,
  handleClose,
  selectedReport,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TechnicalSummaryData>({
    defaultValues: initialData || {
      obtained_result: '', 
      product_description: '', 
      observations: '',
      support_annex: ''
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof TechnicalSummaryData, initialData[key as keyof TechnicalSummaryData] || '');
      });
    }
  }, [initialData, setValue]);
  console.log('initialData:', initialData);

  const onSubmit = (data: TechnicalSummaryData) => {
    const reportId = (initialData?.report_id || selectedReport?.id) ?? 0; 

    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }
    handleCreateTechnicalSummary({ ...data, report_id: reportId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.container}>
        <div className={styles.col}>
        <label htmlFor="support_annex" className='font-bold'>Soporte del anexo</label>
            <input
              id="support_annex"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('support_annex', /*{ required: 'Soporte del anexo es requerido' }*/)}
            />
            {errors.support_annex && (
              <p className="form_error">{errors.support_annex.message}</p>
            )}
          </div>

          <div className={styles.col}>
            <label htmlFor="obtained_result" className='font-bold'>Resultado obtenido</label>
            <input
              id="obtained_result"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('obtained_result', /*{ required: 'Resultado obtenido es requerido' }*/)}
            />
            {errors.obtained_result && (
              <p className="form_error">{errors.obtained_result.message}</p>
            )}
          </div>

          <div className={styles.col}>
            <label htmlFor="product_description" className="floatingInput font-bold">Producto/Descripción</label>
            <input
              id="product_description"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('product_description')}
            />
            {errors.product_description && 
            <p className="form_error">{errors.product_description.message}</p>}
          </div>

          <div className={styles.col}>
            <label htmlFor="observations" className="floatingInput font-bold" style={{ display: 'block', marginBottom: '10px' }}>Observaciones</label>
            <textarea
              id="observations"
              className="textarea textarea-bordered textarea-lg text-sm w-full"
              {...register('observations')}
            ></textarea>
          </div>
      </div>
      <div className={styles.actions}>
      <button type="submit" className="action-button btn btn-info">
        {!initialData || !initialData.report_id ? 'Crear Actividad' : 'Editar Actividad'}
      </button>
        <button type="button" className="action-button btn btn-error" onClick={handleClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default TechnicalForm;
