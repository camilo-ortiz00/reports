import React, { useState } from 'react';

export const ProfilePictureForm: React.FC<{ userId: number }> = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch(`/api/user/prueba?userId=${userId}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      alert('Imagen subida con éxito.');
    } else {
      alert('Hubo un error al subir la imagen.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Subir Imagen</button>
    </form>
  );
};

export default ProfilePictureForm; // Asegúrate de que esta línea esté presente
