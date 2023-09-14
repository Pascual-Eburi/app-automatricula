import React, { Fragment, useEffect, useState } from "react";
import $ from "jquery";
import { connect, useDispatch } from "react-redux";
import {
  Link /* Navigate, useNavigate, useParams */,
  Navigate,
} from "react-router-dom";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";

import {
    add_enrollment_grades,
  //add_enrollment,
  get_announcement_enrollments,
  get_enrollment_exams,
} from "../../redux/actions/enrollment";

import ShowInformation from "../../components/notifications/information";
import Loader from "../../components/loader";


import { get_annoucements } from "../../redux/actions/announcement";
import { setAlert } from "../../redux/actions/alert";

function AddGrades({
  userInfo,

  get_annoucements,
  announcements,
  get_announcement_enrollments,
  get_enrollment_exams,
  add_enrollment_grades
}) {
  usePageTitle("Registrar Notas");

  const initialState = {
    announcement: "",
    enrollment: "",
    exams: {},
  };

  const initialEnrollmentData = {};

  const initialFormErrorState = {};
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState(initialFormErrorState);
  const [announcement, setAnnouncement] = useState(null);
  const [enrollments, setEnrollments] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [exams, setExams] = useState(null);
  const [phaseGeneral, setPhaseGeneral] = useState(null);
  const [phaseSpecific, setPhaseSpecific] = useState(null);

  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    get_annoucements();
    setIsMounted(true);
    KTComponents.init();
    //setLoading(false)
  }, []);

  // obtener matriculas de la convocatoria
  useEffect(() => {
    async function get_enrollments() {
      const data = await get_announcement_enrollments(formData.announcement);
      if (data) {
        setEnrollments(data);
        KTComponents.init();
      }
    }

    if (formData.announcement) {
      setPhaseSpecific(null);
      setPhaseGeneral(null);
      setAnnouncement(formData.announcement);
      get_enrollments();
      setFormData((prevFormData) => ({
        ...prevFormData,
        enrollment: "",
        exams: {},
      }));
    }
  }, [formData.announcement]);

  // obtener examenes de la matricula para poner nota
  useEffect(() => {
    async function get_exams() {
      const data = await get_enrollment_exams(formData.enrollment);

      if (data) {
        setExams(data);
        if (data.subjects["Fase General"]) {
          setPhaseGeneral(data.subjects["Fase General"]);
        }
        if (data.subjects["Fase Especifica"]) {
          setPhaseSpecific(data.subjects["Fase Especifica"]);
        }

        for (const phase in data.subjects) {
            const exams = data.subjects[phase];
            if (exams) {
              exams.forEach((e) => {
                const key = `exam_${e.exam.id}`; // Clave
                setFormData((prevState) => ({
                  ...prevState,
                  exams: {
                    ...prevState.exams,
                    [e.exam.id]: e.exam.grade // Actualizar el valor del examen en el objeto exams
                  }
                }));
              });
            }
          }
      }
    }

    if (formData.enrollment) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        exams: {},
      }));
      setPhaseSpecific(null);
      setPhaseGeneral(null);

      get_exams();
      setEnrollment(formData.enrollment);
    }

    KTComponents.init();
  }, [formData.enrollment]);

  useEffect(() => {
    if (isMounted) {
      KTAppSidebar.init();
      KTComponents.init();
    }
    setLoading(false);
    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  let selects = document.querySelectorAll('select[data-control="select2"]');

  useEffect(() => {
    if (!selects) {
      return;
    }

    selects.forEach(function(select) {
      $(select).on("change", function(e) {
        e.stopPropagation();
        const key = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [key]: value });
      });
    });
  });

  /** -------------- Inputs ---------- */

 

  const onChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      exams: {
        ...prevState.exams,
        [name]: value // Actualizar el valor del examen en el objeto exams
      }
    }));
  };

  /** reset form valid estates */
  const resetInvalidStates = () => setFormError(initialFormErrorState);

  /*** form validation ***/


  const validateForm = async (obj) => {
    setValidating(true);
    resetInvalidStates();
    // Verificar si todos los campos son requeridos
    if (!obj.announcement || !obj.enrollment || !obj.exams) {
        dispatch(setAlert('Formulario Invalido ', 'Todos los campos del formulario son obligatorios', 'error'))
      return false;
    }
  
    // Validar notas de los exámenes
    for (const key in obj.exams) {
      const grade = obj.exams[key];
  
      // Verificar si la nota es un número válido entre 0 y 10
      if (isNaN(grade) || grade < 0 || grade > 10) {
        dispatch(setAlert('Formulario Invalido ', 'Las calificaciones tienen que estar entre 0 y 10', 'error'))
        return false;
      }
    }
  
    // Si pasa todas las validaciones, retorna true
    return true;
  }

  const resetForm = () => {
    resetInvalidStates();
    setFormData(initialState);
  };

  /** ------------ form submit ------------ */
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const valid = await validateForm(formData);
    setValidating(false);

    if (!valid) {
      console.log(formError);
      return;
    }
    setSending(true);

    const added = await add_enrollment_grades(formData);
    if (added) {
      resetForm();
    }
    setSending(false);
    //console.log(data)
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/*--begin::Row-->*/}
          <div className="row g-3 g-xl-10 mb-5 mb-xl-10">
            {/*-- begin:: Col -->*/}
            <div className="col-xl-3"></div>
            {/*-- end::Col -->*/}
            <div className="col-xl-6">
              <form onSubmit={(e) => onSubmit(e)}>
                <div className="card mb-xl-8">
                  <div className="card-body">
                    <label
                      htmlFor=""
                      className="col-form-label fw-semibold fs-6 required"
                    >
                      Convocatoria:
                    </label>
                    {/*--begin::Select-->*/}
                    <select
                      onChange={(e) => onChange(e)}
                      name="announcement"
                      className="form-select form-select-solid"
                      data-control="select2"
                      data-placeholder="Selecciona una convocatoria"
                      data-hide-search="false"
                      defaultValue={""}
                    >
                      <option value=""></option>
                      {announcements &&
                        announcements.map((a) => {
                          return (
                            <option
                              value={a.announcement_id}
                              key={a.announcement_id + "_" + a.name}
                            >
                              {a.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                {announcement && (
                  <div className="card mb-xl-8">
                    <div className="card-body">
                      <label
                        htmlFor=""
                        className="col-form-label fw-semibold fs-6 required"
                      >
                        Matricula - Alumno:
                      </label>
                      {/*--begin::Select-->*/}
                      <select
                        onChange={(e) => onChange(e)}
                        name="enrollment"
                        className="form-select form-select-solid"
                        data-control="select2"
                        data-placeholder="Selecciona una matricula"
                        data-hide-search="false"
                        defaultValue={""}
                      >
                        <option value=""></option>
                        {enrollments &&
                          enrollments.map((e) => {
                            return (
                              <option
                                value={e.code}
                                key={e.code + "_" + e.student.name}
                              >
                                {e.code} - {e.student.name}
                              </option>
                            );
                          })}
                      </select>
                      {/*                         {student_error && (
                                <InputFeedback
                                    type="error"
                                    message={student_error}
                                />
                            )} */}
                    </div>
                  </div>
                )}

                {enrollment && (
                  <Fragment>
                    <div className="card mb-xl-8 bg-transparent">
                      {/*--begin::Header-->*/}
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold text-dark">
                            Examenes de la matrícula
                          </span>
                          <span className="text-muted mt-1 fw-semibold fs-7">
                            {""}
                          </span>
                        </h3>
                      </div>
                      {/*--end::Header-->*/}
                      <div className="row">
                        {/*-- Face general -->*/}
                        {phaseGeneral && (
                          <div className="col-md-12 mb-8 ">
                            <div className="card">
                              {/*--begin::Header-->*/}
                              <div className="card-header pl-0 pt-5">
                                <h3 className="card-title align-items-start flex-column">
                                  <span className="card-label fw-bold text-dark">
                                    Fase General
                                  </span>
                                  <span className="text-muted mt-2 fw-semibold fs-7">
                                    {enrollment && " Esta fase es obligatoria"}
                                  </span>
                                </h3>
                              </div>
                              {/*--end::Header-->*/}
                              <div className="row card-body">
                                {/*-- Subject 1: -->*/}

                                {phaseGeneral.map((e) => {
                                
                                const key = `exam_${e.exam.id}`;
                                const value = formData.exams[e.exam.id] || "";
                                 


                                  return (
                                    <div
                                      className="col-sm-12 col-md-4 mb-5"
                                      key={e.exam.exam}
                                    >
                                      <label className="col-form-label fw-semibold fs-6">
                                        <span className="required">
                                          {e.exam.exam}
                                        </span>

                                        <span
                                          className="ms-1"
                                          data-bs-toggle="tooltip"
                                          aria-label="Está asignatura es obligatoría"
                                          title="Está asignatura es obligatoría"
                                        >
                                          <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                          </i>
                                        </span>
                                      </label>
                                      <input
                                        onChange={(e) => onChange(e)}
                                        type="text"
                                        name={e.exam.id}
                                        className={`form-control form-control-lg form-control-solid ${
                                          !enrollment ? "is-invalid" : ""
                                        }`}
                                        placeholder="..."
                                        value={value}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                        {/*--Fase especifica -->*/}

                        {phaseSpecific && (
                          <div className="col-md-12 mb-8 ">
                            <div className="card">
                              {/*--begin::Header-->*/}
                              <div className="card-header pl-0 pt-5">
                                <h3 className="card-title align-items-start flex-column">
                                  <span className="card-label fw-bold text-dark">
                                    Fase Especifica
                                  </span>
                                  <span className="text-muted mt-2 fw-semibold fs-7">
                                    {enrollment && " Esta fase es obligatoria"}
                                  </span>
                                </h3>
                              </div>
                              {/*--end::Header-->*/}
                              <div className="row card-body">
                                {/*-- Subject 1: -->*/}

                                {phaseSpecific.map((e) => {
                                    const key = `exam_${e.exam.id}`;
                                    const value = formData.exams[e.exam.id] || "";

                                  return (
                                    <div
                                      className="col-12 col-sm-12 col-md-6 mb-5"
                                      key={e.exam.exam}
                                    >
                                      <label className="col-form-label fw-semibold fs-6">
                                        <span className="required">
                                          {e.exam.exam}
                                        </span>

                                        <span
                                          className="ms-1"
                                          data-bs-toggle="tooltip"
                                          aria-label="Está asignatura es obligatoría"
                                          title="Está asignatura es obligatoría"
                                        >
                                          <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                            <span className="path1"></span>
                                            <span className="path2"></span>
                                            <span className="path3"></span>
                                          </i>
                                        </span>
                                      </label>
                                      <input
                                        onChange={(e) => onChange(e)}
                                        type="text"
                                        name={e.exam.id}
                                        className={`form-control form-control-lg form-control-solid ${
                                          !enrollment ? "is-invalid" : ""
                                        }`}
                                        placeholder="..."
                                        value={value}
                                      />
                                      {/*                                         {required_error && (
                                                        <InputFeedback
                                                            type="error"
                                                            message={required_error}
                                                        />
                                                        )} */}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/*-- Submit -->*/}
                    <div className="card-footer d-flex justify-content-end py-6">
                      <Link
                        disabled={!sending && !validating ? false : true}
                        to="panel"
                        className="btn btn-light btn-active-light-primary me-2"
                      >
                        Volver
                      </Link>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!sending && !validating ? false : true}
                      >
                        {!sending && !validating && (
                          <span className="indicator-label">
                            {" "}
                            Registrar Notas{" "}
                          </span>
                        )}
                        {sending && (
                          <span className="indicator-progress d-flex">
                            Registrando matrícula...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        )}

                        {validating && (
                          <span className="indicator-progress d-flex">
                            Validando formulario...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                          </span>
                        )}
                      </button>
                    </div>
                    {/*-- end::Submit-->*/}
                  </Fragment>
                )}
              </form>
              {/*               {!checkedEnrolled && (
                <ShowInformation
                  information={{
                    type: "",
                    message:
                      "Seleccione el estudiante que va a ser matriculado.",
                  }}
                />
              )} */}

              {/*               {checkedEnrolled && enrolled_in_annoucement === true && (
                <div className="d-flex flex-column justify-content-center align-items-center gap-8 gap-xl-10">
                  <ShowInformation
                    information={{
                      type: "danger",
                      message: !is_student()
                        ? "El estudiante ya está matriculado en esta convocatoria."
                        : " Ya estás matriculado en esta convocatoria.",
                    }}
                  />
                  {enrolled_code && (
                    <Link
                      to={`/matriculas/${enrolled_code}`}
                      className="btn btn-primary"
                    >
                      Ver matricula
                    </Link>
                  )}
                </div>
              )} */}
            </div>

            <div className="col-xl-3"></div>
          </div>
          {/*--end::Row-->*/}
        </Fragment>
      )}
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  announcements: state.Announcement.announcements,
  open_announcement: state.Announcement.open_announcement,
  userInfo: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_annoucements,
  get_announcement_enrollments,
  get_enrollment_exams,
  add_enrollment_grades
  //add_enrollment
})(AddGrades);
