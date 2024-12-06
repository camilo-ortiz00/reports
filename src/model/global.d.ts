// src/model/global.d.ts
declare global {
  interface HTMLInputElement {
    webkitdirectory: boolean;
    directory: boolean;
  }
}

export {}; // Esto es importante para asegurarse de que el archivo sea tratado como módulo
