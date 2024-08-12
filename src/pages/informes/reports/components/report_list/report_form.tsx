import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormData, ReportFormProps } from '../../model/reports.props';
import styles from './report_list.module.css';

const ReportForm: FC<ReportFormProps> = ({ onSubmit, initialData, handleClose }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: initialData || {
      project_name: '',
      researcher_name: '',
      summary: [],
      obtained_result: '',
      product_description: '',
      observations: '',
      annexes: [],
      description_annex: '',
      url: '',
      deliverable: [],
      description_deliverable: '',
      date: '',
      support_annex: '',
      approved_changes: '',
      contingency_plan: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof FormData, initialData[key as keyof FormData]);
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
          <div className="col-auto">
            <label htmlFor="project_name" className="floatingInput">Nombre del proyecto</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("project_name" //, { required: 'Nombre del proyecto es requerido' }
                )}
            />
            {errors.project_name && <p className="form_error">{errors.project_name.message}</p>}
          </div>
          <div className="col-auto">
            <label htmlFor="researcher_name" className="floatingInput">Nombre del investigador</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("researcher_name" //{ required: 'Nombre del investigador es requerido' }

              )}
            />
            {errors.researcher_name && <p className="form_error">{errors.researcher_name.message}</p>}
          </div>
          <div className="col-auto">
            <label htmlFor="obtained_result" className="floatingInput">Resultado obtenido</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("obtained_result" //{ required: 'Resultado obtenido es requerido' }
                )}
            />
            {errors.obtained_result && <p className="form_error">{errors.obtained_result.message}</p>}
          </div>
          <div className="col-auto">
            <label htmlFor="product_description" className="floatingInput">Producto/Descripción</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("product_description" // { required: 'Descripción del producto es requerida' }
                )}
            />
            {errors.product_description && <p className="form_error">{errors.product_description.message}</p>}
          </div>
          <div className="col-auto">
            <label htmlFor="description_deliverable" className="floatingInput">Entregable</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("description_deliverable" //{ required: 'Descripción del entregable es requerida' }
                )}
            />
            {errors.description_deliverable && <p className="form_error">{errors.description_deliverable.message}</p>}
          </div>
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
        <div className={styles.right}>
          <div className="col-auto">
            <label htmlFor="date" className="floatingInput">Fecha de ejecución</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="date"
              {...register("date" //{ required: 'Fecha de ejecución es requerida' }
                )}
            />
            {errors.date && <p className="form_error">{errors.date.message}</p>}
          </div>
          <div className="col-auto">
            <label htmlFor="approved_changes" className="floatingInput">Cambios aprobados por supervisor</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("approved_changes")}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="contingency_plan" className="floatingInput">Plan de contingencia</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("contingency_plan")}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="description_annex" className="floatingInput">Descripción del anexo</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("description_annex")}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="url" className="floatingInput">URL del anexo</label>
            <input
              className="form-control input input-bordered input-sm w-full max-w-xs"
              type="text"
              {...register("url")}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="observations" className="floatingInput" style={{ display: 'block', marginBottom: '10px' }}>Observaciones</label>
            <textarea
              className="textarea textarea-bordered textarea-lg text-sm w-full"
              {...register("observations")}
            ></textarea>
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
