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
    },
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = React.useState<string>('');

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof AnnexData, initialData[key as keyof AnnexData] || '');
      });
    }
  }, [initialData, setValue]);

  const validateFileType = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
    return allowedTypes.includes(file.type);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
  
      if (!validateFileType(file)) {
        return;
      }
  
      setSelectedFile(file); // Guardar archivo seleccionado
      setSelectedFileName(file.name); // Guardar nombre del archivo
    }
  };
  
  const onSubmit = (data: AnnexData) => {
    const reportId = initialData?.report_id || selectedReport?.id || 0;
    if (!reportId) {
      console.error('No se pudo obtener el report_id.');
      return;
    }

    if (!selectedFile) {
      alert('Debe seleccionar un archivo');
      return;
    }

    const formData = new FormData();
    if (initialData?.id) {
      formData.append('id', initialData.id.toString()); // Incluye el ID si existe
    }
    formData.append('file', selectedFile);
    formData.append('description', data.description);
    formData.append('report_id', reportId.toString());

    handleCreateAnnex(formData);
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
            name="file"
            type="file"
            accept=".pdf, .doc, .docx, .png"
            onChange={handleFileChange}
            className={`${styles.formControl} file-input file-input-bordered input-md`}
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
