import React, { FC, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormData, ReportFormProps } from '../../model/reports.props';
import styles from './report_list.module.css';

const ReportForm: FC<ReportFormProps> = ({ onSubmit, initialData, handleClose }) => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: initialData || {
      project_name: '',
      researcher_name: '',
      summary: '',
      technicalSummary: [{ obtained_result: '', product_description: '', observations: '', support_annex: '' }],
      deliverables: [{ description: '', date: '', approved_changes: '', contingency_plan: '' }],
      annexes: [{ description: '', url: '' }],
    },
  });

  const { fields: technicalSummaryFields, append: appendtechnicalSummary } = useFieldArray({
    control,
    name: "technicalSummary"
  });

  const { fields: deliverableFields, append: appendDeliverable } = useFieldArray({
    control,
    name: "deliverables"
  });

  const { fields: annexFields, append: appendAnnex } = useFieldArray({
    control,
    name: "annexes"
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof FormData, initialData[key as keyof FormData] || []);
      });
    }
  }, [initialData, setValue]);  

  const handleCreateReport = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleCreateReport)} className={styles.form}>
      <div className={styles.container}>
        <div className={styles.left}>
        {technicalSummaryFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`technicalSummary_${index}_support_annex`}>Soporte del anexo</label>
            <input
              id={`technicalSummary_${index}_support_annex`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`technicalSummary.${index}.support_annex` as const, { required: 'Resultado obtenido es requerido' })}
            />
            {errors.technicalSummary?.[index]?.support_annex && (
              <p className="form_error">{errors.technicalSummary[index].support_annex?.message}</p>
            )}
          </div>
        ))}

          {technicalSummaryFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`technicalSummary_${index}_obtained_result`}>Resultado obtenido</label>
            <input
              id={`technicalSummary_${index}_obtained_result`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`technicalSummary.${index}.obtained_result` as const, { required: 'Resultado obtenido es requerido' })}
            />
            {errors.technicalSummary?.[index]?.obtained_result && (
              <p className="form_error">{errors.technicalSummary[index].obtained_result?.message}</p>
            )}
          </div>
        ))}

          {technicalSummaryFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`technicalSummary_${index}_product_description`} className="floatingInput">Producto/Descripción</label>
            <input
              id={`technicalSummary_${index}_product_description`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`technicalSummary.${index}.product_description` as const, // { required: 'Descripción del producto es requerida'}
                )}
            />
            {errors.technicalSummary?.[index]?.product_description && 
            <p className="form_error">{errors.technicalSummary?.[index]?.product_description.message}</p>}
          </div>
          ))}
          
          {deliverableFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`deliverables_${index}_description`} className="floatingInput">Entregable</label>
            <input
              id={`deliverables_${index}_description`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`deliverables.${index}.description` as const, //{ required: 'Descripción del entregable es requerida' }
                )}
            />
            {errors.deliverables?.[index]?.description && 
            <p className="form_error">{errors.deliverables?.[index]?.description.message}</p>}
          </div>
          ))}

          {technicalSummaryFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`technicalSummary_${index}_observations`} className="floatingInput" style={{ display: 'block', marginBottom: '10px' }}>Observaciones</label>
            <textarea
              id={`technicalSummary_${index}_observations`}
              className="textarea textarea-bordered textarea-lg text-sm w-full"
              {...register(`technicalSummary.${index}.observations` as const, //{required: 'Resultado obtenido es requerido'}
              )}
            ></textarea>
          </div>
          ))}
        </div>

        <div className={styles.right}>

          {deliverableFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`deliverables_${index}_date`} className="floatingInput">Fecha de ejecución</label>
            <input
              id={`deliverables_${index}_date`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="date"
              {...register(`deliverables.${index}.date` as const, //{ required: 'Fecha de ejecución es requerida' }
                )}
            />
            {errors.deliverables?.[index]?.date && <p className="form_error">{errors.deliverables?.[index]?.date.message}</p>}
          </div>
          ))}

          {deliverableFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`deliverables_${index}_approved_changes`} className="floatingInput">Cambios aprobados por supervisor</label>
            <input
              id={`deliverables_${index}_approved_changes`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`deliverables.${index}.approved_changes` as const, //{ required: 'Fecha de ejecución es requerida' }
                )}
            />
            {errors.deliverables?.[index]?.approved_changes && <p className="form_error">{errors.deliverables?.[index]?.approved_changes.message}</p>}
          </div>
          ))}

          {deliverableFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`deliverables_${index}_contingency_plan`} className="floatingInput">Plan de contingencia</label>
            <input
              id={`deliverables_${index}_contingency_plan`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`deliverables.${index}.contingency_plan` as const, //{ required: 'Fecha de ejecución es requerida' }
                )}
            />
            {errors.deliverables?.[index]?.contingency_plan && <p className="form_error">{errors.deliverables?.[index]?.contingency_plan.message}</p>}
          </div>
          ))}

          {annexFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`annexes_${index}_description_annex`} className="floatingInput">Descripción del anexo</label>
            <input
              id={`annexes_${index}description_annex`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`annexes.${index}.description` as const,
              )}
            />
            {errors.annexes?.[index]?.description && 
            <p className="form_error">{errors.annexes?.[index]?.description.message}</p>}
          </div>
          ))}

          {annexFields.map((field, index) => (
          <div key={field.id} className="col-auto">
            <label htmlFor={`annexes_${index}_url`} className="floatingInput">URL del anexo</label>
            <input
              id={`annexes_${index}_url`}
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register(`annexes.${index}.url` as const,
              )}
            />
            {errors.annexes?.[index]?.url && 
            <p className="form_error">{errors.annexes?.[index]?.url.message}</p>}
          </div>
          ))}

          <div className="col-auto">
            <label htmlFor="summary" className="floatingInput" style={{ display: 'block', marginBottom: '10px' }}>Resumen</label>
            <textarea
              className="textarea textarea-bordered textarea-lg text-sm w-full"
              {...register("summary" //{ required: 'Resumen es requerido' }
                )}
            ></textarea>
            {errors.summary && <p className="form_error">{errors.summary.message}</p>}
          </div>

        </div>
      </div>
      <div className={styles.actions}>
        <button type="submit" className="action-button btn btn-info">
          {initialData ? 'Editar Informe' : 'Crear Informe'}
        </button>
        <button type="button" className="action-button btn btn-error" onClick={handleClose}>Cancelar</button>
      </div>
    </form>
  );
};

export default ReportForm;
