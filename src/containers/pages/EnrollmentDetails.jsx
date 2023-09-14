import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import DownloadFileButton from "../../components/downloadButton";
import Loader from "../../components/loader";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import Layout from "../../hocs/Layout";
import { get_enrollment } from "../../redux/actions/enrollment";
import { get_student } from "../../redux/actions/student";
import { API_URL } from "../../routers/Api";
import ShowInformation from "../../components/notifications/information";
import {
  HistoryInput,
  IdiomInput,
  LanguageInput,
} from "../../components/enrollment/generalPhase";
import SpecificSubject from "../../components/enrollment/specificSubject";
import Degree from "../../components/enrollment/degree";
import { UserAvatarUrl } from "../../helpers/Media";
import { FormatDateToSpanish } from "../../helpers/DateFormater";
import { EnrollmentBadge } from "../../components/badge";
import { getEnrollmentExamDates } from "../../helpers/General";
import PDFGenerator from "../../components/pdfGenerator";

import { PDFDownloadLink } from '@react-pdf/renderer';
import usePageTitle from "../../hooks/hooks";

function EnrollmentDetail({
  get_enrollment,
  get_student,
  enrollment,
  student,
  user_data,
  userInfo
}) {

  usePageTitle("Matrícula")
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [enrollmentData, setEnrollmentData] = useState({});
  const [notFoundData, setNotFoundData] = useState(false);
  const [examDates, setExamDates] = useState({});
  const [allowed, setAllowed] = useState(true);
  
  const is_student = () => {
    return user_data.rol && user_data.rol === "student";
  };

  const is_institute_staff = () => {
    return user_data.rol && user_data.rol === "institute_staff";
  };


  const params = useParams();
  const enrollment_code = params.codigo;


 

  useEffect(() => {
    get_enrollment(enrollment_code);
    window.scrollTo(0, 0);
    setIsMounted(true);

  }, []);


  // no permitir que cualquiera vea los datos de la matricula
  // solo el alumno, su centro y la secretaria general o administradores

  useEffect(() => {
    if (enrollment) {
      get_student(enrollment.student.student);
      if (student) {
        setStudentData(student);
        setEnrollmentData(enrollment);
      }
      //KTSubscriptionsList.init();

      if ( is_student() && enrollment.student.student !== user_data.id){
        setAllowed(false)
          //return  <Navigate to="/panel" />
      }
    }
  }, [enrollment]);


  useEffect(() => {
    if (isMounted) {
      KTAppSidebar.init();
    }

    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);

  useEffect(() => {
    if (enrollment && student) {
      setTimeout(() => {
        KTComponents.init();
        setLoading(false);
      }, 500);
      setNotFoundData(false);
    }else{

      setTimeout(() => {
        setLoading(false);
      }, 500);
      setNotFoundData(true);

    }

    if (
      student && is_institute_staff() && 
      student.institute !== userInfo.staff_data.institute.name
    ){
      setAllowed(false)
    }

  }, [enrollment, student]);



  const pending_task = () => {
    const required = [
      "copy_id_card",
      "proof_of_payment",
      "photo",
      "school_report",
    ];
  };

  const {
    user,
    high_school_grade,
    institute,
    modality,
    school_report,
    photo,
  } = student ? student : {};

  const {
    code,
    announcement,
    previous_enrollments,
    subjects,
    price,
    enrollment_date,
    status,
    status_id_card,
    status_proof_payment,
    degrees,
    copy_id_card,
    proof_of_payment,
    exam_class_room,
  } = enrollment ? enrollment : {};

  const phase_general_subjects = () => {
    const subjects = enrollment ? enrollment.subjects : null;
    return subjects && subjects.hasOwnProperty("Fase General")
      ? subjects["Fase General"]
      : false;
  };

  const specific_phase_subjects = () => {
    const subjects = enrollment ? enrollment.subjects : null;
    return subjects && subjects.hasOwnProperty("Fase Especifica")
      ? subjects["Fase Especifica"]
      : false;
  };

  const download_school_report = {
    title: is_student() ? "Tu hoja académica" : "Hoja académica",
    file: school_report ? API_URL + school_report : "",
    button_type: "notice",
  };

  const download_id_card = {
    title: is_student()
      ? "Tu documento de identidad"
      : "Documento de identidad",
    file: copy_id_card ? API_URL + copy_id_card : "",
    button_type: "notice",
  };

  const download_proof_payment = {
    title: is_student()
      ? "Tu justificante de pago de matrícula"
      : "Justificante de pago de matrícula",
    file: proof_of_payment ? API_URL + proof_of_payment : "",
    button_type: "notice",
  };

  const IMG_SRC = UserAvatarUrl(photo);

  useEffect(() => {
    if (subjects) {
      const exam_dates = getEnrollmentExamDates(subjects);
      if (exam_dates){
        setExamDates(exam_dates);

      }
    }
  }, [subjects]);

  // Generador de pdf
  const handleDownloadPDF = () => {
   /*  if (enrollmentData) {
     // const pdfBlob = <PDFGenerator data={enrollmentData} />.toBlob(); // Genera el Blob del PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(pdfBlob);
      downloadLink.download = 'comprobante.pdf';
      downloadLink.click();
    } */
  };

  // redireccionar al usuario.
  if(!allowed){
    return  <Navigate to="/panel" />
  }

  return (
    <Layout>
      {
        loading 
        ? 
          ( <Loader /> )

        : (
        ( !notFoundData && 
          studentData &&
          enrollmentData
          ) && (
          <Fragment>
            {/*--begin::Row-->*/}
            <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
              {/*-- begin:: Col -->*/}
              <div className="col-xl-3">
                <div
                  data-kt-sticky="true"
                  data-kt-sticky-name="enrollmentSections"
                  data-kt-sticky-offset="{default: false, xl: '200px'}"
                  data-kt-sticky-width="{lg: '250px', xl: '300px'}"
                  data-kt-sticky-left="auto"
                  data-kt-sticky-top="100px"
                  data-kt-sticky-animation="false"
                  data-kt-sticky-zindex="95"
                >
                  {/*--begin:: Steps card-xl-stretch mb-xl-8
                    card-xl-stretch mb-xl-8-->*/}
                  <div
                    className="card  bg-transparent"
                    style={{ backgroundColor: "transparent" }}
                  >
                    {/*--begin::Header-->*/}
                    <div className="card-header border-0 pt-5">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold text-dark">
                          {is_student()
                            ? "Tu matrícula"
                            : "Detalles de la matricula"}
                        </span>
                        <span className="text-muted mt-1 fw-semibold fs-7">
                          {""}
                        </span>
                      </h3>
                    </div>
                    {/*--end::Header-->*/}

                    {/*--begin::Body-->*/}
                    <div className="card-body pt-5">
                      {/*--begin::Item-->*/}
                      <div className="d-flex align-items-center mb-7">
                        {/*--begin::Symbol-->*/}
                        <div className="symbol symbol-50px me-5 shadow-sm">
                          <span className="symbol-label bg-light-warning">
                            <i
                              className="ki-duotone ki-brifecase-tick fs-2x text-warning"
                            >
                              <i className="path1"></i>
                              <i className="path2"></i>
                              <i className="path3"></i>
                            </i>
                          </span>
                        </div>
                        {/*--end::Symbol-->*/}

                        {/*--begin::Text-->*/}
                        <div className="d-flex flex-column">
                          <a
                            href="#enrollmentInfo"
                            className="text-dark text-hover-primary fs-6 fw-bold"
                            data-kt-scroll-toggle
                          >
                            {is_student()
                              ? "Datos de tu matrícula"
                              : "Datos de la matrícula"}
                          </a>

                          <span className="text-muted">
                            Información y datos de la matrícula.
                          </span>
                        </div>
                        {/*--end::Text-->*/}
                      </div>
                      {/*--end::Item-->*/}
                      {/*--begin::Item-->*/}
                      <div className="d-flex align-items-center mb-7">
                        {/*--begin::Symbol-->*/}
                        <div className="symbol symbol-50px me-5 shadow-sm">
                          <span className="symbol-label bg-light-info">
                            <i className="ki-duotone ki-security-user fs-2x text-info">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </span>
                        </div>
                        {/*--end::Symbol-->*/}

                        {/*--begin::Text-->*/}
                        <div className="d-flex flex-column">
                          <a
                            href="#studentInfo"
                            className="text-dark text-hover-primary fs-6 fw-bold"
                            data-kt-scroll-toggle
                          >
                            {is_student()
                              ? "Tu información"
                              : "Información del estudiante"}
                          </a>

                          <span className="text-muted">
                            Datos personales y académicos
                          </span>
                        </div>
                        {/*--end::Text-->*/}
                      </div>
                      {/*--end::Item-->*/}

                      {/*--begin::Item-->*/}
                      <div className="d-flex align-items-center mb-7">
                        {/*--begin::Symbol-->*/}
                        <div className="symbol symbol-50px me-5 shadow-sm">
                          <span className="symbol-label bg-light-success">
                            <i className="ki-duotone ki-book fs-2x text-success">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                              <span className="path4"></span>
                            </i>
                          </span>
                        </div>
                        {/*--end::Symbol-->*/}

                        {/*--begin::Text-->*/}
                        <div className="d-flex flex-column">
                          <a
                            data-kt-scroll-toggle
                            href="#enrollmentSubjects"
                            className="text-dark text-hover-primary fs-6 fw-bold"
                          >
                            Asignaturas
                          </a>

                          <span className="text-muted">Maximo a elegir: 5</span>
                        </div>
                        {/*--end::Text-->*/}
                      </div>
                      {/*--end::Item-->*/}
                      {/*--begin::Item-->*/}
                      <div className="d-flex align-items-center mb-7">
                        {/*--begin::Symbol-->*/}
                        <div className="symbol symbol-50px me-5 shadow-sm">
                          <span className="symbol-label bg-light-danger">
                            <i className="ki-duotone ki-teacher fs-2x text-danger">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </span>
                        </div>
                        {/*--end::Symbol-->*/}

                        {/*--begin::Text-->*/}
                        <div className="d-flex flex-column">
                          <a
                            data-kt-scroll-toggle
                            href="#enrollmentDegrees"
                            className="text-dark text-hover-primary fs-6 fw-bold"
                          >
                            Carreras
                          </a>

                          <span className="text-muted">Máximo 3..</span>
                        </div>
                        {/*--end::Text-->*/}
                      </div>
                      {/*--end::Item-->*/}
                      {/*--begin::Item-->*/}
                      <div className="d-flex align-items-center mb-7">
                        {/*--begin::Symbol-->*/}
                        <div className="symbol symbol-50px me-5 shadow-sm">
                          <span className="symbol-label bg-light-primary">
                            <i className="ki-duotone ki-document fs-2x text-primary">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </span>
                        </div>
                        {/*--end::Symbol-->*/}

                        {/*--begin::Text-->*/}
                        <div className="d-flex flex-column">
                          <a
                            data-kt-scroll-toggle
                            href="#enrollmentDocs"
                            className="text-dark text-hover-primary fs-6 fw-bold"
                          >
                            Documentos
                          </a>

                          <span className="text-muted">
                            {is_student()
                              ? "Documentación para tu matrícula"
                              : "Documentación de la matrícula."}
                          </span>
                        </div>
                        {/*--end::Text-->*/}
                      </div>
                      {/*--end::Item-->*/}
                    </div>
                    {/*--end::Body-->*/}
                  </div>
                  {/*--end::Steps-->*/}
                  <div
                    className="card  bg-transparent d-none"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-12 p-6">
                      {/*--begin::Icon-->*/}
                      <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                      {/*--end::Icon-->*/}

                      {/*--begin::Wrapper-->*/}
                      <div className="d-flex flex-stack flex-grow-1">
                        {/*--begin::Content-->*/}
                        <div className="fw-semibold">
                          <h4 className="text-gray-900 fw-bold">
                            We need your attention!
                          </h4>

                          <div className="fs-6 text-gray-700">
                            Your payment was declined. To start using tools,
                            please
                            <a
                              href="#"
                              className="fw-bold"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_card"
                            >
                              Add Payment Method
                            </a>
                            .
                          </div>
                        </div>
                        {/*--end::Content-->*/}
                      </div>
                      {/*--end::Wrapper-->*/}
                    </div>
                  </div>
                </div>
              </div>
              {/*-- end::Col -->*/}
              <div className="col-xl-6" id="studentInfo">
                <div className="card mb-xl-8">
                  {/*--begin::Header-->*/}
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold text-dark">
                        {is_student()
                          ? "Tus datos e información académica"
                          : "Datos e información académica"}
                      </span>
                      <span className="text-muted mt-1 fw-semibold fs-7">
                        {""}
                      </span>
                    </h3>
                  </div>
                  {/*--end::Header-->*/}

                  {/*--begin::Card body-->*/}
                  <div className="card-body row">
                    {/*--begin::Col-->*/}
                    <div className="col-md-6">
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="nombre">
                          <i className="ki-duotone ki-profile-circle fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                          <span className="fs-7">Nombre</span>
                        </span>
                        <input
                          readOnly
                          type="text"
                          className="form-control"
                          placeholder="nombre"
                          aria-label="nombre"
                          aria-describedby="nombre"
                          value={user && user.name}
                        />
                      </div>
                      {/*--end::Input group-->*/}
                    </div>
                    {/*--end::Col-->*/}
                    {/*--begin::Col-->*/}
                    <div className="col-md-6">
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="apellidos">
                          <i className="ki-duotone ki-profile-circle fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                          <span className="fs-7">Apellidos</span>
                        </span>
                        <input
                          readOnly
                          value={user && user.last_name}
                          type="text"
                          className="form-control"
                          placeholder="apellidos"
                          aria-label="apellidos"
                          aria-describedby="apellidos"
                        />
                      </div>
                      {/*--end::Input group-->*/}
                    </div>
                    {/*--end::Col-->*/}
                    {/*--begin::Col-->*/}
                    <div className="col-md-6">
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="media">
                          <i className="ki-duotone ki-note fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <span className="fs-7">Media Bachillerato</span>
                        </span>
                        <input
                          readOnly
                          value={user && high_school_grade}
                          type="text"
                          className="form-control"
                          placeholder="media"
                          aria-label="media"
                          aria-describedby="media"
                        />
                      </div>
                      {/*--end::Input group-->*/}
                    </div>
                    {/*--end::Col-->*/}
                    {/*--begin::Col-->*/}
                    <div className="col-md-6">
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="convocatorias">
                          <i className="ki-duotone ki-flag fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <span className="fs-7">Convocatorias Previas</span>
                        </span>
                        <input
                          readOnly
                          value={(user && previous_enrollments) &&  previous_enrollments.length}
                          type="text"
                          className="form-control"
                          placeholder="convocatorias"
                          aria-label="convocatorias"
                          aria-describedby="convocatorias"
                        />
                      </div>
                      {/*--end::Input group-->*/}
                    </div>
                    {/*--end::Col-->*/}

                    {/*-- begin::Col-->*/}
                    <div className="col-md-6">
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="school">
                          <i className="ki-duotone ki-ranking fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                          </i>
                          <span className="fs-7">Instituto</span>
                        </span>
                        <input
                          readOnly
                          value={user && institute}
                          type="text"
                          className="form-control"
                          placeholder="school"
                          aria-label="school"
                          aria-describedby="school"
                        />
                      </div>
                      {/*--end::Input group-->*/}
                      {/*--begin::Input group-->*/}
                      <div className="input-group mb-5 input-group-solid">
                        <span className="input-group-text" id="modality">
                          <i className="ki-duotone ki-ranking fs-1 me-3">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                          </i>
                          <span className="fs-7">Bachillerato</span>
                        </span>
                        <input
                          readOnly
                          value={user && modality.name}
                          type="text"
                          className="form-control"
                          placeholder="modality"
                          aria-label="modality"
                          aria-describedby="modality"
                        />
                      </div>
                      {/*--end::Input group-->*/}
                    </div>
                    {/*-- end::Col -->*/}

                    {/*-- begin::Col-->*/}
                    <div className="col-md-6">
                      {user && school_report ? (
                        <DownloadFileButton data={user && download_school_report} />
                      ) : (
                        <ShowInformation
                          information={{
                            type: "danger",
                            message: "No se ha adjuntado una hoja académica",
                          }}
                        />
                      )}
                    </div>
                    {/*-- end::Col -->*/}
                  </div>
                  {/*--end::Card-body-->*/}
                </div>
                <div
                  className="card mb-xl-8 bg-transparent"
                  id="enrollmentSubjects"
                >
                  {/*--begin::Header-->*/}
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold text-dark">
                        {is_student()
                          ? "Asignaturas que vas a examinar"
                          : "Asignaturas a examinar"}
                      </span>
                      <span className="text-muted mt-1 fw-semibold fs-7">
                        {""}
                      </span>
                    </h3>
                  </div>
                  {/*--end::Header-->*/}
                  <div className="row">
                    {/*-- Face general -->*/}
                    <div className="col-md-12 mb-8">
                      <div className="card">
                        {/*--begin::Header-->*/}
                        <div className="card-header pl-0 pt-5">
                          <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold text-dark">
                              Fase General
                            </span>
                            <span className="text-muted mt-1 fw-semibold fs-7">
                              {""}
                            </span>
                          </h3>
                        </div>
                        {/*--end::Header-->*/}
                        <div className="row card-body">
                          {phase_general_subjects() ? (
                            phase_general_subjects().map((subject) => {
                              return subject.name.includes("Lengua") ? (
                                <LanguageInput
                                  key={subject.subject_id}
                                  data={subject}
                                />
                              ) : subject.name.includes("Historia") ? (
                                <HistoryInput
                                  key={subject.subject_id}
                                  data={subject}
                                />
                              ) : (
                                <IdiomInput
                                  key={subject.subject_id}
                                  data={subject}
                                />
                              );
                            })
                          ) : (
                            <ShowInformation
                              information={{
                                type: "danger",
                                message:
                                  "No se ha elegido asignaturas de la fase general. Esta fase es obligatoria salvo se haya superado previamente.",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/*--Fase especifica -->*/}
                    <div className="col-md-12">
                      <div className="card">
                        {/*--begin::Header-->*/}
                        <div className="card-header pl-0 pt-5">
                          <h3 className="card-title align-items-start flex-column">
                            <span className="card-label fw-bold text-dark">
                              Fase Específica
                            </span>
                            <span className="text-muted mt-1 fw-semibold fs-7">
                              {""}
                            </span>
                          </h3>
                        </div>
                        {/*--end::Header-->*/}
                        <div className="card-body row">
                          {specific_phase_subjects() ? (
                            specific_phase_subjects().map((subject, index) => {
                              return (
                                <SpecificSubject
                                  key={subject.name}
                                  index={index + 1}
                                  subject={subject}
                                />
                              );
                            })
                          ) : (
                            <ShowInformation
                              information={{
                                type: "danger",
                                message:
                                  "No se ha elegido asignaturas de la fase especifica. Esta fase es obligatoria salvo se haya superado previamente.",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12" id="enrollmentDegrees">
                    {/*-- Carreras  -->*/}
                    <div className="card mb-xl-8 ">
                      {/*--begin::Header-->*/}
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold text-dark">
                            Carreras elegidas
                          </span>
                          <span className="text-muted mt-1 fw-semibold fs-7">
                            {""}
                          </span>
                        </h3>
                      </div>
                      {/*--end::Header-->*/}

                      {/*--begin::Card body-->*/}
                      <div className="card-body row gap-1 justify-content-space-between">
                        {degrees && degrees.length ? (
                          degrees.map((degree, index) => {
                            return (
                              <Degree
                                modality={modality && modality.name}
                                degree={degree}
                                key={degree.name}
                                index={index + 1}
                              />
                            );
                          })
                        ) : (
                          <ShowInformation
                            information={{
                              type: "warning",
                              message: "No se ha elegido carreras todavía.",
                            }}
                          />
                        )}
                      </div>
                      {/*--end::Card-body-->*/}
                    </div>
                  </div>
                  <div className="col-md-12" id="enrollmentDocs">
                    {/*-- Documentos -->*/}
                    <div className="card mb-xl-8 ">
                      {/*--begin::Header-->*/}
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold text-dark">
                            Documentos requeridos
                          </span>
                          <span className="text-muted mt-1 fw-semibold fs-7">
                            {""}
                          </span>
                        </h3>
                      </div>
                      {/*--end::Header-->*/}

                      {/*--begin::Card body-->*/}
                      <div className="card-body row">
                        {/*--begin::Col-->*/}
                        <div className="col-md-6">
                          <label className="col-form-label fw-semibold fs-6">
                            <span className="required">
                              Copia de tu documento
                            </span>

                            <span
                              className="ms-1"
                              data-bs-toggle="tooltip"
                              title="Sin el documento de identidad no se puede acceder a las aulas de examen"
                            >
                              <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>{" "}
                              </i>
                            </span>
                          </label>
                          {/*--begin::Input group-->*/}
                          <div className="fv-row">
                            {user && copy_id_card ? (
                              <DownloadFileButton data={user && download_id_card} />
                            ) : (
                              <ShowInformation
                                information={{
                                  type: "danger",
                                  message:
                                    "No se ha adjuntado una copia de documento de identidad",
                                }}
                              />
                            )}
                          </div>
                          {/*--end::Input group-->*/}
                        </div>
                        {/*--begin::Col-->*/}
                        <div className="col-md-6">
                          <label className="col-form-label fw-semibold fs-6">
                            <span className="required">
                              Justificante de Pago
                            </span>

                            <span
                              className="ms-1"
                              data-bs-toggle="tooltip"
                              title="El justificante de pago es un documento que prueba que se ha pagado el importe de la matrícula."
                            >
                              <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>{" "}
                              </i>
                            </span>
                          </label>
                          {/*--begin::Input group-->*/}
                          <div className="fv-row">
                            {user && proof_of_payment ? (
                              <DownloadFileButton
                                data={user && download_proof_payment}
                              />
                            ) : (
                              <ShowInformation
                                information={{
                                  type: "danger",
                                  message:
                                    "No se ha adjuntado un justificante de pago",
                                }}
                              />
                            )}
                          </div>
                          {/*--end::Input group-->*/}
                        </div>
                        {/*--end::Col-->*/}
                      </div>
                      {/*--end::Card-body-->*/}
                    </div>
                  </div>
                </div>
                {/*-- Submit -->*/}
                <div className="card-footer d-flex justify-content-end py-6">
                  <Link
                    to="/matriculas"
                    className="btn btn-light btn-active-light-primary me-2"
                  >
                    Volver
                  </Link>

                  <Link to="/matriculas/modificar/" className="btn btn-primary">
                    Modificar matrícula
                  </Link>
                </div>
                {/*-- end::Submit-->*/}
              </div>
              <div className="col-xl-3" id="enrollmentInfo">
                <div
                  className="card card-flush bg-light mb-0 mb-8"
                  data-kt-sticky="true"
                  data-kt-sticky-name="enrollmentInfo"
                  data-kt-sticky-offset="{default: false, xl: '200px'}"
                  data-kt-sticky-width="{lg: 'inherit', xl: 'inherit'}"
                  data-kt-sticky-left="auto"
                  data-kt-sticky-top="100px"
                  data-kt-sticky-animation="false"
                  data-kt-sticky-zindex="95"
                >
                  {/*<!--begin::Card header-->*/}
                  <div className="card-header">
                    {/*<!--begin::Card title-->*/}
                    <div className="card-title">
                      <h2>Matrícula</h2>
                    </div>
                    {/*<!--end::Card title-->*/}
                  </div>
                  {/*<!--end::Card header-->*/}

                  {/*<!--begin::Card body-->*/}
                  <div className="card-body pt-0 fs-6">
                    {/*<!--begin::Section-->*/}
                    <div className="mb-7">
                      {/*<!--begin::Details-->*/}
                      <div className="d-flex align-items-center">
                        {/*<!--begin::Avatar-->*/}
                        <div className="symbol symbol-60px symbol-circle me-3">
                          <img alt={user && user.name} src={IMG_SRC} />
                        </div>
                        {/*<!--end::Avatar-->*/}

                        {/*<!--begin::Info-->*/}
                        <div className="d-flex flex-column">
                          {/*<!--begin::Name-->*/}
                          <a
                            href="#"
                            className="fs-4 fw-bold text-gray-900 text-hover-primary me-2"
                          >
                            {user && user.name} {user && user.last_name}
                          </a>
                          {/*<!--end::Name-->*/}

                          {/*<!--begin::Email-->*/}
                          <a
                            href="#"
                            className="fw-semibold text-gray-600 text-hover-primary"
                          >
                            {user && user.email}
                          </a>
                          {/*<!--end::Email-->*/}
                        </div>
                        {/*<!--end::Info-->*/}
                      </div>
                      {/*<!--end::Details-->*/}
                    </div>
                    {/*<!--end::Section-->*/}

                    {/*<!--begin::Seperator-->*/}
                    <div className="separator separator-dashed mb-7"></div>
                    {/*<!--end::Seperator-->*/}

                    {/*<!--begin::Section-->*/}
                    <div className="mb-7">
                      {/*<!--begin::Title-->*/}
                      <h5 className="mb-4">Periodo de examenes</h5>
                      {/*<!--end::Title-->*/}

                      {/*<!--begin::Details-->*/}
                      <div className="mb-0">
                        {/*<!--begin::Plan-->*/}
                        <span className="fw-semibold text-gray-600 me-2">
                          Del {FormatDateToSpanish(examDates.startDate)}
                        </span>
                        {/*<!--end::Plan-->*/}

                        {/*<!--begin::Price-->*/}
                        <span className="fw-semibold text-gray-600">
                          al {FormatDateToSpanish(examDates.endDate)}
                        </span>
                        {/*<!--end::Price-->*/}
                      </div>
                      {/*<!--end::Details-->*/}
                    </div>
                    {/*<!--end::Section-->*/}

                    {/*<!--begin::Seperator-->*/}
                    <div className="separator separator-dashed mb-7"></div>
                    {/*<!--end::Seperator-->*/}

                    {/*<!--begin::Section-->*/}
                    <div className="mb-10">
                      {/*<!--begin::Title-->*/}
                      <h5 className="mb-4">Más detalles</h5>
                      {/*<!--end::Title-->*/}

                      {/*<!--begin::Details-->*/}
                      <table className="table fs-6 fw-semibold gs-0 gy-2 gx-2">
                        {/*<!--begin::Row-->*/}
                        <tbody>
                          <tr className="">
                            <td className="text-gray-400">Codigo:</td>
                            <td className="text-gray-800">
                              {" "}
                              <code>{code}</code>{" "}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}

                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Presentado:</td>
                            <td className="text-gray-800">
                              {FormatDateToSpanish(enrollment_date)}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}

                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Estado:</td>
                            <td>
                              <EnrollmentBadge
                                data={{
                                  status_code: status,
                                  type: "enrollment",
                                }}
                              />
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Convocatoria:</td>
                            <td className="text-gray-800">
                              {announcement && announcement.name}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                          {/*<!--begin::Row-->*/}

                          <tr className="">
                            <td className="text-gray-400">
                              Justificante de Pago:
                            </td>
                            <td>
                              <EnrollmentBadge
                                data={{
                                  status_code: status_proof_payment,
                                  type: "document",
                                }}
                              />
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Precio:</td>
                            <td className="text-gray-800">
                              {/*<!--begin::Plan-->*/}
                              <span className="badge badge-info me-2">
                                Oficial
                              </span>
                              {/*<!--end::Plan-->*/}

                              {/*<!--begin::Price-->*/}
                              <span className="fw-semibold text-gray-600">
                                {price} Fcos
                              </span>
                              {/*<!--end::Price-->*/}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                          {/*<!--begin::Row-->*/}

                          <tr className="">
                            <td className="text-gray-400">Documento:</td>
                            <td>
                              <EnrollmentBadge
                                data={{
                                  status_code: status_id_card,
                                  type: "document",
                                }}
                              />
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}

                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Centro de examen:</td>
                            <td className="text-gray-800">
                              {exam_class_room && exam_class_room.examCenter}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                          {/*<!--begin::Row-->*/}
                          <tr className="">
                            <td className="text-gray-400">Aula:</td>
                            <td className="text-gray-800">
                              {exam_class_room && exam_class_room.name}
                            </td>
                          </tr>
                          {/*<!--end::Row-->*/}
                        </tbody>
                      </table>
                      {/*<!--end::Details-->*/}
                    </div>
                    {/*<!--end::Section-->*/}

                    {/*<!--begin::Actions-->*/}
                    <div className="mb-0 d-none">
                      <Link
                        to="/matriculas"
                        className="btn btn-primary"
                        id="kt_subscriptions_create_button"
                      >
                        Edit Subscription
                      </Link>
                    </div>
                    {/*<!--end::Actions-->*/}
                  </div>
                  {/*<!--end::Card body-->*/}
                </div>
              </div>
            </div>
            {/*--end::Row-->*/}
          </Fragment>
        )
      )}
      {
        (!loading && 
          notFoundData &&
          !studentData &&
          !enrollmentData
        ) &&  (                        
        <ShowInformation
          information={{
            type: "danger",
            message: "No se ha encontrado datos para la matricula",
          }}
        />)
      }
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  enrollment: state.Enrollment.enrollment,
  student: state.Student.student,
  isAuthenticated: state.Auth.isAuthenticated,
  user_data: state.Auth.user.user_data,
  userInfo:state.Auth.user
});

export default connect(mapStateToProps, {
  get_enrollment,
  get_student,
})(EnrollmentDetail);
