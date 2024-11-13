import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TechnicalSummaryData } from '@/model/reports.props';
import styles from '../report_list/report_list.module.css';

interface TechnicalFormProps {
  selectedReport: { id: number } | null; 
  handleCreateTechnicalSummary: (data: TechnicalSummaryData) => void;
  handleClose: () => void;
  initialData?: TechnicalSummaryData;
  annexes: { id: number; description: string }[]; // Cambié 'url' a 'description'
}

const TechnicalForm: FC<TechnicalFormProps> = ({
  handleCreateTechnicalSummary,
  initialData,
  handleClose,
  selectedReport,
  annexes, // Asegúrate de desestructurar 'annexes' aquí
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TechnicalSummaryData>({
    defaultValues: initialData || {
      name_technical: '',
      obtained_result: '', 
      product_description: '', 
      observations: '',
      support_annex_id: ''
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof TechnicalSummaryData, initialData[key as keyof TechnicalSummaryData] || '');
      });
    }
  }, [initialData, setValue]);
  
  const onSubmit = (data: TechnicalSummaryData) => {
    const reportId = (initialData?.report_id || selectedReport?.id) ?? 0; 

    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }
    console.log('Datos a enviar:', { ...data, report_id: reportId });

    handleCreateTechnicalSummary({ ...data, report_id: reportId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.container}>
        <div className={styles.col}>
          <label htmlFor="name_technical" className='font-bold'>Nombre de la actividad</label>
          <input
            id="name_technical"
            className={`${styles.formControl} input input-bordered input-md`}
            type="text"
            {...register('name_technical')}
          />
          {errors.name_technical && (
            <p className="form_error">{errors.name_technical.message}</p>
          )}
        </div>

        <div className={styles.col}>
          <label htmlFor="obtained_result" className='font-bold'>Resultado obtenido</label>
          <input
            id="obtained_result"
            className={`${styles.formControl} input input-bordered input-md`}
            type="text"
            {...register('obtained_result')}
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
          <label htmlFor="support_annex_id" className='font-bold'>Anexo de la Sinopsis</label>
          <select
            id="support_annex_id"
            className={`${styles.formControl} input input-bordered input-md`}
            {...register('support_annex_id')}
          >
            <option value="">Selecciona un anexo</option>
            {annexes.map((annex) => (
              <option key={annex.id} value={annex.id}>
                {annex.description}
              </option>
            ))}
          </select>
          {errors.support_annex_id && (
            <p className="form_error">{errors.support_annex_id.message}</p>
          )}
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
