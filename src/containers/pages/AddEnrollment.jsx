import React, { Fragment, useEffect, useState } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import { Link, /* Navigate, useNavigate, useParams */ 
Navigate} from "react-router-dom";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import { ExtractDateTime, FormatDateToSpanish } from "../../helpers/DateFormater";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";

import { get_modality_degrees } from "../../redux/actions/degrees";
import {
  add_enrollment,
  check_is_enrolled_in_annoucement,
/*   get_enrollment,
  get_enrollments, */
  get_student_enrollments,
} from "../../redux/actions/enrollment";
import { get_student, get_students } from "../../redux/actions/student";
import {
  get_general_phase_subjects,
  get_modality_subjects,
} from "../../redux/actions/subject";
import { API_URL } from "../../routers/Api";
import { UserAvatarUrl } from "../../helpers/Media";
import ShowInformation from "../../components/notifications/information";
import DownloadFileButton from "../../components/downloadButton";
import { EnrollmentBadge } from "../../components/badge";
import Loader from "../../components/loader";
import DropzoneUploader from "../../components/dropzoneUploader";
import { determinePhaseRequired, generateUniqueCode } from "../../helpers/General";
import InputFeedback from "../../components/inputFeedback";

function AddEnrollment({
  enrollments,
  check_is_enrolled_in_annoucement,
  enrolled_in_annoucement,
  enrolled_code,
  get_student_enrollments,
  open_announcement,
  student,
  students,
  get_student,
  get_students,
  get_general_phase_subjects,
  get_modality_subjects,
  get_modality_degrees,
  degrees,
  modality_subjects,
  general_phase_subjects,
  userInfo,
  add_enrollment
}) {
  usePageTitle("Presentar Matrícula");
  const is_student = () => {
    return userInfo.user_data.rol && userInfo.user_data.rol === "student";
  };
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [enrollmentOwner, setEnrollmentOwner] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [checkedEnrolled, SetCheckEnrolled] = useState(false);
  const [generalPhaseRequired, setGeneralPhaseRequired] = useState(null);
  const [specificPhaseRequired, setSpecificPhaseRequired] = useState(null);
  const [highestGeneralPhase, setHighestGeneralPhase] = useState(null);
  const [highestSpecificPhase, setHighestSpecificPhase] = useState(null);
  const [enabledGeneralPhase, setEnabledGeneralPhase] = useState(true);
  const [enabledSphecificPhase, setEnabledSpecificPhase] = useState(true);
  const [enrollmentAdded, setEnrollmentAdded] = useState(false);

  const initialState = {
    code: null,
    student: is_student() ? userInfo.user_data.id : '',
    required: '',
    required_id: null,
    story: '',
    language: '',
    specific_1: '',
    specific_2: '',
    degrees: [],
    proof_of_payment: [],
    copy_id_card: [],
    price: 4500,
    announcement: open_announcement
      ? open_announcement[0].announcement_id
      : null,
    status: 0,
    status_id_card: 0,
    status_proof_payment: 0,
  };

  const initialEnrollmentData = {};

  const initialFormErrorState = {
    code_error: null,
    student_error: null,
    required_error: null,
    story_error: null,
    language_error: null,
    specific_1_error: '',
    specific_2_error: null,
    degrees_error: null,
    proof_of_payment_error: null,
    copy_id_card_error: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [formError, setFormError] = useState(initialFormErrorState);
  const [enrollmentCode, setEnrollmentCode] = useState(null);

  const {
    code_error,
    student_error,
    required_error,
    story_error,
    language_error,
    specific_1_error,
    specific_2_error,
    degrees_error,
    proof_of_payment_error,
    copy_id_card_error,
  } = formError || {};

  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, [pathname]);

  useEffect(() => {
    if (is_student()) {
      setEnrollmentOwner(userInfo.user_data.id);
      get_student(userInfo.user_data.id);
    } else {
      get_students();
    }
    KTComponents.init();
    window.scrollTo(0, 0);
    setIsMounted(true);
    //setLoading(false)
  }, []);

  useEffect(() => {

    if (formData.student) {
      get_student(formData.student);
      SetCheckEnrolled(null);
      //setFormData(initialState);
    } else {
      get_student(0);
      if (!student) {
        SetCheckEnrolled(null);
      }
    }



  }, [formData.student]);

  useEffect(() => {
    
    if (student && open_announcement) {
      const id = open_announcement[0].announcement_id;

      async function fetchCheck() {
        await Promise.all([
          check_is_enrolled_in_annoucement(formData.student, id),
        ]);

        SetCheckEnrolled(true);
        KTComponents.init();
      }

      fetchCheck();
    }
    if (!student) {
      SetCheckEnrolled(null);
    }
  }, [student, formData.student]);

  useEffect(() => {

    async function fetchRequiredPhase() {
      const requireds = await determinePhaseRequired(enrollments);
      const general = requireds["Fase General"];
      const specific = requireds["Fase Especifica"];
      setGeneralPhaseRequired(general.required);
      setHighestGeneralPhase(general.higestEnrollmentGrade);
      setSpecificPhaseRequired(specific.required);
      setHighestSpecificPhase(specific.higestEnrollmentGrade);
      setEnabledGeneralPhase(general.required);
      setEnabledSpecificPhase(specific.required);

      // codigo matricula


    }

    //const requireds =
    if (checkedEnrolled && enrolled_in_annoucement === false && enrollments) {
      fetchRequiredPhase();
    } else {
      
    }
  }, [enrollments]);

  useEffect(() => {

    if (!student) {
      SetCheckEnrolled(null);
    }
    if (checkedEnrolled) {
      setIsEnrolled(enrolled_in_annoucement);
    } else {
      setIsEnrolled(null);
    }

  }, [student]);

  useEffect(() => {

    if (checkedEnrolled && enrolled_in_annoucement === false) {
      get_general_phase_subjects();
      get_modality_subjects(student.modality.id);
      get_modality_degrees(student.modality.id);

      if (student.number_of_enrollments >= 1) {
        // verficar que fase ha superado
        get_student_enrollments(student.user.code);
      } else {
        setGeneralPhaseRequired(true);
        setSpecificPhaseRequired(true);
      }


      
    }

    KTComponents.init();

    if (!student) {
      SetCheckEnrolled(null);
      return
    }

  }, [checkedEnrolled]);

  useEffect(()=>{
    if (general_phase_subjects){
      general_phase_subjects.forEach((subject) => {
        if (subject.subject_type === 'obligatoria'){
          setFormData({...formData, 
            required: subject.name,
            required_id: subject.subject_id
          })
        }

    });
    }

  }, [general_phase_subjects, checkedEnrolled])




  useEffect(() => {
    if (isMounted) {
      KTAppSidebar.init();
    }
    setLoading(false);
    return () => {
      setIsMounted(false);
    };
  }, [isMounted]);


  useEffect(() => {
    async function GetEnrollmentCode(institute, student_code, announcement){
        const code = await generateUniqueCode(institute, student_code, announcement);
        setFormData({...formData, code: code })
    }

    if (student && open_announcement){ 
      const institute = student.institute;
      const announcement = open_announcement[0].name;
      const student_code = student.user.code;

      GetEnrollmentCode(institute, student_code, announcement);


   }
   

  }, [student, open_announcement])

  let selects = document.querySelectorAll('select[data-control="select2"]');

  useEffect(() => {
    if (!selects){ return }

    selects.forEach(function(select) {
      $(select).on("change", function(e) {
        e.stopPropagation();
        const key = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [key]: value });
      });
    });

  },[selects]);


  const {
    user,
    high_school_grade,
    institute,
    modality,
    school_report,
    photo,
  } = student ? student : {};

  const download_school_report = {
    title: is_student() ? "Tu hoja académica" : "Hoja académica",
    file: school_report ? API_URL + school_report : "",
    button_type: "notice",
  };

  const IMG_SRC = UserAvatarUrl(photo);

  /** -------------- Inputs ---------- */

  /** dropzone */
  const handleFileAdded = (file, inputName) => {
    // Actualizar el estado formData según el inputName
    setFormData((prevData) => ({
      ...prevData,
      [inputName]: file,
    }));

    
  };

  const handleFileRemoved = (file, inputName) => {
    // Actualizar el estado formData según el inputName
    if (formData[inputName] && formData[inputName].includes(file)) {
      setFormData((prevData) => ({
        ...prevData,
        [inputName]: prevData[inputName].filter((f) => f !== file),
      }));
    } else {
      return;
    }
  };

  /** Habilitar phases */
  const enableGeneralPhase = () => {
    setEnabledGeneralPhase(!enabledGeneralPhase);
    setGeneralPhaseRequired(!generalPhaseRequired)
    setTimeout(function(){
      KTComponents.init();

    }, 200)
  }
  const enableSpecificPhase = () => {
    setEnabledSpecificPhase(!enabledSphecificPhase);
    setSpecificPhaseRequired(!specificPhaseRequired);
    setTimeout(function(){
      KTComponents.init();

    }, 200)
  };

  /** onChanges handlers  -------------- */
  const onChange = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };



  const handleDegreeChange = (event) => {
    const { value, checked } = event.target;

  
    // Verificar si el grado está siendo agregado o eliminado de la lista
    if (checked) {
      // Agregar el grado a la lista
      setFormData((prevData) => ({
        ...prevData,
        degrees: [...prevData.degrees, value],
      }));
    } else {
      // Eliminar el grado de la lista
      setFormData((prevData) => ({
        ...prevData,
        degrees: prevData.degrees.filter((degree) => degree !== value),
      }));
    }
  };

  /** reset form valid estates */
  const resetInvalidStates = () => setFormError(initialFormErrorState)

  /*** form validation ***/
  const validateForm = async () => {
    setValidating(true);
    resetInvalidStates();
    let errors = 0;
    const general_phase_inputs = ['required_id', 'language', 'story'];
    const specific_phase_inputs = ['specific_1', 'specific_2'];

    for(const input in formData){
      const key = `${input}_error`;
      const value = formData[input];

      if ( general_phase_inputs.includes(input)){
        if (!generalPhaseRequired){ continue; }

        if (value === null || value === undefined  || value === ''){
          const error = 'Este campo es requerido';
          // fese general obligatoria. todos los imputs tienen que estar
          /* setFormError({...formError, [key]: error }) */
          setFormError((prevData) => ({
            ...prevData,
            [key]: error,
          }));

          errors++;
        }
        
        
      }else if (specific_phase_inputs.includes(input)){
        if (!specificPhaseRequired){ continue; }

        if (value === null || value === undefined || value === ''){
          const error = 'Este campo es requerido';
          // fase obligatoria. todos los imputs tienen que estar
          //setFormError({...formError, [input]: error })
          setFormError((prevData) => ({
            ...prevData,
            [key]: error,
          }));


          errors++
        }

      }else if (Array.isArray(value)) {
        if (value.length === 0){
          const error = 'Este campo es requerido';
          // fese general obligatoria. todos los imputs tienen que estar

            setFormError((prevData) => ({
              ...prevData,
              [key]: error,
            }));

          errors++
        }

      } else{

        if (value === null || value === undefined || value === ''){
          const error = 'Este campo es requerido';
          // fese general obligatoria. todos los imputs tienen que estar

            setFormError((prevData) => ({
              ...prevData,
              [key]: error,
            }));

          errors++
        }
      }

    }

    return errors === 0;
  }

const resetForm = () => {
  resetInvalidStates();
  setFormData(initialState);
  SetCheckEnrolled(false);
  // reset dropzone
  const dropzone_inputs = document.querySelectorAll('.dropzone');
  dropzone_inputs.forEach((d) =>{
    if(d.dropzone){ d.dropzone.removeAllFiles() }
  })


}

  const extractEnrolmentData = async () => {
    const data = {
      code: null, 
      student: null, 
      degrees: null, 
      proof_of_payment: null, 
      copy_id_card: null, 
      price: null, 
      announcement: null,
      general_phase: true,
      specific_phase: true
    };

    const { code, student, degrees, proof_of_payment, copy_id_card, price, announcement, ...res} = formData;

    data.code = code;
    data.student = student;
    data.degrees = degrees;
    data.announcement = announcement;
    data.copy_id_card = copy_id_card;
    data.proof_of_payment = proof_of_payment;
    data.price = price;

    if (generalPhaseRequired || enabledGeneralPhase || specificPhaseRequired || enabledSphecificPhase){
      data['subjects'] = []; // crar array de asignaturas

    }

    if(generalPhaseRequired || enabledGeneralPhase ){
      
      data['subjects'].push(res.required_id);
      data['subjects'].push(res.story);
      data['subjects'].push(res.language);

    }else{
      data.general_phase = false;
    }

    if(specificPhaseRequired || enabledGeneralPhase ){
      data['subjects'].push(res.specific_1);
      data['subjects'].push(res.specific_2);
    }else{
      data.specific_phase = false;
    }

    return data;

  }


  /** ------------ form submit ------------ */
  const onSubmit = async (e) => {
    e.preventDefault();
    //console.log(formData)
    const valid = await validateForm();
    setValidating(false);
    if(!valid){ console.log(formError); return }
    setSending(true);
    const data = await extractEnrolmentData();
    console.log(data)
    setEnrollmentCode(data.code);
    const added = await add_enrollment(data);
    if(added){
      resetForm();
      setTimeout(function(){
        setEnrollmentAdded(true)

      }, 3000)
      
    }
    setSending(false)
    //console.log(data)


   
  }

  if (enrollmentAdded && enrollmentCode){

    return <Navigate to={`/matriculas/${enrollmentCode}`} /> 
  }


  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        
          !open_announcement 
          ? 
            (
              <ShowInformation
              information={{
                type: "info",
                message: "No hay ninguna convocatoria abierta",
              }}
            />
            )
          :
            (
              <Fragment>
                {/*--begin::Row-->*/}
                <div className="row g-3 g-xl-10 mb-5 mb-xl-10">
                  {/*-- begin:: Col -->*/}
                  <div className="col-xl-3">
                    <div
                      data-kt-sticky="true"
                      data-kt-sticky-name="enrollmentSections"
                      data-kt-sticky-offset="{default: false, xl: '200px'}"
                      data-kt-sticky-width="{lg: 'inherit', xl: 'inherit'}"
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
                              Tu matrícula
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
                                href="#"
                                className="text-dark text-hover-primary fs-6 fw-bold"
                              >
                                Tu información
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
                                href="#"
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
                                href="#"
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
                                href="#"
                                className="text-dark text-hover-primary fs-6 fw-bold"
                              >
                                Documentos
                              </a>
      
                              <span className="text-muted">
                                Documentación para tu matricula
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
                  <div className="col-xl-6">
                    <form onSubmit={(e) => onSubmit(e)}>
                      {!is_student() && (
                        <div className="card mb-xl-8">
                          <div className="card-body">
                            <label
                              htmlFor=""
                              className="col-form-label fw-semibold fs-6 required"
                            >
                              Alumno:
                            </label>
                            {/*--begin::Select-->*/}
                            <select
                              onChange={(e) => onChange(e)}
                              name="student"
                              className="form-select form-select-solid"
                              data-control="select2"
                              data-placeholder="Selecciona un alumno"
                              data-hide-search="false"
                              defaultValue={formData.student}
                            >
                              <option value=""></option>
                              {students &&
                                students.map((student) => {
                                  return (
                                    <option
                                      value={student.user.code}
                                      key={student.user.name + "_" + student.user.code}
                                    >
                                      {student.user.name} {student.user.last_name}
                                    </option>
                                  );
                                })}
                            </select>
                            {student_error && (
                                    <InputFeedback
                                      type="error"
                                      message={student_error}
                                    />
                                )}
                            {/*--end::Select-->*/}
                          </div>
                        </div>
                      )}
      
                      {(checkedEnrolled && enrolled_in_annoucement === false) && (
                          <Fragment>
                          <div className="card mb-xl-8">
                            {/*--begin::Header-->*/}
                            <div className="card-header border-0 pt-5">
                              <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-dark">
                                  Tus datos e información académica
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
                                    value={student && student.user.name}
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
                                    type="text"
                                    readOnly
                                    className="form-control"
                                    placeholder="..."
                                    aria-label="apellidos"
                                    aria-describedby="apellidos"
                                    value={student && student.user.last_name}
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
                                    type="text"
                                    readOnly
                                    className="form-control"
                                    placeholder="...."
                                    aria-label="media"
                                    aria-describedby="media"
                                    value={high_school_grade}
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
                                    type="text"
                                    readOnly
                                    className="form-control"
                                    placeholder="...."
                                    value={student && student.number_of_enrollments}
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
                                  <span className="input-group-text" id="centro">
                                    <i className="ki-duotone ki-ranking fs-1 me-3">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      <span className="path3"></span>
                                      <span className="path4"></span>
                                    </i>
                                    <span className="fs-7">Instituto</span>
                                  </span>
                                  <input
                                    type="text"
                                    readOnly
                                    className="form-control"
                                    placeholder="..."
                                    aria-label="centro"
                                    aria-describedby="centro"
                                    value={institute}
                                  />
                                </div>
                                {/*--end::Input group-->*/}
                                {/*--begin::Input group-->*/}
                                <div className="input-group mb-5 input-group-solid">
                                  <span className="input-group-text">
                                    <i className="ki-duotone ki-ranking fs-1 me-3">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      <span className="path3"></span>
                                      <span className="path4"></span>
                                    </i>
                                    <span className="fs-7">Bachillerato</span>
                                  </span>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="..."
                                    aria-label="modalidad"
                                    aria-describedby="modalidad"
                                    value={modality.name}
                                    readOnly
                                  />
                                </div>
                                {/*--end::Input group-->*/}
                              </div>
                              {/*-- end::Col -->*/}
      
                              {/*-- begin::Col-->*/}
                              <div className="col-md-6">
                                {school_report ? (
                                  <DownloadFileButton data={download_school_report} />
                                ) : (
                                  <ShowInformation
                                    information={{
                                      type: "warning",
                                      message: "Seleccione el estudiante",
                                    }}
                                  />
                                )}
                              </div>
                              {/*-- end::Col -->*/}
                            </div>
                            {/*--end::Card-body-->*/}
                          </div>
                          <div className="card mb-xl-8 bg-transparent">
                            {/*--begin::Header-->*/}
                            <div className="card-header border-0 pt-5">
                              <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-dark">
                                  {is_student()
                                    ? "Asignaturas que vas a examinar"
                                    : "Asignaturas que va a examinar el alumno"}
                                </span>
                                <span className="text-muted mt-1 fw-semibold fs-7">
                                  {""}
                                </span>
                              </h3>
                            </div>
                            {/*--end::Header-->*/}
                            <div className="row">
                              {/*-- Face general -->*/}
                              <div className="col-md-12 mb-8 ">
                                <div className="card">
                                  {/*--begin::Header-->*/}
                                  <div className="card-header pl-0 pt-5">
                                    <h3 className="card-title align-items-start flex-column">
                                      <span className="card-label fw-bold text-dark">
                                        Fase General
                                      </span>
                                      <span className="text-muted mt-2 fw-semibold fs-7">
                                        {generalPhaseRequired === true &&
                                          " Esta fase es obligatoria"}
      
                                        {generalPhaseRequired === false && (
                                          <span className="p-3">
                                            {" "}
                                            Fase superada en la convocatoria de{" "}
                                            <code>
                                              {" "}
                                              {highestGeneralPhase.announcement}{" "}
                                            </code>{" "}
                                            con un nota de{" "}
                                            <code> {highestGeneralPhase.grade} </code>.{" "}
                                          </span>
                                        )}
                                      </span>
                                    </h3>
                                  </div>
                                  {/*--end::Header-->*/}
                                  <div className="row card-body">
                                    {generalPhaseRequired === true && (
                                      <ShowInformation
                                        information={{
                                          type: "info",
                                          message:
      /*                                       student.number_of_enrollments >= 1
                                              ? is_student()
                                                ? "No has superado esta fase todavía"
                                                : "El alumno no ha superado esta fase todavía. "
                                              : */ is_student()
                                              ? "Esta fase es obligaria. Tienes que presentarte."
                                              : "Fase obligatoria. El alumno tiene que presentarse.",
                                        }}
                                      />
                                    )}
      
                                    {generalPhaseRequired === false && (
                                      <ShowInformation
                                        information={{
                                          type: "success",
                                          message: is_student()
                                            ? "Ya has superado esta fase. No es obligatoria"
                                            : "El alumno ya ha superado esta fase. No es obligatoria. ",
                                        }}
                                      />
                                    )}
                                    {/*-- Subject 1: -->*/}
      
                                    {
                                      enabledGeneralPhase 
                                      ?
                                        (
                                          <Fragment>
                                            <div className="col-12 mb-5">
                                              <label className="col-form-label fw-semibold fs-6">
                                                <span className="required">
                                                  Asignatura obligatoria
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
                                                readOnly
                                                disabled
                                                type="text"
                                                name="required"
                                                className={`form-control form-control-lg form-control-solid ${required_error ? 'is-invalid': ''}`}
                                                placeholder="..."
                                                defaultValue={formData.required}
                                              />
                                              {required_error && (
                                                <InputFeedback
                                                  type="error"
                                                  message={required_error}
                                                />
                                              )}
                                            </div>
      
                                            <div className="col-md-6 mb-5">
                                              <label
                                                htmlFor=""
                                                className="col-form-label fw-semibold fs-6"
                                              >
                                                Idioma
                                              </label>
                                              {/*--begin::Select-->*/}
                                              <select
                                                name="language"
                                                className={`form-select form-select-solid ${language_error ? '': ''}`}
                                                data-control="select2"
                                                data-placeholder="Elige una opcion"
                                                data-hide-search="true"
                                                onChange={(e) => onChange(e)}
                                                value={formData.language}
                                              >
                                                <option value=""></option>
                                                {general_phase_subjects &&
                                                  general_phase_subjects.map((subject) => {
                                                    return (
                                                      subject.category &&
                                                      subject.category.name === "Idioma" && (
                                                        <option
                                                          value={subject.subject_id}
                                                          key={subject.name}
                                                        >
                                                          {subject.name}
                                                        </option>
                                                      )
                                                    );
                                                  })}
                                              </select>
                                              {language_error && (
                                                <InputFeedback
                                                  type="error"
                                                  message={language_error}
                                                />
                                              )}
                                            </div>
      
                                            {/*-- Subject 3 -->*/}
                                            <div className="col-md-6 mb-5">
                                              <label
                                                htmlFor=""
                                                className="col-form-label fw-semibold fs-6"
                                              >
                                                Historia
                                              </label>
                                              {/*--begin::Select-->*/}
                                              <select
                                                name="story"
                                                value={formData.story}
                                                onChange={(e) => onChange(e)}
                                                className={`form-select form-select-solid ${story_error ? '': ''}`}
                                                data-control="select2"
                                                data-placeholder="Elige una opción"
                                                data-hide-search="true"
                                              >
                                                <option value=""></option>
                                                {general_phase_subjects &&
                                                  general_phase_subjects.map((subject) => {
                                                    return (
                                                      subject.category &&
                                                      subject.category.name === "Historia" && (
                                                        <option
                                                          value={subject.subject_id}
                                                          key={subject.name}
                                                        >
                                                          {subject.name}
                                                        </option>
                                                      )
                                                    );
                                                  })}
                                              </select>
                                              {story_error && (
                                                <InputFeedback
                                                  type="error"
                                                  message={story_error}
                                                />
                                              )}
                                            </div>
      
                                          </Fragment>
                                        )
                                      :
                                        (
                                          <div className="col-12 p-8 d-flex justify-content-center align-items-center flex-column gap-4">
                                                                                
                                            <span className="p-3 d-block text-muted">
                                            
                                                Habilita esta fase si quiere presentarse de nuevo. No habilite esta fase si no está seguro.
                                            
                                          </span>
                                            <button className="btn btn-success mb-5 mt-5" onClick={enableGeneralPhase}>
                                              {
                                                is_student() ?
                                                "Volver a presentarme":
                                                "El alumno se presenta de nuevo."
                                              }
                                            </button>
      
                                          </div>
                                        )
                                    }
                                  </div>
                                </div>
                              </div>
                              {/*--Fase especifica -->*/}
                              <div className="col-md-12 ">
                                <div className="card">
                                  {/*--begin::Header-->*/}
                                  <div className="card-header pl-0 pt-5">
                                    <h3 className="card-title align-items-start flex-column">
                                      <span className="card-label fw-bold text-dark">
                                        Fase Específica
                                      </span>
                                      <span className="text-muted mt-2 fw-semibold fs-7">
                                        {specificPhaseRequired === true &&
                                          " Esta fase es obligatoria"}
      
                                        {specificPhaseRequired === false && (
                                          <span className="p-3 ">
                                            {" "}
                                            Fase superada en la convocatoria de{" "}
                                            <code>
                                              {" "}
                                              {highestSpecificPhase.announcement}{" "}
                                            </code>{" "}
                                            con un nota de{" "}
                                            <code> {highestSpecificPhase.grade} </code>.{" "}
                                          </span>
                                        )}
                                      </span>
                                    </h3>
                                  </div>
                                  {/*--end::Header-->*/}
                                  <div className="card-body">
                                    {specificPhaseRequired === true && (
                                      <ShowInformation
                                        information={{
                                          type: "info",
                                          message:
      /*                                       student.number_of_enrollments >= 1
                                              ? is_student()
                                                ? "No has superado esta fase todavía"
                                                : "El alumno no ha superado esta fase todavía. "
                                              : */ is_student()
                                              ? "Esta fase es obligaria. Tienes que presentarte."
                                              : "Fase obligatoria. El alumno tiene que presentarse."
                                        }}
                                      />
                                    )}
                                    {
                                      enabledSphecificPhase
                                      ?
                                        (
                                          <div className="row">
                                          {/*-- Subject 1-->*/}
                                          <div className="mb-5 col-md-6">
                                            <label
                                              htmlFor=""
                                              className="col-form-label fw-semibold fs-6"
                                            >
                                              Asignatura 1:
                                            </label>
                                            {/*--begin::Select-->*/}
                                            <select
                                              id="specific_1"
                                              name="specific_1"
                                              onChange={(e) => onChange(e)}
                                              value={formData.specific_1}
                                              className={`form-select form-select-solid `}
                                              data-control="select2"
                                              data-placeholder="Elige"
                                              data-hide-search="false"
                                            >
                                              <option value=""></option>
                                              {modality_subjects &&
                                                modality_subjects.map((subject) => {
                                                  return (
                                                    /* (formData.especifica_2 !== subject.subject_id) && ( */
                                                    <option
                                                      value={subject.subject_id}
                                                      key={`especifica_1_${subject.name}`}
                                                    >
                                                      {subject.name}
                                                    </option>
                                                  );
      
                                                  /* ); */
                                                })}
                                            </select>
                                            {specific_1_error && (
                                              <InputFeedback
                                                type="error"
                                                message={specific_1_error}
                                              />
                                            )}
                                          </div>
      
                                          {/*-- Subject 2 -->*/}
                                          <div className="mb-5 col-md-6">
                                            <label
                                              htmlFor=""
                                              className="col-form-label fw-semibold fs-6"
                                            >
                                              Asignatura 2
                                            </label>
                                            {/*--begin::Select-->*/}
                                            <select
                                              id="specific_2"
                                              name="specific_2"
                                              onChange={(e) => onChange(e)}
                                              value={formData.specific_2}
                                              className={`form-select form-select-solid`}
                                              data-control="select2"
                                              data-placeholder="Elige"
                                              data-hide-search="false"
                                            >
                                              <option value=""></option>
                                              {modality_subjects &&
                                                modality_subjects.map((subject) => {
                                                  return (
                                                    /* ( formData.especifica_1 && formData.especifica_1 !== subject.subject_id) && ( */
                                                    <option
                                                      value={subject.subject_id}
                                                      key={`especifica_2_${subject.name}`}
                                                    >
                                                      {subject.name}
                                                    </option>
                                                  );
                                                  /* ); */
                                                })}
                                            </select>
                                            {specific_2_error && (
                                              <InputFeedback
                                                type="error"
                                                message={specific_2_error}
                                              />
                                            )}
                                          </div>
      
                                          </div>
                                        ) 
                                      :  
                                        (
                                          <div className="col-12 p-8 d-flex justify-content-center align-items-center flex-column gap-4">
                                                                                
                                            <span className="p-3 d-block text-muted">
                                            
                                                Habilita esta fase si quiere presentarse de nuevo. No habilite esta fase si no está seguro.
                                            
                                          </span>
                                          <button className="btn btn-success mb-5 mt-5" onClick={enableSpecificPhase}>
                                            {
                                                is_student() ?
                                                "Volver a presentarme":
                                                "El alumno se presenta de nuevo."
                                              }
                                          </button>
                                          </div>
                                        )
      
      
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* carreras */}
                          <div className="card mb-xl-8">
                            {/*--begin::Header-->*/}
                            <div className="card-header border-0 pt-5">
                              <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-dark">
                                  {is_student()
                                    ? "Carreras que quieres estudiar"
                                    : "Carreras que quiere estudiar el alumno"}
                                </span>
                                <span className="text-muted mt-1 fw-semibold fs-7">
                                  {""}
                                </span>
                              </h3>
                            </div>
                            {/*--end::Header-->*/}
                            <div className="card-body row">
                              {degrees &&
                                degrees.map((degree) => {
                                  return (
                                    <div className="col p-6" key={degree.name}>
                                      <label data-kt-button="true" htmlFor={degree} className={`d-flex flex-stack mb-5 cursor-pointer btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start ${degrees_error ? 'is-invalid': ''}`}>
                                        <span className="d-flex align-items-center me-2">
                                          <span className="symbol symbol-50px me-6">
                                            <span className="symbol-label bg-light-primary">
                                              <i className="ki-duotone ki-compass fs-1 text-primary">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                              </i>{" "}
                                            </span>
                                          </span>
      
                                          <span className="d-flex flex-column">
                                            <span className="fw-bold fs-6">
                                              { degree.name }
                                            </span>
                                            <span className="fs-7 text-muted">
                                            Rama de Bachillerato: { student.modality.name }
                                            </span>
                                          </span>
                                        </span>
      
                                        <span className="form-check form-check-custom form-check-solid">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            /* checked= {formData.degrees.includes(degree.degree_id)} */
                                            name="degree"
                                            value={degree.degree_id}
                                            id={degree.name}      
                                            onChange={handleDegreeChange}
      
                                          />
                                        </span>
                                      </label>
                                    </div>
                                  );
                                })}
      
                                {degrees_error && (
                                  <div className="col-12 mt-3">
                                    <InputFeedback
                                      type="error"
                                      message={degrees_error}
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                          {/*-- Documentos -->*/}
                          <div className="card mb-xl-8">
                            {/*--begin::Header-->*/}
                            <div className="card-header border-0 pt-5">
                              <h3 className="card-title align-items-start flex-column">
                                <span className="card-label fw-bold text-dark">
                                  Documentación requerida
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
                                    Copia de documento de identidad
                                  </span>
      
                                  <span
                                    className="ms-1"
                                    data-bs-toggle="tooltip"
                                    aria-label="Es obligatorio presentar este documento"
                                    title="Es obligatorio presentar este documento"
                                  >
                                    <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      <span className="path3"></span>{" "}
                                    </i>
                                  </span>
                                </label>
                                {/*--begin::Input group-->*/}
                                <div className={`fv-row ${copy_id_card_error ? 'is-invalid': ''}`}>
                                  {/*--begin::Dropzone-->*/}
                                  <DropzoneUploader
                                    inputName="copy_id_card"
                                    maxFiles={1}
                                    maxFilesize={10}
                                    acceptedFileTypes={[
                                      ".pdf",
                                      ".doc",
                                      ".docx",
                                      ".odt",
                                    ]}
                                    handleFileAdded={handleFileAdded}
                                    handleFileRemoved={handleFileRemoved}
                                  />
                                  {/*--end::Dropzone-->*/}
                                </div>
      
                                {copy_id_card_error && (
                                    <InputFeedback
                                      type="error"
                                      message={copy_id_card_error}
                                    />
                                )}
                              </div>
                              {/*--begin::Col-->*/}
                              <div className="col-md-6">
                                <label className="col-form-label fw-semibold fs-6">
                                  <span className="required">Justificante de Pago</span>
      
                                  <span
                                    className="ms-1"
                                    data-bs-toggle="tooltip"
                                    aria-label="Es obligatorio presentar este documento"
                                    title="Es obligatorio presentar este documento"
                                  >
                                    <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      <span className="path3"></span>{" "}
                                    </i>
                                  </span>
                                </label>
                                {/*--begin::Input group-->*/}
                                <div className={`fv-row ${proof_of_payment_error ? 'is-invalid': ''}`}>
                                  {/*--begin::Dropzone-->*/}
                                  <DropzoneUploader
                                    inputName="proof_of_payment"
                                    maxFiles={1}
                                    maxFilesize={10}
                                    acceptedFileTypes={[
                                      ".pdf",
                                      ".doc",
                                      ".docx",
                                      ".odt",
                                    ]}
                                    handleFileAdded={handleFileAdded}
                                    handleFileRemoved={handleFileRemoved}
                                  />
                                  {/*--end::Dropzone-->*/}
                                </div>
                                {/*--end::Input group-->*/}
                                {proof_of_payment_error && (
                                    <InputFeedback
                                      type="error"
                                      message={proof_of_payment_error}
                                    />
                                )}
                              </div>
                              {/*--end::Col-->*/}
                            </div>
                            {/*--end::Card-body-->*/}
                          </div>
                          {/*-- Submit -->*/}
                          <div className="card-footer d-flex justify-content-end py-6">
                            <button disabled={
                              (!sending && !validating) ? false : true
                            }
                              type="button" onClick={resetForm}
                              className="btn btn-light btn-active-light-primary me-2"
                            >
                              Volver
                            </button>
      
                            <button type="submit" className="btn btn-primary" disabled={
                              (!sending && !validating) ? false : true
                            }>
                              {!sending && !validating && (
                                <span className="indicator-label"> Presentar matricula </span>
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
                    {!checkedEnrolled && (
                      <ShowInformation
                        information={{
                          type: "",
                          message:
                            "Seleccione el estudiante que va a ser matriculado.",
                        }}
                      />
                    )}
      
                    {checkedEnrolled && enrolled_in_annoucement === true && (
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
                    )}
                  </div>
      
                  <div className="col-xl-3" id="enrollmentInfo">
                    <div
                      className="card card-flush bg-light mb-0 mb-8"
                      data-kt-sticky="true"
                      data-kt-sticky-name="enrollmentInfo"
                      data-kt-sticky-offset="{default: false, xl: '200px'}"
                      data-kt-sticky-width="{lg: 'initial', xl: 'initial'}"
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
                              {user && <img alt={user.name} src={IMG_SRC} />}
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
                              Disponible al formalizar la matrícula.
                            </span>
                            {/*<!--end::Plan-->*/}
      
                            {/*<!--begin::Price-->*/}
                            <span className="fw-semibold text-gray-600">
                              {/* al {FormatDateToSpanish(examDates.endDate)} */}
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
                                  <code>{ formData.code || `No generado.`}</code>{" "}
                                </td>
                              </tr>
                              {/*<!--end::Row-->*/}
      
                              {/*<!--begin::Row-->*/}
                              <tr className="">
                                <td className="text-gray-400">Fecha:</td>
                                <td className="text-gray-800">
                                  {
                                  //ExtractDateTime(new Date()).date
                                  FormatDateToSpanish(ExtractDateTime(new Date()).date)
                                  
                                  }
                                </td>
                              </tr>
                              {/*<!--end::Row-->*/}
      
                              {/*<!--begin::Row-->*/}
                              <tr className="">
                                <td className="text-gray-400">Estado:</td>
                                <td>
                                  <EnrollmentBadge
                                    data={{
                                      status_code: formData.status,
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
                                  {open_announcement && open_announcement[0].name}
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
                                      status_code: formData.status_proof_payment,
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
                                    {formData.price} Fcos
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
                                      status_code: formData.status_id_card,
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
                                  {/* {exam_class_room.examCenter} */}
                                </td>
                              </tr>
                              {/*<!--end::Row-->*/}
                              {/*<!--begin::Row-->*/}
                              <tr className="">
                                <td className="text-gray-400">Aula:</td>
                                <td className="text-gray-800">
                                  {/* {exam_class_room.name} */}
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
    </Layout>
  );
}
const mapStateToProps = (state) => ({
  enrollments: state.Enrollment.enrollments,
  enrolled_in_annoucement: state.Enrollment.enrolled_in_announcement,
  enrolled_code: state.Enrollment.enrolled_code,
  open_announcement: state.Announcement.open_announcement,
  student: state.Student.student,
  students: state.Student.students,
  degrees: state.Degree.modality_degrees,
  modality_subjects: state.Subject.modality_subjects,
  general_phase_subjects: state.Subject.general_phase_subjects,
  userInfo: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_student,
  check_is_enrolled_in_annoucement,
  get_students,
  get_general_phase_subjects,
  get_modality_subjects,
  get_modality_degrees,
  get_student_enrollments,
  add_enrollment
})(AddEnrollment);
