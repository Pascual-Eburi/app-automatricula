import React, { Fragment, useEffect, useState } from "react";
import KTComponents, { KTAppSidebar } from "../../helpers/AppComponents";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import Layout from "../../hocs/Layout";
import usePageTitle from "../../hooks/hooks";
import { connect } from "react-redux";
import {
  get_enrollment,
  get_enrollment_documents,
} from "../../redux/actions/enrollment";
import { API_URL } from "../../routers/Api";
import ShowInformation from "../../components/notifications/information";
import DownloadFileButton from "../../components/downloadButton";
import { EnrollmentBadge } from "../../components/badge";
import Loader from "../../components/loader";
import DropzoneUploader from "../../components/dropzoneUploader";
import InputFeedback from "../../components/inputFeedback";
import { Link, useParams } from "react-router-dom";

function SanitizeEnrollmentDocuments({
  get_enrollment_documents,
  isAuthenticated,
  userInfo,
}) {
  usePageTitle("Reponer Documentos");
  const pathname = window.location.pathname;
  useEffect(() => {
    SetBodyStyle(pathname);
  }, []);

  const is_student = () => {
    return userInfo.user_data.rol && userInfo.user_data.rol === "student";
  };

  const params = useParams();
  const enrollment_code = params.codigo;

  const initialFormErrorState = {
    proof_of_payment_error: null,
    copy_id_card_error: null,
  };

  const initialState = {
    code: null,
    student: is_student() ? userInfo.user_data.id : "",
    proof_of_payment: [],
    copy_id_card: [],
    announcement: null,
    status: 0,
    required_id_card: null,
    required_proof_payment: null,
    status_id_card: 0,
    status_proof_payment: 0,
  };

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [sending, setSending] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({});
  const [formError, setFormError] = useState(initialFormErrorState);
  const [formData, setFormData] = useState(initialState);
  const [requiredProofPayment, setRequiredProofPayment] = useState(null);
  const [requiredIdCard, setRequiredIdCard] = useState(null);


  const { proof_of_payment_error, copy_id_card_error } = formError || {};

  useEffect(() => {
    async function fetchData() {
      const data = await get_enrollment_documents(enrollment_code);
      setEnrollmentData(data.enrollment);
      if (data) {
        setFormData({
          ...formData,
          code: data.enrollment.code,
          required_id_card: data.enrollment.status_id_card === 2,
          required_proof_payment: data.enrollment.status_proof_payment === 2,
          student: data.enrollment.student.code,
          announcement: data.enrollment.announcement.id,
          status: data.enrollment.status,
          status_id_card: data.enrollment.status_id_card,
          status_proof_payment: data.enrollment.status_proof_payment
        });

        setRequiredIdCard(
          data.enrollment.status_id_card === 2 // validado y no es valido: es obligatorio presentar de nuevo
        )
        setRequiredProofPayment(
          data.enrollment.status_proof_payment === 2
        )
      }
      setLoading(false);
    }

    if (enrollment_code) {
      fetchData();
    }

    window.scrollTo(0, 0);
    KTAppSidebar.init();
    KTComponents.init();
  }, []);

  const {
    code,
    status,
    announcement,
    status_id_card,
    status_proof_payment,
    copy_id_card,
    proof_of_payment,
  } = enrollmentData ? enrollmentData : {};

  const download_copy_id_card = {
    title: "Copia de documento actual",
    file: copy_id_card ? API_URL + copy_id_card : "",
    button_type: "button",
  };

  const download_proof_payment = {
    title: "Justificante de pago actual",
    file: proof_of_payment ? API_URL + proof_of_payment : "",
    button_type: "button",
  };



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

  /** ------------ form submit ------------ */
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    /*     const valid = await validateForm();
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
      
      setSending(false)
    } */
    //console.log(data)
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row g-3 g-xl-10 mb-5 mb-xl-10 justify-content-center">
            {enrollmentData && (
              <form className="row g-3 g-xl-10 mb-5 mb-xl-10 justify-content-center" 
              onSubmit={(e) => onSubmit(e)}
              >
                <div className="col-sm-12 col-md-5">
                  <div className="card card-flush h-lg-100">
                    <div className="card-header mt-6">
                      <div className="card-title flex-column">
                        <h3 className="fw-bold mb-1">Reponer documento</h3>

                        <div className="fs-6 text-gray-400">
                          {status_id_card !==
                          1 /*  && 
                            announcement.enrollment_end < new Date() */
                            ? "Aun puedes hacer modificaciones"
                            : " Ya no se puede modificar este documento."}
                        </div>
                      </div>

                      <div className="card-toolbar">
                        <EnrollmentBadge
                          data={{
                            status_code: status_id_card,
                            type: "document",
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-body p-9 pt-3">
                      {enrollmentData.copy_id_card ? (
                        <DownloadFileButton data={download_copy_id_card} />
                      ) : (
                        <ShowInformation
                          information={{
                            type: "warning",
                            message: "No hay copia de documento",
                          }}
                        />
                      )}

                      {status_id_card !== 1 ? (
                        <Fragment>
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
                          <div
                            className={`fv-row ${
                              copy_id_card_error ? "is-invalid" : ""
                            }`}
                          >
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
                          </div>

                          {copy_id_card_error && (
                            <InputFeedback
                              type="error"
                              message={copy_id_card_error}
                            />
                          )}
                        </Fragment>
                      ) : (
                        <ShowInformation
                          information={{
                            type: "success",
                            message:
                              "Este documento ya ha sido calificado como válido. Ya no puedes modificarlo.",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-5">
                  <div className="card card-flush h-lg-100">
                    <div className="card-header mt-6">
                      <div className="card-title flex-column">
                        <h3 className="fw-bold mb-1">Reponer documento</h3>

                        <div className="fs-6 text-gray-400">
                          {status_proof_payment ===
                          1 /* && 
                            announcement.enrollment_end < new Date() */
                            ? " Ya no se puede modificar este documento."
                            : "Aun puedes hacer modificaciones"}
                        </div>
                      </div>

                      <div className="card-toolbar">
                        <EnrollmentBadge
                          data={{
                            status_code: status_proof_payment,
                            type: "document",
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-body p-9 pt-3">
                      {enrollmentData.proof_of_payment ? (
                        <DownloadFileButton data={download_proof_payment} />
                      ) : (
                        <ShowInformation
                          information={{
                            type: "warning",
                            message: "No hay justificante de pago",
                          }}
                        />
                      )}
                      {status_proof_payment === 1 ? (
                        <ShowInformation
                          information={{
                            type: "success",
                            message:
                              "Este documento ya ha sido calificado como válido. Ya no puedes modificarlo.",
                          }}
                        />
                      ) : (
                        <Fragment>
                          <label className="col-form-label fw-semibold fs-6">
                            <span className="required">
                              Justificante de pago
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
                          <div
                            className={`fv-row ${
                              proof_of_payment_error ? "is-invalid" : ""
                            }`}
                          >
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
                          </div>

                          {proof_of_payment_error && (
                            <InputFeedback
                              type="error"
                              message={proof_of_payment_error}
                            />
                          )}
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>

                {/*-- Submit -->*/}
                <div className="col-sm-12 col-md-5"></div>
                <div className="col-sm-12 col-md-5">
                  <div className="card-footer d-flex py-6 justify-content-end">
                    <Link to="/matriculas/listado"
                      type="button"
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
                          Presentar documentos{" "}
                        </span>
                      )}
                      {sending && (
                        <span className="indicator-progress d-flex">
                          Registrando documentos...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}

                      {validating && (
                        <span className="indicator-progress d-flex">
                          Validando...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>

                </div>
                {/*-- end::Submit-->*/}
              </form>
            )}
          </div>
        </Fragment>
      )}
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  userInfo: state.Auth.user,
  isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  get_enrollment_documents,
})(SanitizeEnrollmentDocuments);
