import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RenameForm from "./renameform";
import JSZip from "jszip";
import path from 'path';

import { faFolderPlus, faFileCirclePlus, faFolderOpen, faEllipsisVertical, faTurnUp } from "@fortawesome/free-solid-svg-icons";
import FolderNameForm from "./foldernameform";

interface UploadedFile {
  path: string; // Ruta relativa del archivo dentro de la carpeta
  file: File;   // Archivo real
}

const FileManager = () => {
  const [fileSystem, setFileSystem] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentContents, setCurrentContents] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [folderName, setFolderName] = useState<string>("");
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    console.log('Se ha actualizado currentFolder:', currentFolder);

    const fetchFileSystem = async () => {
      try {
        const response = await fetch('/api/reports/filesystem', { method: 'GET' });
  
        if (response.ok) {
          const data = await response.json();
          setFileSystem(data);
          console.log('Datos del sistema de archivos: ', data);
  
          // Navegación entre carpetas
          if (currentFolder === null) {
            setCurrentContents(data.filter((node: any) => node.parentId === null));
          } else {
            setCurrentContents(data.filter((node: any) => node.parentId === currentFolder));
          }
        } else {
          console.error('Error al obtener el sistema de archivos:', response.statusText);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
      }
    };
  
    fetchFileSystem();
  }, [currentFolder]); 
  
const handleCreateFolder = async (folderName: string) => {
    const folderNameOnly = currentFolder ? path.basename(currentFolder) : '';
    console.log('Valor de currentFolder:', currentFolder);
    console.log('Valor de folderNameOnly:', folderNameOnly);
    
    const folderPath = currentFolder 
      ? `public/uploads/${folderName}` 
      : 'public/uploads';  
    
    console.log('folderPath:', folderPath);
    
    const response = await fetch('/api/reports/filesystem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: folderName,
        type: 'folder',
        parentId: currentFolder || null,
        folderPath: folderPath,
      }),
    });
  
    if (response.ok) {
      const newFolder = await response.json();
      console.log('Carpeta creada con éxito:', newFolder);  // Verifica que la carpeta se ha creado correctamente
    
      const fetchUpdatedFileSystem = async () => {
        const response = await fetch('/api/reports/filesystem');
        if (response.ok) {
          const data = await response.json();
          console.log('Datos del sistema de archivos después de la creación de la carpeta:', data);  // Verifica los datos que se reciben
    
          setFileSystem(data);
    
          // También actualizamos currentContents
          if (currentFolder === null) {
            const rootContents = data.filter((node) => node.parentId === null);
            console.log('Contenido de la raíz:', rootContents);  // Verifica si la carpeta aparece en los contenidos
            setCurrentContents(rootContents);
          } else {
            const folderContents = data.filter((node) => node.parentId === currentFolder);
            console.log('Contenido de la carpeta:', folderContents);  // Verifica si la carpeta aparece en los contenidos
            setCurrentContents(folderContents);
          }
                
        }
      };
    
      fetchUpdatedFileSystem();
    } else {
      console.error('Error al crear la carpeta');
  }}
    
  const handleCreateFolderClick = () => {
    setShowCreateFolderModal(true);  // Mostrar el modal
  };

  const handleCreateFolderSubmit = (newName: string) => {
    handleCreateFolder(newName);  // Llamar a la función de creación de carpeta
    setShowCreateFolderModal(false);  // Cerrar el modal
  };
  
const handleFolderUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;

  if (files) {
    const fileArray: UploadedFile[] = [];
    const virtualFileSystem: any[] = [];
    const folderMap = new Map();

    Array.from(files).forEach((file) => {
      const path = (file as any).webkitRelativePath;
      fileArray.push({ path, file });

      const parts = path.split("/");
      let currentParentId = null;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;

        if (!folderMap.has(part)) {
          const id = `${currentParentId || "root"}-${part}`; // Generar un ID único para cada carpeta
          const newNode = {
            id,
            name: part,
            type: isFile ? "file" : "folder",
            parentId: currentParentId, // Asignar el ID del padre correctamente
            content: isFile ? file : null,
          };
          virtualFileSystem.push(newNode);
          folderMap.set(part, id);
        }

        currentParentId = folderMap.get(part); // Actualizar el parentId al ID del folder actual
      });
    });

    // Enviar los archivos con la estructura de carpetas generada
    const formData = new FormData();
    fileArray.forEach((fileData) => {
      formData.append('file', fileData.file);
      formData.append('path', fileData.path); // Enviar la ruta para crear las carpetas
    });

    try {
      const response = await fetch('/api/reports/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Si la carga es exitosa, actualiza el sistema de archivos
        const fetchUpdatedFileSystem = async () => {
          const response = await fetch('/api/reports/filesystem');
          if (response.ok) {
            const data = await response.json();
            console.log('Datos del sistema de archivos después de subir la carpeta:', data);

            setFileSystem(data);

            // También actualizamos currentContents
            if (currentFolder === null) {
              const rootContents = data.filter((node) => node.parentId === null);
              console.log('Contenido de la raíz:', rootContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(rootContents);
            } else {
              const folderContents = data.filter((node) => node.parentId === currentFolder);
              console.log('Contenido de la carpeta:', folderContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(folderContents);
            }
          }
        };

        fetchUpdatedFileSystem();
      } else {
        alert('Error al subir archivos');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  }
};

  const handleUploadFile = async (files: FileList | null) => {
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('file', file));
      formData.append('name', 'uploaded-file-name'); // Nombre del archivo
      formData.append('type', 'file'); // Tipo de nodo
      formData.append('parentId', currentFolder || null); // Cambiar a "parent"
    
      const response = await fetch('/api/reports/filesystem', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // Si la carga es exitosa, actualiza el sistema de archivos
        const fetchUpdatedFileSystem = async () => {
          const response = await fetch('/api/reports/filesystem');
          if (response.ok) {
            const data = await response.json();
            console.log('Datos del sistema de archivos después de subir la carpeta:', data);

            setFileSystem(data);

            // También actualizamos currentContents
            if (currentFolder === null) {
              const rootContents = data.filter((node) => node.parentId === null);
              console.log('Contenido de la raíz:', rootContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(rootContents);
            } else {
              const folderContents = data.filter((node) => node.parentId === currentFolder);
              console.log('Contenido de la carpeta:', folderContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(folderContents);
            }
          }
        };

        fetchUpdatedFileSystem();
      } else {
        alert('Error al subir archivos');
      }}
  };

  const handleRenameNode = (node: any) => {
    setSelectedNode(node);
    setShowRenameModal(true);
  };
  
  const handleRenameSubmit = async (newName: string) => {
    setFileSystem((prev) =>
      prev.map((node) =>
        node.id === selectedNode.id ? { ...node, name: newName } : node
      )
    );
  
    try {
      const response = await fetch('/api/reports/filesystem', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedNode.id, 
          newName: newName,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Si la carga es exitosa, actualiza el sistema de archivos
        const fetchUpdatedFileSystem = async () => {
          const response = await fetch('/api/reports/filesystem');
          if (response.ok) {
            const data = await response.json();
            console.log('Datos del sistema de archivos después de subir la carpeta:', data);

            setFileSystem(data);

            // También actualizamos currentContents
            if (currentFolder === null) {
              const rootContents = data.filter((node) => node.parentId === null);
              console.log('Contenido de la raíz:', rootContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(rootContents);
            } else {
              const folderContents = data.filter((node) => node.parentId === currentFolder);
              console.log('Contenido de la carpeta:', folderContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(folderContents);
            }
          }
        };

        fetchUpdatedFileSystem();
      } else {
        alert('Error al subir archivos');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  const handleDeleteNode = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/filesystem`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        // El nodo se eliminó con éxito, ahora actualizamos el sistema de archivos
        const data = await response.json();  // Esto debería estar aquí, solo cuando la respuesta es OK
        console.log('Nodo eliminado con éxito:', data.message);
  
        // Función para obtener el sistema de archivos actualizado
        const fetchUpdatedFileSystem = async () => {
          const response = await fetch('/api/reports/filesystem');
          if (response.ok) {
            const data = await response.json();
            console.log('Datos del sistema de archivos después de eliminar el nodo:', data);
  
            setFileSystem(data);
  
            // También actualizamos currentContents
            if (currentFolder === null) {
              const rootContents = data.filter((node) => node.parentId === null);
              console.log('Contenido de la raíz:', rootContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(rootContents);
            } else {
              const folderContents = data.filter((node) => node.parentId === currentFolder);
              console.log('Contenido de la carpeta:', folderContents);  // Verifica si la carpeta aparece en los contenidos
              setCurrentContents(folderContents);
            }
          } else {
            console.error('Error al obtener el sistema de archivos después de eliminar el nodo.');
          }
        };
  
        // Llamamos a la función para obtener los datos más recientes
        fetchUpdatedFileSystem();
  
      } else {
        // Si la respuesta no es OK, muestra el error
        const errorData = await response.json();
        console.error('Error eliminando el nodo:', errorData.error);
        alert('Error eliminando el nodo: ' + errorData.error);
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };  

  const handleDownloadFile = (node: any) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(node.file);
    link.download = node.name;
    link.click();
  };
  
  const handleDownloadFolder = async (folderNode: any) => {
    try {
      const zip = new JSZip();
  
      // Función recursiva para agregar archivos y carpetas al ZIP
      const addFolderContentsToZip = (folder, parentZip) => {
        const folderZip = parentZip.folder(folder.name);
  
        // Obtener los elementos de la carpeta actual
        const contents = fileSystem.filter((node) => node.parentId === folder.id);
  
        contents.forEach((item) => {
          if (item.type === "folder") {
            // Recursivamente agregar subcarpetas
            addFolderContentsToZip(item, folderZip);
          } else if (item.type === "file") {
            // Agregar archivos al ZIP
            folderZip.file(item.name, item.file); // `item.file` debe ser un Blob o Uint8Array
          }
        });
      };
  
      // Iniciar la construcción del ZIP desde la carpeta seleccionada
      addFolderContentsToZip(folderNode, zip);
  
      // Generar el ZIP
      const content = await zip.generateAsync({ type: "blob" });
  
      // Crear un enlace de descarga dinámico
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${folderNode.name}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.log("Carpeta descargada exitosamente.");
    } catch (error) {
      console.error("Error al descargar la carpeta:", error);
      alert("Hubo un error al descargar la carpeta.");
    }
  };
  
  const getBreadcrumbs = () => {
    const breadcrumbs: any[] = [];
    let current = currentFolder;
    while (current) {
      const node = fileSystem.find((node) => node.id === current);
      if (node) {
        breadcrumbs.unshift(node);
        current = node.parentId;
      } else {
        break;
      }
    }
    return breadcrumbs;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">
      <RenameForm
        show={showRenameModal}
        currentName={selectedNode?.name || ""}
        onRename={handleRenameSubmit}
        closeModal={() => setShowRenameModal(false)}
      />
      {showCreateFolderModal && (
        <FolderNameForm
          show={showCreateFolderModal}
          currentName={folderName}
          onRename={handleCreateFolderSubmit}  
          closeModal={() => setShowCreateFolderModal(false)}  
        />
      )}

      <h1 className="text-xl font-bold mb-4">Gestor de Archivos</h1>

      <div className="w-full bg-gray-200 p-2 rounded mb-4 flex items-center">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setCurrentFolder(null)}
        >
          Inicio
        </span>
        {getBreadcrumbs().map((breadcrumb, index) => (
          <span key={breadcrumb.id} className="flex items-center">
            <span className="mx-2">/</span>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setCurrentFolder(breadcrumb.id)}
            >
              {breadcrumb.name}
            </span>
          </span>
        ))}
      </div>

      <div className="w-full bg-white rounded shadow p-4">
        <div className="flex space-x-2 mb-4">
          {currentFolder && (
            <button
              onClick={() =>
                setCurrentFolder(
                  fileSystem.find((node) => node.id === currentFolder)?.parentId ||
                    null
                )
              }
              className="bg-gray-300 px-4 py-2 rounded"
            >
              <FontAwesomeIcon icon={faTurnUp} />
            </button>
          )}
          <div className="dropdown dropdown-start relative">
          <button
            onClick={() => handleCreateFolderClick} // Alterna la visibilidad del menú
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <FontAwesomeIcon icon={faFolderPlus} />
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white py-2 z-10 mt-2 rounded shadow w-56"  
          >
            <li>
              <button
                onClick={handleCreateFolderClick}
                className="w-full text-left py-2 px-4 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faFolderPlus} />
                Crear Carpeta
              </button>
            </li>
            <li>
            <input
              type="file"
              className="your-class"
              id="your-id"
              multiple
              onChange={handleFolderUpload}
              // @ts-ignore
              webkitdirectory="true"
              // @ts-ignore
              directory="true"
            />


              <label
                htmlFor="folderInput"
                className="px-4 py-2 rounded cursor-pointer hover:bg-gray-100 w-full" // Agregar w-full aquí si quieres que el label también ocupe el ancho completo
              >
                <FontAwesomeIcon icon={faFolderOpen} />
                Subir Carpeta
              </label>
            </li>
          </ul>
          </div>
          <input
            type="file"
            className="hidden"
            id="fileInput"
            multiple
            onChange={(e) => handleUploadFile(e.target.files)}
          />
          <label
            htmlFor="fileInput"
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            <FontAwesomeIcon icon={faFileCirclePlus} />
          </label>

          
        </div>

        {currentContents.length === 0 ? (
          <p className="text-gray-500">No hay elementos en esta carpeta.</p>
        ) : (
          currentContents.map((node) => (
            <div className="flex flex-row items-center" key={node.id}>
              <li
                onClick={() => node.type === "folder" && setCurrentFolder(node.id)}
                className="cursor-pointer flex items-center justify-between hover:bg-gray-100 px-4 py-2 rounded flex-grow"
              >
                <span>
                  {node.type === "folder" ? "📁" : "📄"} {node.name}
                </span>
              </li>
              <div className="dropdown dropdown-end relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-200"
                  onClick={(event) => event.stopPropagation()} // Detener propagación
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white py-2 z-10 mt-2 rounded shadow"
                >
                  <li>
                    <button
                      onClick={() => (node.type === "folder" ? handleDownloadFolder(node) : handleDownloadFile(node))}
                      className="w-full text-left hover:bg-gray-100 px-4 py-1"
                    >
                      Descargar
                    </button>
                  </li>
                  <li>
                  <button onClick={() => handleRenameNode(node)} className="w-full text-left hover:bg-gray-100 px-4 py-1">
                    Renombrar
                  </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="w-full text-left text-red-500 hover:bg-red-100 px-4 py-1"
                    >
                      Eliminar
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileManager;