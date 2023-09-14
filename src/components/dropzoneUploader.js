import React, { useEffect } from "react";
import Dropzone from "dropzone";

const DropzoneUploader = ({
  inputName,
  maxFiles,
  maxFilesize,
  acceptedFileTypes,
  handleFileAdded,
  handleFileRemoved,
}) => {

  Dropzone.autoDiscover = false;

  useEffect(() => {
    const element = document.getElementById(inputName);

    if (element.dropzone) {
      element.dropzone.destroy(); // Destruir la instancia previa de Dropzone
    }

    const myDropzone = new Dropzone(element, {
      url: "dummy",
      maxFiles,
      maxFilesize,
      addRemoveLinks: true,
      autoProcessQueue: false,
      accept: function(file, done) {
        const allowedExtensions = acceptedFileTypes;
        const allowedMimeTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (
          allowedExtensions.includes(
            file.name.substr(file.name.lastIndexOf("."))
          ) &&
          allowedMimeTypes.includes(file.type)
        ) {
          done();
        } else {
          alert(
            "El archivo seleccionado no es válido. Por favor, seleccione un archivo PDF, Word o ODT."
          );
          myDropzone.removeFile(file);
          done("El archivo seleccionado no es válido.");
        }
      },
      acceptedFiles: acceptedFileTypes.join(),
      dictDefaultMessage: "Arrastra archivos aquí para cargarlos",
      dictFileTooBig:
        "El archivo es demasiado grande ({{filesize}} MB). Tamaño máximo permitido: {{maxFilesize}} MB.",
      dictInvalidFileType: "No se permite este tipo de archivo.",
      dictResponseError: "Ha ocurrido un error durante la carga del archivo.",
      init: function() {
        this.on("addedfile", (file) => {
          handleFileAdded(file, inputName);
        });

        this.on("removedfile", (file) => {
          handleFileRemoved(file, inputName);
        });
      },
    });

    return () => {
      myDropzone.destroy(); // Destruir la instancia de Dropzone al desmontar el componente     
/*       inputName,
      maxFiles,
      maxFilesize,
      acceptedFileTypes,
      handleFileAdded,
      handleFileRemoved, */
    }; 

  }, []);

  return (
    <div className="dropzone" id={inputName} name={inputName}>
      {/*--begin::Message-->*/}
      <div className="dz-message needsclick">
        <i className="ki-duotone ki-file-up fs-3x text-primary">
          <span className="path1"></span>
          <span className="path2"></span>
        </i>

        {/*--begin::Info-->*/}
        <div className="ms-4 ">
          <h3 className="fs-5 fw-bold text-gray-900 mb-1">
            Suelta el archivo aquí o haz clic para subir.
          </h3>
          <span className="fs-7 fw-semibold text-gray-400">
            Puedes subir {maxFiles} archivo/s como máximo.
          </span>
        </div>
        {/*--end::Info-->*/}
      </div>
    </div>
  );
};

export default DropzoneUploader;
