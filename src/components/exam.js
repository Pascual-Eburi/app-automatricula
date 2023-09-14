import React from "react";
import { Link } from "react-router-dom";

import {  FormatDateToSpanish } from "../helpers/DateFormater";
import { UserAvatarUrl } from "../helpers/Media";
import Badge from "./badge";

export default function ExamTableRow(props) {
    const {exam, is_student, is_admin, is_institute_staff, is_staff, isAuthenticated, index} = props;
    
    const IMG_SRC = UserAvatarUrl(exam.student.photo);

  return (
    <tr>
        {/* INDEX */}
      <td>{ index + 1 }</td>
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
              { exam.student.name }
            </Link>
            <span className="text-muted fw-semibold text-muted d-block fs-7">
              { exam.student.institute }
            </span>
          </div>
        </div>
      </td>
    
        {/* STUDENT*/}
      <td>
        <Link
          to="/notas"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
        >
          { exam.subject.name }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
        <span className="badge fw-semibold fs-9 px-2 ms-2 bg-body text-dark text-hover-primary shadow-sm">
        { exam.subject.phase } </span> - { exam.announcement.name}
        </span>
      </td>
            
      {/* EXAM CENTER */}
      <td>
        <Link
          to="/notas"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
        >
          { exam.student.exam_center.exam_center }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          { exam.student.exam_center.address }
        </span>
      </td>
        
        {/* EXAM CLASSROOM */}
      <td>
        <Link
          to="/notas"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
        >
          { exam.student.exam_center.class_room }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          { exam.student.exam_center.exam_center }
        </span>
      </td>
        
        {/* DATE */}
      <td>
        <Link
          to="/"
          className="text-dark fw-bold text-hover-primary d-block mb-1 fs-6"
        >
          { FormatDateToSpanish(exam.exam_date) }
        </Link>
        <span className="text-muted fw-semibold text-muted d-block fs-7">
          { exam.start_time } - { exam.end_time }
        </span>
      </td>

        {/* GRADE ESTATUS*/}
      <td>
        <span className={`badge badge-light-${exam.announcement.status_grade.type} fs-7 fw-bold`}>{exam.announcement.status_grade.msg}</span>
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
