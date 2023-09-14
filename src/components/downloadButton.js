import React, { Fragment } from "react";
import pdfIcon from "../assets/media/svg/files/pdf.svg";

const DownloadFileButton = ({ data }) => {
  const { title = "", file, button_type } = data;

  const fileUrl = file;
  const fileName = fileUrl.split("/").pop(); // Extraer el nombre del archivo de la URL

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
  };

  return (
    <Fragment>
      {button_type === "button" ? (
        <div className="d-flex flex-column mb-9">
          <div className="d-flex align-items-center mb-5">
            <div className="symbol symbol-30px me-5">
              <img alt="Icono" src={pdfIcon} />
            </div>

            <div className="fw-semibold">
              <a className="fs-6 fw-bold text-dark text-hover-primary" href="#">
                {title}
              </a>

              <div className="text-gray-400">
                {fileName}{" "}
                <a href="#" onClick={handleDownloadFile}>
                  Descargar
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadFile}
              className="btn btn-clean btn-sm btn-icon btn-icon-primary btn-active-light-primary ms-auto"
            >

              <i className ="ki-duotone ki-file-down fs-3">
                <i className ="path1"></i>
                <i className ="path2"></i>
              </i>
            </button>
          </div>
        </div>
      ) : (
        <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6">
          <div className="d-flex flex-stack flex-grow-1">
            {/*--begin::Content-->*/}
            <div className="fw-semibold">
              <div className="d-flex align-items-center mb-4 mt-4">
                {/*--begin::Icon-->*/}
                <div className="symbol symbol-30px me-5">
                  <img alt="Icono" src={pdfIcon} />
                </div>
                {/*--end::Icon-->*/}

                {/*--begin::Details-->*/}
                <div className="fw-semibold">
                  <a
                    className="fs-6 fw-bold text-dark text-hover-primary"
                    href="#"
                  >
                    {title}
                  </a>

                  <div className="text-gray-400">
                    {fileName}{" "}
                    <a href="#" onClick={handleDownloadFile}>
                      Descargar
                    </a>
                  </div>
                </div>
                {/*--end::Details-->*/}
              </div>
            </div>

            {/*--end::Content-->*/}
          </div>
          {/*--end::Wrapper-->*/}
        </div>
      )}
    </Fragment>
  );
};

export default DownloadFileButton;
