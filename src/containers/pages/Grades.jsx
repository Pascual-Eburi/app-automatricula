import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import GradesTableRow from "../../components/grades";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import { v4 as uuidv4 } from "uuid";
import { GenerateDataTableSubtable } from "../../helpers/tables";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";
import { get_enrollments } from "../../redux/actions/enrollment";

const Grades = ({
  get_enrollments,
  enrollments,
  isAuthenticated,
  isSuperUser,
  userRole,
  isStaff,
}) => {
  usePageTitle("Notas");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    get_enrollments();
    window.scrollTo(0, 0);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (enrollments) {
      KTComponents.init();
    }
    GenerateDataTableSubtable.init({
      table_id: "grades_table",
      per_page: 20,
      no_orderable: [0],
      data: enrollments,
    });
  }, []);

  useEffect(() => {
    if (isMounted) KTAppSidebar.init();
    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  return (
    <Layout>
      <div className="card mb-5 mb-xl-8">
        <div className="card-header border-0 pt-6"></div>
        <div className="card-body py-3">
          <div className="d-flex align-items-center rounded py-5 px-4 bg-light-info d-none">
            {" "}
            <div className="d-flex h-80px w-80px flex-shrink-0 flex-center position-relative ms-3 me-6">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="text-primary h-80px w-80px position-absolute opacity-5"
              >
                {" "}
                <path
                  fill="currentColor"
                  d="M10.2,21.23,4.91,18.17a3.58,3.58,0,0,1-1.8-3.11V8.94a3.58,3.58,0,0,1,1.8-3.11L10.2,2.77a3.62,3.62,0,0,1,3.6,0l5.29,3.06a3.58,3.58,0,0,1,1.8,3.11v6.12a3.58,3.58,0,0,1-1.8,3.11L13.8,21.23A3.62,3.62,0,0,1,10.2,21.23Z"
                ></path>{" "}
              </svg>{" "}
              <i className="ki-duotone ki-design-frame fs-3x text-info  position-absolute">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>{" "}
            </div>{" "}
            <div className="text-gray-700 fw-bold fs-6 lh-lg">
              DataTables is a plug-in for the jQuery Javascript library. It is a
              highly flexible tool, based upon the foundations of progressive
              enhancement, and will add advanced interaction controls to any
              HTML table. For more info see{" "}
              <a href="https://datatables.net/" className="fw-semibold">
                the official site
              </a>
              .
            </div>{" "}
          </div>
          <div className="table-responsive">
            <table
              className="table align-middle table-row-dashed fs-6 gy-4"
              id="grades_table"
            >
              <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-100px">Alumno</th>
                  <th className="text-center min-w-100px">Convocatoria</th>
                  <th className="text-center min-w-150px">Fase General</th>
                  <th className="text-center min-w-100px">Fase Especifica</th>
                  <th className="text-center min-w-100px">Nota Final</th>
                  <th className="text-center min-w-50px">Estado</th>
                  <th className="text-end"></th>
                </tr>
              </thead>

              <tbody className="fw-bold text-gray-600">
                <tr
                  data-datatable-subtable="subtable_template"
                  className="d-none"
                >
                  {/* -- ASIGNATURA */}
                  <td colSpan="2">
                    <div className="d-flex align-items-center">
                      <div className="d-flex flex-column text-muted">
                        <a
                          href="#"
                          className="text-dark text-hover-primary fw-bold"
                          data-datatable-subtable="template_subject"
                        >
                          Nombre
                        </a>
                        <div
                          className="fs-7"
                          data-datatable-subtable="template_announcement"
                        >
                          Fase - convocatoria
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* -- FECHA */}
                  <td className="text-center">
                    <div className="text-dark fs-7">Fecha</div>
                    <div
                      className="text-muted fs-7 fw-bold"
                      data-datatable-subtable="template_exam_date"
                    >
                      Fecha examen
                    </div>
                  </td>

                  {/* -- HORA */}
                  <td className="text-center">
                    <div className="text-dark fs-7">Hora</div>
                    <div
                      className="text-muted fs-7 fw-bold"
                      data-datatable-subtable="template_time"
                    >
                      Inicio - Fin
                    </div>
                  </td>

                  {/* -- NOTA */}
                  <td className="text-center">
                    <div className="text-dark fs-7">Nota</div>
                    <div
                      className="text-muted fs-7 fw-bold"
                      data-datatable-subtable="template_grade"
                    >
                      calificacion
                    </div>
                  </td>

                  {/* -- CALIFICACION */}
                  <td className="text-center">
                    <div className="text-dark fs-7 me-3">Calificacion</div>
                    <div
                      className="text-muted fs-7 fw-bold"
                      data-datatable-subtable="template_status"
                    >
                      Notable, suspenso ,
                    </div>
                  </td>

                  {/* -- .. -- */}
                  <td></td>
                </tr>
                {enrollments &&
                  enrollments.map((enrollment) => {
                    return (
                      <GradesTableRow key={uuidv4()} enrollment={enrollment} />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  enrollments: state.Enrollment.enrollments,
  userRole: state.Auth.user.user_data.rol,
  isSuperUser: state.Auth.user.user_data.is_super_user,
  isAuthenticated: state.Auth.isAuthenticated,
  isStaff: state.Auth.user.user_data.is_staff,
});

export default connect(mapStateToProps, {
  get_enrollments,
})(Grades);
