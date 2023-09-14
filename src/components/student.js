import React from "react";
import { Link } from "react-router-dom";

import {  FormatDateToSpanish } from "../helpers/DateFormater";
import { UserAvatarUrl } from "../helpers/Media";
import Badge from "./badge";

export default function StudentTableRow(props) {
    const {student, is_admin, is_institute_staff, is_staff, isAuthenticated, index} = props;
    
    const IMG_SRC = UserAvatarUrl(student.photo);

  return (
    <tr>
        {/* INDEX */}
      <td className="text-center">{ index + 1 }</td>

      {/* STUDENT INFO */}
      <td className="text-center">
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
              { student.user.name } { student.user.last_name }
            </Link>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
                <span className="badge fw-semibold fs-9 px-2 ms-2 bg-body text-dark text-hover-primary shadow-sm">
                { student.modality.name } </span> - { student.institute }
            </span>
                {/*             
                <span className="text-muted fw-semibold text-muted d-block fs-7">
              { student.institute }
            </span> */}
          </div>
        </div>
      </td>
    
        {/* CONTACT INFO */}
    <td className="text-center">
            <Link
            to="/"
            className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
            >
            { student.user.phone }
            </Link>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
            { student.user.email }
            </span>
      </td>

        {/* DOCUMENT INFO */}
        <td className="text-center">
            <Link
            to="/"
            className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6 text-capitalize"
            >
            { student.doc_type }
            </Link>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
            { student.doc_number }
            </span>
      </td>
            
      {/* ORIGIN INFO */}
    <td className="text-center">
        <Link
          to="/notas"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
        >
          { student.village }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          { student.district || 'No establecido' }
        </span>
      </td>
        
        {/* ADDRESS */}
    <td className="text-center">
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          { student.address || 'No indicado'}
        </span>
      </td>
        
        {/* AGE */}
    <td className="text-center">
        <Link
          to="/"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6">
          { student.age }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block text-capitalize fs-7">
          {  student.gender }
        </span>
      </td>

        {/* ANNOUNCEMENTS && HIGH SCHOOL AVG */}
        <td className="text-center">
            <Link
            to="/"
            className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6">
            { student.high_school_grade }
            </Link>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
            {  student.number_of_enrollments }
            </span>
        </td>

        {/* SCHOOL_REPORT */}
    <td className="text-center">
        <span className={`badge badge-light-${ student.school_report ? 'success': 'danger'} fs-7 fw-bold`}>
            { student.school_report ? 'OK': 'Pte.'}
            </span>
      </td>

      <td className="text-end">
        <Link
          to="/"
          className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
        >
          <i className="ki-duotone ki-switch fs-2">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>{" "}
        </Link>

      </td>
    </tr>
  );
}
