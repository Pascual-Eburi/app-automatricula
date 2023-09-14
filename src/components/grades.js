import React from "react";
import { Link } from "react-router-dom";

import { FormatDateToSpanish } from "../helpers/DateFormater";
import { calculateAverageGrade, getHighestAverageGradeEnrollment } from "../helpers/General";
import { UserAvatarUrl } from "../helpers/Media";
import Badge from "./badge";

export default function GradesTableRow(props) {
  const {
    enrollment,
    is_student,
    is_admin,
    is_institute_staff,
    is_staff,
    isAuthenticated,
    index,
  } = props;

  const IMG_SRC = UserAvatarUrl(enrollment.student.photo);

    // convocatorias previas
    const previous_enrollments = enrollment.previous_enrollments;

    // Fecha actual
    const today = new Date();
    // publicacion de notas
    const grades_publication = new Date(enrollment.announcement.grades_publication);

    // notas publicadas ?
    const published_results = today >= grades_publication ? true : false; 
    const has_phase_result = enrollment.phase_results ? true : false;
    const has_general_phase = has_phase_result && enrollment.phase_results.hasOwnProperty('Fase General');
    const show_results = (published_results && has_phase_result) ? true : false;

    const general_phase_result = () =>{


        const general_phase = has_general_phase ? enrollment.phase_results['Fase General'].average_grade : 0.0;

        
/*         if (!has_phase_result || !enrollment.phase_results['Fase General']){ 
            return 0;
        } */
        

        return general_phase;
    }

    const specific_phase_result = () =>{
        // if (!has_phase_result ){ return undefined;}
        let specific_phase;
        let grade = 0;
        /**
         *  1. No hay convocatorias previas: La nota de la fase será nota de la convocatoria
         * 2. Hay convocatorias previas: obtener la nota mas alta de entre las convocatorias
         * 
         */

        if (has_phase_result){
          const phase = enrollment.phase_results['Fase Especifica'] || null;
          specific_phase = phase && phase.average_grade ? phase.average_grade : 0

        }else{
          specific_phase = 0
        }

        // no hay convocatorias previas
        if(  previous_enrollments.lenght <= 0){
        }

        /*         let previous_phase;

                if(!enrollment.phase_results['Fase Especifica'] && previous_enrollments.lenght > 0){
                    const higest = getHighestAverageGradeEnrollment(previous_enrollments, 'Fase Especifica');

                    previous_phase = higest;

                    return higest;
                } */
        
        

        return specific_phase.toFixed(2);
    }

    const final_grade = () => {
        /*         if (previous_enrollments.lenght <= 0){
                    return calculateAverageGrade(enrollment)
                } 
                
                const general_phase = general_phase_result();
                const specific_phase = specific_phase_result();
                
                */

         
        return calculateAverageGrade(enrollment)
        /*         const general_phase_grade = general_phase.average_grade;
                const specific_phase_grade = specific_phase.average_grade; */




    }

  return (
    <tr data-enrollment={enrollment.code}>
      {/*<!--begin::student-->*/}
      <td>
        <div className="d-flex align-items-center">
            <div className="symbol symbol-50px me-5 ">
                <img
                src={ IMG_SRC }
                className=""
                alt="Avatar"
                />
            </div>

            <div className="d-flex justify-content-start flex-column">
                <Link
                to="/alumno"
                className="text-dark fw-bold text-hover-primary mb-1 fs-6"
                >
                { enrollment.student.name }
                </Link>
                <span className="text-muted fw-semibold text-muted d-block fs-7">
                  <span className="badge fw-semibold fs-9 px-2 ms-2 bg-body text-dark shadow-sm">
                  { enrollment.student.modality }
                  </span> - { enrollment.student.institute }

                </span>
            </div>
        </div>
      </td>
      {/*<!--end::student-->*/}

      {/*<!--begin::Announcement-->*/}
      <td className="text-center">
        <span className="badge fw-semibold fs-9 px-2 ms-2 bg-body text-dark text-hover-primary shadow-sm">
        { enrollment.announcement.name } </span> 
        </td>
      {/*<!--end::Annonouncement-->*/}

      {/*<!--begin::F.GENERAL-->*/}
      <td className="text-center">
        <span  className="text-dark fs-7">
        {
            show_results ? general_phase_result().toFixed(2) : '-'
        }

        </span>
      </td>
      {/*<!--end::F.GENERAL-->*/}

      {/*<!--begin::F. SPECIFICA-->*/}
      <td className="text-center">
      <span  className="text-dark fs-7">
        {
            show_results ? specific_phase_result() : '-'
        }

        </span>
      </td>
      {/*<!--end::F. SPECIFICA-->*/}

      {/*<!--begin::Profit-->*/}
      <td className="text-center">
        <span className="fw-bold text-dark fs-7">{
            show_results ? final_grade() : '-'
        }</span>
      </td>
      {/*<!--end::Profit-->*/}

      {/*<!--begin::Status-->*/}
      <td className="text-center">
        {
        published_results ? (
            <span className="badge py-3 px-4 fs-7 badge-light-success">
            Publicadas
          </span>): (
            <span className="badge py-3 px-4 fs-7 badge-light-info">
            No publicado
          </span>
          )
        }
        
      </td>
      {/*<!--end::Status-->*/}

      {/*<!--begin::Actions-->*/}
      <td className="text-end">
        <button
          type="button"
          className="btn btn-sm btn-icon btn-light btn-active-light-primary toggle h-25px w-25px"
          data-datatable-subtable="expand_row"
        >
          <i className="ki-duotone ki-plus fs-3 m-0 toggle-off"></i>
          <i className="ki-duotone ki-minus fs-3 m-0 toggle-on"></i>
        </button>
      </td>
      {/*<!--end::Actions-->*/}
    </tr>
  );
}
