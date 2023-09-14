import React from "react";
import Layout from "../../hocs/Layout";
import Error404Dark from "../../assets/media/auth/404-error-dark.png";
import Error404Default from "../../assets/media/auth/404-error.png";
import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="container" style={{height: "100vh"}}>
      <div className="row justify-content-center align-items-center " style={{height: "100vh"}}>
        <div className="col-md-6 card card-flush w-lg-650px py-5">
          <div className="card-body py-15 py-lg-20 text-center">
            <h1 className="fw-bolder fs-2hx text-gray-900 mb-4">Oops!</h1>

            <div className="fw-semibold fs-6 text-gray-500 mb-7">
              No se ha encontrado la página.
            </div>

            <div className="mb-3">
              <img
                alt="404"
                src={Error404Default}
                className="mw-100 mh-300px theme-light-show"
              />
              <img
                alt="404Dark"
                src={Error404Dark}
                className="mw-100 mh-300px theme-dark-show"
              />

              {/* <img src="../../assets/media/auth/404-error.png"  alt=""> */}
              {/*  <img src="../../assets/media/auth/404-error-dark.png" className="mw-100 mh-300px theme-dark-show" alt=""> */}
            </div>

            <div className="mb-0">
              <Link to="/panel" className="btn btn-sm btn-primary">
                Volver a inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error404;
