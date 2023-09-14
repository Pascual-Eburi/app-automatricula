import React, { Fragment } from "react";
import { Link } from "react-router-dom";


import { ExtractDateTime, FormatDateToSpanish } from "../helpers/DateFormater";
import { UserAvatarUrl } from "../helpers/Media";
import Badge from "./badge";


export default function EnrollmentRow(props) {

    const {enrollment, is_student, is_admin, is_institute_staff, is_staff, isAuthenticated, index} = props;


    const DEFAULT_STATUS = {color: 'danger', text: 'No valido'};
    const ENROLLMENT_STATUS = {
        0 : {color: 'warning', text: 'No formalizada'},
        1 : {color: 'info', text: 'Formalizada'},
        2 : {color: 'success', text: 'Valida'},
        3: {color: 'warning', text: 'Valida Parcialmente'}
    }

    const DOCUMENT_STATUS = {
      0 : {color: 'warning', text: 'Sin validar'},
      1 : {color: 'success', text: 'Valido'},
      2 : {color: 'danger', text: 'No valido'}
    }

    const MODALITY_COLORS = {
      Tecnologia: 'success',
      'Ciencias Sociales': 'primary',
      Humanidades: 'danger'
    }

    const DEFAULT_MODALITY_COLOR = 'info';
    const MODALITY_COLOR = MODALITY_COLORS[enrollment.student.modality] || DEFAULT_MODALITY_COLOR;

    const ENROLLMENT_STATUS_DATA = ENROLLMENT_STATUS[enrollment.status] || DEFAULT_STATUS;
    const DNI_STATUS = DOCUMENT_STATUS[enrollment.status_id_card] || DEFAULT_STATUS;
    const PROOF_PAYMENT_STATUS = DOCUMENT_STATUS[enrollment.status_proof_payment] || DEFAULT_STATUS;

    const enrollment_phases = Object.keys(enrollment.subjects).length;
    const subjects_general_phase = enrollment.subjects['Fase General'] ? enrollment.subjects['Fase General'].length : 0;
    const specific_phase_subjects = enrollment.subjects['Fase Especifica'] ? enrollment.subjects['Fase Especifica'].length : 0;
    const total_subjects = subjects_general_phase + specific_phase_subjects || 0;

    const date_time = ExtractDateTime(enrollment.enrollment_date)
    const time = date_time.time;
    const date = FormatDateToSpanish(date_time.date);

    // validar matricula ???
    const show_validate_enrollment_button = () =>{
        return (
          //enrollment.status !== 2 && // validada
          enrollment.status_proof_payment !== 1 || // valido 
          enrollment.status_id_card !== 1 // validado
        ); 
    }

 //!show_validate_enrollment_button();
    const show_sanitize_enrollment_documents = () =>  {
      return (
        //enrollment.status !== 2 || 
        enrollment.status_proof_payment !== 1 || // no valido 
        enrollment.status_id_card !== 1 // no valido
      )
    }; 
    
    const IMG_SRC = UserAvatarUrl(enrollment.student.photo);

  return (
    <tr>
{/*       {
        is_admin() && (
          <td>
            <div className="form-check form-check-sm form-check-custom form-check-solid">
              <input className="form-check-input" type="checkbox" value="1" />
            </div>
          </td>

        )
      } */}
      <td className="">{index + 1}</td>
      <td>
        <Link
          to={`/matriculas/${enrollment.code}`}
          className="text-gray-800 text-hover-primary mb-1"
        >
          <code> 
          {enrollment.code}

          </code>
        </Link>
      </td>
        {
          is_student() && (
            <td>
               <span className="text-gray-400 fw-semibold d-block fs-7">{enrollment.announcement.name}</span>
            </td>
          )
        }
        {        
        
        (is_institute_staff() || is_staff() || is_admin()) && (   

          <td>
            <div className="d-flex align-items-center">
              <div className="symbol symbol-50px me-5 ">
                <img
                  src={ IMG_SRC }
                  className=""
                  alt={enrollment.student.name}
                />
              </div>

              <div className="d-flex justify-content-start flex-column">
                <Link
                  to={`/alumnos/${enrollment.student.student}`}
                  className="text-dark fw-bold text-hover-primary mb-1 fs-6"
                >
                  {enrollment.student.name}
                </Link>
                <span className="text-muted fw-semibold text-muted d-block fs-7">
                    <span className={`badge fw-semibold fs-9 px-2 ms-2 bg-body text-${MODALITY_COLOR} text-hover-primary shadow-sm`}>
                    { enrollment.student.modality } </span> - { enrollment.student.institute }
                </span>

              </div>
            </div>
        </td>
        )}
      <td>
        <Badge data={ENROLLMENT_STATUS_DATA} />
      </td>
      <td>
        <div className="badge badge-light">{enrollment.price} Fcos</div>
      </td>
      <td>
        <div className="d-flex justify-content-start flex-column">
          {
            is_student() 
            ? 
              (
                <Fragment>
                    <span className="text-gray-400 fw-semibold d-block fs-7">
                      F. General: { subjects_general_phase ? 'Sí': 'No'}
                    </span>
                    <span className="text-gray-400 fw-semibold d-block fs-7">
                      F. Especifica: { specific_phase_subjects ? 'Sí': 'No' }
                    </span>
                </Fragment>
              ) 
            :
              (
                <Fragment>
                    <span className="text-gray-400 fw-semibold d-block fs-7">
                      Convocatoria:
                      <span className="badge fw-semibold fs-9 px-2 ms-2 bg-body text-dark text-hover-primary shadow-sm">
                    { enrollment.announcement.name } </span>
                    </span>
                   
                    
                    <span className="text-gray-400 fw-semibold d-block fs-7">
                      Fases: { enrollment_phases }
                    </span>
                </Fragment>
              )
          }


        </div>
      </td>
      <td>
          <span className="text-gray-400 fw-semibold d-block fs-7 mb-2">
            DNI: <Badge data={DNI_STATUS} />
          </span>
          <span className="text-gray-400 fw-semibold d-block fs-7">
            Just. Pago: <Badge data={PROOF_PAYMENT_STATUS} />
          </span>
      </td>
      <td>
        <span
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-7"
        >
          {date}
        </span>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
        {time}
        </span>
      </td>
      <td className="text-end">

        <button
          className="btn btn-light btn-active-light-primary btn-sm"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          Opciones
          <i className="ki-duotone ki-down fs-5 m-0"></i>
        </button>
        {/*begin::Menu*/}
        <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
            {
            (isAuthenticated) ? 
            
                (
                    <>
                    <div className="menu-item px-3">
                        <Link to={`/matriculas/${enrollment.code}`} className="menu-link px-3">
                            Ver
                        </Link>
                    </div>
                    <div className="menu-item px-3">
                        <Link to={`/matriculas/comprobante/${enrollment.code}`} className="menu-link px-3">
                            Comprobante
                        </Link>
                    </div>
                    {
                        (
                          show_validate_enrollment_button() &&
                          (is_admin() || is_staff())
                        
                        ) && (

                            <div className="menu-item px-3">
                                <Link to={`/matriculas/validar/${enrollment.code}`} className="menu-link px-3">
                                    Validar
                                </Link>
                            </div>
                        )


                    }

                    {
                        show_sanitize_enrollment_documents() && (


                            <div className="menu-item px-3">
                                <Link to={`/matriculas/reponer/${enrollment.code}`} className="menu-link px-3 text-center">
                                  Reponer Documentos
                                </Link>
                            </div>
                        )
                    }


                    {

                        is_admin() && (
                            <div className="menu-item px-3">
                              <Link
                                  href="#"
                                  data-kt-subscriptions-table-filter="delete_row"
                                  className="menu-link px-3"
                              >
                                  Eliminar
                              </Link>
                            </div>
                        )
                    }


                    </>


                )
            : 
            
            ''
            
            }
        </div>
        {/*end::Menu*/}
      </td>
    </tr>
  );
}

/* const mapStateToProps = (state) => ({
    user: state.Auth.user.user_data,
    isAuthenticated: state.Auth.isAuthenticated
  });
  
  export default connect(mapStateToProps, {})(EnrollmentRow); */