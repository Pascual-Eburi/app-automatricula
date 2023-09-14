import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { connect } from "react-redux";

import { reset_password_confirm } from "../../redux/actions/auth";

import usePageTitle from "../../hooks/hooks";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import InputFeedback from "../../components/inputFeedback";


const ResetPasswordConfirm = ({ reset_password_confirm, loading }) => {
  //if (isAuthenticated ) return <Navigate to="/panel" replace/>;

  usePageTitle("Cambiar Contraseña"); // title
  const params = useParams()

  const pathname = window.location.pathname;
  useEffect(() => {
    window.scrollTo(0, 0);
    SetBodyStyle(pathname);
  }, []);

  const [requestSent, setRequestSent] = useState(false);

  const initialFormError = {
    new_password: '',
    re_new_password: ''
  };
  const [formError, setFormError] = useState(initialFormError)
  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: ''
  })

  const { new_password,re_new_password } = formData;

  const onChange = (e) =>{
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setFormError((prevData) => ({
        ...prevData,
        [e.target.name]: '',
    }));

  }

  // validacion simple del formulario
  const validateForm = async () => {

    setFormError(initialFormError);

    let errors = 0;
    for(const input in formData){   
      const value = formData[input];

        if (value === null || value === undefined || value === ''){
            setFormError((prevData) => ({
                ...prevData,
                [input]: 'Este campo es requerido',
            }));

            errors++
        }
    }
    if (errors){ return false; }



    if (new_password.length < 8){

        setFormError((prevData) => ({
            ...prevData,
            new_password: 'La contraseña debe tener 8 carracteres como mínimo',
        }));


        return false;
    }

    if (new_password !== re_new_password){
        setFormError((prevData) => ({
            ...prevData,
            new_password: 'Las contraseñas no coinciden',
            re_new_password: 'Las contraseñas no coinciden'
        }));
        return false;
    }

    return true;

  }

  const onSubmit = async(e) => {
    e.preventDefault();
    const valid = await validateForm();
    if (!valid){ return }

    const uid = params.uid
    const token = params.token

    const reset = await reset_password_confirm(uid, token, new_password, re_new_password);

    if (reset){
        setTimeout(function(){
            setRequestSent(true);

        }, 3500)
    }
  };

  if (requestSent && !loading) return <Navigate to="/login" />;

  return (
    <>
      <div className="d-flex flex-column flex-root h-100vh login-page">
        <div className="d-flex flex-column flex-lg-row flex-column-fluid ">
          <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 ">
            <div className="d-flex flex-center flex-column flex-lg-row-fluid p-lg-50">
              <div
                className="w-lg-600px p-10 bg-white"
                style={{ borderRadius: "2rem", maxWidth: "90%" }}
              >
                <form
                  className="form w-100"
                  action="#"
                  autoComplete="off"
                  onSubmit={(e) => onSubmit(e)}
                >
                  <div className="text-center mb-11">
                    <h1 className="text-dark fw-bolder mb-3">
                      Establezca tu contraseña.
                    </h1>

                    <div className="text-gray-500 fw-semibold fs-6 mt-10">
                      <div className="alert alert-dismissible bg-light-info border border-info border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10">
                        <div className="d-flex flex-column pe-0 pe-sm-10">
                          <span>
                            Establezca tu nueva contraseña para acceder a tu cuenta. Asegurate de elegir una contraeña segura.
                          </span>
                        </div>

                        <button
                          type="button"
                          className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto"
                          data-bs-dismiss="alert"
                        >
                          <i className="ki-duotone ki-lock-2 fs-1 text-info">
                            <i className="path1"></i>
                            <i className="path2"></i>
                            <i className="path3"></i>
                            <i className="path4"></i>
                            <i className="path5"></i>
                          </i>{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="form-floating fv-row mb-8">
                    <input
                      type="password"
                      name="new_password"
                      className={`form-control ${formError.new_password ? 'is-invalid': ''}`}
                      id="new_password"
                      value={new_password}
                      onChange={(e) => onChange(e)}
                      placeholder="Una contraseña segura..."
                    />
                     <div className="text-muted fs-7 mt-2">La contraseña debe tener mínimo 8 caracteres.</div>
                     {formError.new_password && (
                              <InputFeedback
                                type="error"
                                message={formError.new_password}
                              />
                          )}
                    <label htmlFor="new_password">
                      <span className="d-flex align-items-center">
                        <i
                          className="ki-duotone ki-lock fs-1 me-3">
                          <i className="path1"></i>
                          <i className="path2"></i>
                          <i className="path3"></i>
                        </i>
                        <span className="fs-7 fw-bold text-muted">
                          Tu nueva contraseña
                        </span>
                      </span>
                    </label>
                   
                  </div>

                  <div className="form-floating fv-row mb-8">
                    <input
                      type="password"
                      name="re_new_password"
                      className={`form-control ${formError.re_new_password ? 'is-invalid': ''}`}
                      id="re_new_password"
                      value={re_new_password}
                      onChange={(e) => onChange(e)}
                      placeholder="Una contraseña segura..."
                    />
                    <div className="text-muted fs-7 mt-2">Confirme la contraseña anterior introduciéndola de nuevo aquí.</div>
                    {formError.re_new_password && (
                              <InputFeedback
                                type="error"
                                message={formError.re_new_password}
                              />
                          )}
                    <label htmlFor="re_new_password">
                      <span className="d-flex align-items-center">
                        <i
                          className="ki-duotone ki-lock fs-1 me-3">
                          <i className="path1"></i>
                          <i className="path2"></i>
                          <i className="path3"></i>
                        </i>
                        <span className="fs-7 fw-bold text-muted">
                          Repite tu contraseña
                        </span>
                      </span>
                    </label>
                  </div> 

                  <div className="d-grid mb-10">
                    <button type="submit" className="btn btn-primary">
                      <span className="indicator-label"> Restablecer contraseña </span>

                      <span className="indicator-progress">
                        Procesando...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-lg-500px d-flex flex-stack px-10 mx-auto">
              <div className="d-flex fw-semibold text-primary fs-base gap-5 justify-content-center">
                <Link to="/">Pagina Principal</Link>
                <Link to="/reset_password">Volver a enviar email</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
});

export default connect(mapStateToProps, {
  reset_password_confirm,
})(ResetPasswordConfirm);
