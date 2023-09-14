
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  ACTIVATION_SUCCESS,
  ACTIVATION_FAIL,
  SET_AUTH_LOADING,
  REMOVE_AUTH_LOADING,
  USER_LOADED_SUCCESS,
  USER_LOADED_FAIL,
  AUTHENTICATED_SUCCESS,
  AUTHENTICATED_FAIL,
  REFRESH_SUCCESS,
  REFRESH_FAIL,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_CONFIRM_SUCCESS,
  RESET_PASSWORD_CONFIRM_FAIL,
  LOGOUT,
} from "../actions/types";

//import { store } from "../store";

// Se define el estado inicial del reducer
const initialState = {
  access: localStorage.getItem("access"), // Se obtiene el token de acceso del almacenamiento local
  refresh: localStorage.getItem("refresh"), // Se obtiene el token de refresco del almacenamiento local
  isAuthenticated: null, // Indica si el usuario está autenticado o no
  user: null, // Contiene la información del usuario autenticado
  loading: false, // Indica si se está realizando alguna operación de autenticación
};

/**
 * Reducer que maneja el estado de autenticación de la aplicación.
 * @param {Object} state - Estado actual del reducer.
 * @param {Object} action - Objeto que describe el cambio a realizar en el estado.
 * @param {string} action.type - Tipo de acción que describe el cambio a realizar.
 * @param {any} action.payload - Carga útil de la acción.
 * @returns {Object} Nuevo estado del reducer.
 */

export default function Auth(state = initialState, action) {
  const { type, payload } = action;

  // Se utiliza un switch para manejar las diferentes acciones que pueden ser ejecutadas
  switch (type) {

    // Si la acción es SET_AUTH_LOADING, establece el estado de carga en true
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: true,
      };

    // Si la acción es REMOVE_AUTH_LOADING, establece el estado de carga en false
    case REMOVE_AUTH_LOADING:
      return {
        ...state,
        loading: false,
      };

    // Si la acción es USER_LOADED_SUCCESS, establece el usuario en el estado a partir del payload

    case USER_LOADED_SUCCESS:
      return {
        ...state,
        user: payload,
      };

    // Si la acción es USER_LOADED_FAIL, establece el usuario en el estado como null

    case USER_LOADED_FAIL:
      return {
        ...state,
        user: null,
      };

    // Si la acción es AUTHENTICATED_SUCCESS, establece el estado de autenticación en true

    case AUTHENTICATED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    // Si la acción es AUTHENTICATED_FAIL, elimina el token de acceso y el token de actualización del almacenamiento local
    // y establece el estado de autenticación en false y los tokens en null

    case AUTHENTICATED_FAIL:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        isAuthenticated: false,
        access: null,
        refresh: null,
      };

    // Si la acción es LOGIN_SUCCESS, guarda los tokens de acceso y actualización en el almacenamiento local
    // y establece el estado de autenticación en true y los tokens de acceso y actualización a partir del almacenamiento local

    case LOGIN_SUCCESS:
      localStorage.setItem("access", payload.access);
      localStorage.setItem("refresh", payload.refresh);
      return {
        ...state,
        isAuthenticated: true,
        access: localStorage.getItem("access"),
        refresh: localStorage.getItem("refresh"),
      };

    // Si la acción es ACTIVATION_SUCCESS, ACTIVATION_FAIL, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL,
    // RESET_PASSWORD_CONFIRM_SUCCESS o RESET_PASSWORD_CONFIRM_FAIL, no realiza cambios en el estado

    case ACTIVATION_SUCCESS:
    case ACTIVATION_FAIL:
    case RESET_PASSWORD_SUCCESS:
    case RESET_PASSWORD_FAIL:
    case RESET_PASSWORD_CONFIRM_SUCCESS:
    case RESET_PASSWORD_CONFIRM_FAIL:
      return {
        ...state,
      };

    // Si la acción es REFRESH_SUCCESS, guarda el nuevo token de acceso en el almacenamiento local
    // y establece el token de acceso en el estado a partir del almacenamiento local
    case REFRESH_SUCCESS:
      localStorage.setItem("access", payload.access);
      return {
        ...state,
        access: localStorage.getItem("access"),
      };

    // Si la acción es SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_FAIL, REFRESH_FAIL o LOGOUT, elimina los tokens de acceso y actualización del almacenamiento local
    // y establece el estado de autenticación en false y los tokens en null, y establece el usuario en el estado como null

    //case SIGNUP_SUCCESS:
    //case SIGNUP_FAIL:
    case LOGIN_FAIL:
    case REFRESH_FAIL:
    case LOGOUT:
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        access: null,
        refresh: null,
        isAuthenticated: false,
        user: null,
      };

      
    default:
      return state;
  }
}
