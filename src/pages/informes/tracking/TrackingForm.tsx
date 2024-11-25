import React, { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface TrackingFormProps {
  selectedReportId: number | null;
  onSubmit: (data: { report_id: number; note: string; tracking_id: number }) => void;
  handleClose: () => void;
  newNote: string;
  trackingId: number | null;
}

const TrackingForm: FC<TrackingFormProps> = ({
  selectedReportId,
  onSubmit,
  handleClose,
  newNote,
  trackingId,
}) => {
  const { control, handleSubmit } = useForm();

  const onFormSubmit = (data: { note: string }) => {
    // Enviar los datos al manejador de la función de guardado
    if (selectedReportId && trackingId !== null) {
      onSubmit({
        report_id: selectedReportId,
        note: data.note,
        tracking_id: trackingId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="report_id" className="block font-medium text-gray-700">
          ID Reporte: {selectedReportId}
        </label>
      </div>

      <div>
        <label htmlFor="note" className="block font-medium text-gray-700">
          Nota
        </label>
        <Controller
          name="note"
          control={control}
          defaultValue={newNote}
          render={({ field }) => (
            <textarea
              {...field}
              id="note"
              rows={4}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          )}
        />
      </div>

      {/* El ID del tracking no será visible pero se enviará en el formulario */}
      <input type="hidden" name="tracking_id" value={trackingId || ''} />

      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-error" onClick={handleClose}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-success">
          Guardar Nota
        </button>
      </div>
    </form>
  );
};

export default TrackingForm;
