import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";

//import * as Loader from "react-loader-spinner";

import { login,check_authenticated, load_user, refresh } from "../../redux/actions/auth";

import usePageTitle from "../../hooks/hooks";
import SetBodyStyle from "../../helpers/fixBodyStyle";


const Login = ({ login, loading, check_authenticated, load_user, refresh }) =>{
  //if (isAuthenticated ) return <Navigate to="/panel" replace/>;

  usePageTitle('Login'); // title
  const pathname = window.location.pathname;
  useEffect(() => { SetBodyStyle(pathname); }, [pathname]);

  // change body style
  useEffect(() => {
    check_authenticated()
    load_user()
    refresh()


  }, []);

  const [formData, setFormData] = useState({ email: "", password: "", });

  const { email, password } = formData;

  const [activated, setActivated] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const login_succes = await login(email, password);
    
    if (login_succes){
      setTimeout(() => {setActivated(true); }, 5000);
    }
    //setActivated(true);
  };

  if (activated ) return <Navigate to="/panel" />;

  return (
    <>
      {/*<!--begin::Root */}
      <div className="d-flex flex-column flex-root h-100vh login-page" id="kt_app_root">
        {/*<!--begin::Authentication - Sign-in  */}
        <div className="d-flex flex-column flex-lg-row flex-column-fluid ">
          {/*<!--begin::Body */}
          <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 ">
            {/*<!--begin::Form */}
            <div className="d-flex flex-center flex-column flex-lg-row-fluid ">
              {/*<!--begin::Wrapper 
              
                <Notifications autoClose={5000} />
              */}
              
              <div className="w-lg-500px p-10 w-100">
                <div className="me-2">
                  <Link to="/" className="btn btn-icon bg-light rounded-circle">
                    <i className="ki-duotone ki-black-left fs-2 text-gray-800"></i>{" "}
                  </Link>
                </div>

                {/*<!--begin::Form */}

                <form
                  className="form w-100"
                  id="kt_sign_in_form"
                  action="#"
                  autoComplete="off"
                  onSubmit={(e) => onSubmit(e)} 
                >
                  {/*<!--begin::Heading */}
                  <div className="text-center mb-11">
                    <div className="app-login-logo">
                    <img
                        alt="Logo"
                        src="../../assets/media/logos/logo.png"
                        className=""
                      />
                    </div>
                    {/*<!--begin::Title */}
                    <h1 className="text-dark fw-bolder mb-3">
                      Inicio de sesion
                    </h1>
                    {/*<!--end::Title */}

                    {/*<!--begin::Subtitle */}
                    <div className="text-gray-500 fw-semibold fs-6">
                      Accede a tu area privada
                    </div>
                    {/*<!--end::Subtitle- */}
                  </div>
                  {/*<!--begin::Heading */}
                  {/*<!--begin::Input group-->*/}
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
                  {/*<!--end::Input group-->*/}

                  {/*<!--begin::Input group-->*/}
                  <div className="form-floating fv-row mb-8 ">
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => onChange(e)}
                      className="form-control"
                      id="password"
                      placeholder="Tu constraseña..."
                    />
                    <label htmlFor="password">
                      <span className="d-flex align-items-center">

                        <i
                          className="ki-duotone ki-lock fs-1 me-3">
                          <i className="path1"></i>
                          <i className="path2"></i>
                          <i className="path3"></i>
                        </i>
                        <span className="fs-7 fw-bold text-muted">
                          Tu contraseña
                        </span>
                      </span>
                    </label>
                  </div>
                  {/*<!--end::Input group-->*/}

                  {/*<!--begin::Wrapper */}
                  <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                    <div></div>

                    {/*<!--begin::Link */}
                    <Link to="/reset_password" className="link-primary">
                      ¿ Olvidaste tu contraseña ?
                    </Link>
                    {/*<!--end::Link */}
                  </div>
                  {/*<!--end::Wrapper */}

                  {/*<!--begin::Submit button */}
                  <div className="d-grid mb-10">
                      <button type="submit" className="btn btn-primary">
                        <span className="indicator-label"> Acceder </span>
                        {/*<!--end::Indicator label */}
  
                        {/*<!--begin::Indicator progress */}
                        <span className="indicator-progress">
                          Please wait...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                        {/*<!--end::Indicator progress */}
                      </button>
                      



                  </div>
                  {/*<!--end::Submit button */}
                </form>
                {/*<!--end::Form */}
              </div>
              {/*<!--end::Wrapper */}
            </div>
            {/*<!--end::Form */}

            {/*<!--begin::Footer */}
            <div className="w-lg-500px d-flex flex-stack px-10 mx-auto">
              {/*<!--begin::Links */}
              <div className="d-flex fw-semibold text-primary fs-base gap-5 justify-content-center">
                <Link to="/reset_password">Olividé mi contraseña</Link>
              </div>
              {/*<!--end::Links */}
            </div>
            {/*<!--end::Footer */}
          </div>
          {/*<!--end::Body */}
        </div>
        {/*<!--end::Authentication - Sign-in */}
      </div>
      {/*<!--end::Root */}
    </>
  );
};

const mapStateToProps = (state) => ({
  loading: state.Auth.loading,
  isAuthenticated: state.Auth.isAuthenticated
  //isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps, {
  login,
  check_authenticated,
  refresh,
  load_user
})(Login);
