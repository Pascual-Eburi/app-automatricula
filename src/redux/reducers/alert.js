import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// Define el estado inicial para Alert
const initialState = { alert: null };

/**
 * Reducer de Alertas que maneja el estado de la alerta.
 *
 * @param {object} state - Estado actual de la alerta.
 * @param {object} action - Acción a ejecutar sobre el estado de la alerta.
 * @returns {object} - Nuevo estado de la alerta.
 */
export default function Alert(state = initialState, action) {
  // Extrae el tipo y el payload de la acción
  const { type, payload } = action;

  // Realiza diferentes acciones en función del tipo de la acción
  switch (type) {
    // Si la acción es SET_ALERT, actualiza el estado de alerta
    case SET_ALERT:
      return {
        ...state,
        alert: payload,
      };

    // Si la acción es REMOVE_ALERT, elimina el estado de alerta
    case REMOVE_ALERT:
      return {
        ...state,
        alert: null,
      };

    // Si la acción no coincide con ninguna de las anteriores, devuelve el estado actual
    default:
      return state;
  }
}
