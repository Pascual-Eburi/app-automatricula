import React, { Fragment } from "react";
import { connect } from "react-redux";



// Configuracion de cada tipo de alerta
const alertConfig = {
  success: {
    color: "success",
    icon: () => (
      <i className="ki-duotone ki-double-check fs-2hx text-success me-4 mb-5 mb-sm-0">
        <i className="path1"></i>
        <i className="path2"></i>
      </i>
    ),
  },
  error: {
    color: "danger",
    icon: () => (
      <i className="ki-duotone ki-cross-circle fs-2hx text-danger me-4 mb-5 mb-sm-0">
        <i className="path1"></i>
        <i className="path2"></i>
      </i>
    ),
  },
  warning: {
    color: "warning",
    icon: () => (
      <i className="ki-duotone ki-notification fs-2hx text-warning me-4 mb-5 mb-sm-0 ">
        <i className="path1"></i>
        <i className="path2"></i>
        <i className="path3"></i>
      </i>
    ),
  },
  info: {
    color: "primary",
    icon: () => (
      <i className="ki-duotone ki-information fs-2hx text-primary me-4 mb-5 mb-sm-0">
        <i className="path1"></i>
        <i className="path2"></i>
        <i className="path3"></i>
      </i>
    ),
  },
};

const DEFAULT_CONFIG = {
  color: "info",
  icon: () => (
    <i className="ki-duotone ki-double-check fs-2hx text-info me-4 mb-5 mb-sm-0">
      <i className="path1"></i>
      <i className="path2"></i>
    </i>
  ),
}
/**
 * Componente Alert que muestra una alerta en la interfaz de usuario
 *
 * @param {object} alert - Objeto con la información de la alerta a mostrar
 * @param {string} alert.alertType - Tipo de la alerta (success, danger, warning, info)
 * @param {string} alert.title - Título de la alerta
 * @param {string} alert.msg - Mensaje de la alerta
 *
 * @returns {JSX.Element} - Elemento JSX que representa la alerta a mostrar
 */
function Alert({ alert }) {
    /**
     * Función que se encarga de renderizar la alerta si hay una alerta que mostrar
     *
     * @returns {JSX.Element} - Elemento JSX que representa la alerta a mostrar
     */
    const displayAlert = () => {
      if (alert !== null) {
        // Obtenemos el color correspondiente al tipo de alerta
        const color = alertConfig[alert.alertType] ? alertConfig[alert.alertType].color : DEFAULT_CONFIG.color;
  
        return (
          <>
            {/* Inicio de la alerta */}
            <div className={`alert alert-dismissible bg-light-${color} border border-${color} border-dashed d-flex flex-column flex-sm-row p-5 mb-10 custom-alert`}>
              {/* Icono de la alerta */}
              { alertConfig[alert.alertType] ? alertConfig[alert.alertType].icon() : DEFAULT_CONFIG.icon()}
              {/* Fin del icono */}
  
              {/* Wrapper que contiene el título y el mensaje de la alerta */}
              <div className="d-flex flex-column pe-0 pe-sm-10">
                {/* Título de la alerta */}
                <h5 className={`mb-1 text-${color}`}>{alert.title}</h5>
                {/* Fin del título */}
  
                {/* Mensaje de la alerta */}
                <span className={`text-${color}`}>{alert.msg}</span>
                {/* Fin del mensaje */}
              </div>
              {/* Fin del wrapper */}
  
              {/* Botón para cerrar la alerta */}
              <button
                type="button"
                className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto"
                data-bs-dismiss="alert"
              >
                <i className={`ki-duotone ki-cross fs-1 text-${color}`}>
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </button>
              {/* Fin del botón para cerrar la alerta */}
            </div>
            {/* Fin de la alerta */}
          </>
        );
      } else {
        return <Fragment></Fragment>;
      }
    };
  
    // Renderizamos la alerta a través del resultado de la función displayAlert
    return <Fragment>{displayAlert()}</Fragment>;
  }
  
  // Función que mapea el estado de la aplicación al objeto de propiedades del componente
  const mapStateToProps = (state) => ({
    alert: state.Alert.alert,
  });
  
  // Conectamos el componente al store de Redux
  export default connect(mapStateToProps)(Alert);
  


