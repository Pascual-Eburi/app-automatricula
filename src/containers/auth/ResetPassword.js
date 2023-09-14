import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";

import { reset_password } from "../../redux/actions/auth";

import usePageTitle from "../../hooks/hooks";
import SetBodyStyle from "../../helpers/fixBodyStyle";
import ShowInformation from "../../components/notifications/information";

const ResetPassword = ({ reset_password, loading }) => {
  //if (isAuthenticated ) return <Navigate to="/panel" replace/>;

  usePageTitle("Resetear Contraseña"); // title
  const pathname = window.location.pathname;
  useEffect(() => {
    window.scrollTo(0, 0);
    SetBodyStyle(pathname);
  }, []);

  const [requestSent, setRequestSent] = useState(false);

  const [formData, setFormData] = useState({ email: "" });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async(e) => {
    e.preventDefault();
 
    const reset_send = await reset_password(email);
    if (reset_send){
        setTimeout(function(){
            setRequestSent(true);

        },3000)
    }
  };

  //if (requestSent && !loading) return <Navigate to="/login" />;

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
                  <div className="app-login-logo">
                    <img
                        alt="Logo"
                        src="../../assets/media/logos/logo.png"
                        className=""
                      />
                    </div>
                    <h1 className="text-dark fw-bolder mb-3">
                      Resetar contraseña
                    </h1>

                    <div className="text-gray-500 fw-semibold fs-6 mt-10">
                      <div className="alert alert-dismissible bg-light-info border border-info border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10">
                        <div className="d-flex flex-column pe-0 pe-sm-10">
                          <h5 className="mb-1">
                            {" "}
                            ¡Ups! Parece que has olvidado tu contraseña.{" "}
                          </h5>
                          <span>
                            No te preocupes, estamos aquí para ayudarte a
                            recuperar el acceso a tu cuenta. Introduzca tu email
                            primero.
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
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => onChange(e)}
                      placeholder="name@example.com"
                    />
                    <label htmlFor="email">
                      <span className="d-flex align-items-center">
                        <i className="ki-duotone ki-sms fs-1 me-3">
                          <i className="path1"></i>
                          <i className="path2"></i>
                        </i>
                        <span className="fs-7 fw-bold text-muted">
                          Tu correo electrónico
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="d-grid mb-10">
                    <button type="submit" className="btn btn-primary">
                      <span className="indicator-label"> Enviar Código </span>

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
                <Link to="/login">Iniciar Sesion</Link>
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
  reset_password,
})(ResetPassword);
