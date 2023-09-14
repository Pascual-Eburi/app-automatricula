import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const Paginacion = () => {
    const location = useLocation();
    const navigate = useNavigate();
  
    const navigateBack = () => {
      navigate(-1); // Navegar a la página anterior
    };
  
    const navigateForward = () => {
      navigate(1); // Navegar a la página siguiente
    };

  return (

      <div className="d-flex align-items-center">
        <button
          onClick={navigateBack}
          type="button"
          className="btn btn-sm btn-icon btn-light-primary me-3"
          title="Ir a la página anterior"

        >
            <i className="ki-duotone ki-left fs-2"></i>{" "}
        </button>

        <button
          onClick={navigateForward}
          type="button"
          className="btn btn-sm btn-icon btn-light"
          title="Ir a la página siguiente"
        >
            <i className="ki-duotone ki-right fs-2"></i>{" "}

        </button>
      </div>

  );
};

export default Paginacion;
