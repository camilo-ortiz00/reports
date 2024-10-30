import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DeliverableData } from '@/model/reports.props';
import styles from '../report_list/report_list.module.css';

interface DeliverableFormProps {
  selectedReport: { id: number } | null; 
  handleCreateDeliverable: (data: DeliverableData) => void;
  handleClose: () => void;
  initialData?: DeliverableData;
}

const DeliverableForm: FC<DeliverableFormProps> = ({
  handleCreateDeliverable,
  initialData,
  handleClose,
  selectedReport,
 }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DeliverableData>({
    defaultValues: initialData || {
      description: '',
      date: '',
      approved_changes: '',
      contingency_plan: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof DeliverableData, initialData[key as keyof DeliverableData] || '');
      });
    }
  }, [initialData, setValue]);

  const onSubmit = (data: DeliverableData) => {
    const reportId = (initialData?.report_id || selectedReport?.id) ?? 0; // Asegura un 'report_id' numérico

    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }
    handleCreateDeliverable({ ...data, report_id: reportId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.container}>
        <div className={styles.col}>
        <label htmlFor="description" className="floatingInput font-bold">Entregable</label>
            <input
              id="description"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('description', /*{ required: 'Descripción del entregable es requerida' }*/)}
            />
            {errors.description && <p className="form_error">{errors.description.message}</p>}
          </div>

          <div className={styles.col}>
            <label htmlFor="date" className="floatingInput font-bold">Fecha de ejecución</label>
            <input
              id="date"
              className={`${styles.formControl} input input-bordered input-md`}
              type="date"
              {...register('date', /*{ required: 'Fecha de ejecución es requerida' }*/)}
            />
            {errors.date && <p className="form_error">{errors.date.message}</p>}
          </div>

          <div className={styles.col}>
            <label htmlFor="approved_changes" className="floatingInput font-bold">Cambios aprobados por supervisor</label>
            <input
              id="approved_changes"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('approved_changes', /*{ required: 'Cambios aprobados es requerido' }*/)}
            />
            {errors.approved_changes && <p className="form_error">{errors.approved_changes.message}</p>}
          </div>

          <div className={styles.col}>
            <label htmlFor="contingency_plan" className="floatingInput font-bold">Plan de contingencia</label>
            <input
              id="contingency_plan"
              className={`${styles.formControl} input input-bordered input-md`}
              type="text"
              {...register('contingency_plan', /*{ required: 'Plan de contingencia es requerido' }*/)}
            />
            {errors.contingency_plan && <p className="form_error">{errors.contingency_plan.message}</p>}
          </div>

          <div className={styles.actions}>
            <button type="submit" className="action-button btn btn-info">
              {initialData ? 'Editar Entregable' : 'Crear Entregable'}
            </button>
            <button type="button" className="action-button mr-4 btn btn-error" onClick={handleClose}>Cancelar</button>
          </div>
        </div>
    </form>
  );
};

export default DeliverableForm;
